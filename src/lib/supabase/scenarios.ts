import type { OptionId, Scenario } from '../../types/social';
import { supabase } from './client';
import { mapDbRowToScenario } from './mappers';
import type { CommunityScenarioDbRow } from './types';

const LOCAL_SCENARIOS_KEY = 'sonix_community_scenarios_v1';

export function getLocalCommunityScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(LOCAL_SCENARIOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalCommunityScenario(scenario: Scenario): void {
  try {
    const existing = getLocalCommunityScenarios();
    const filtered = existing.filter((s) => s.id !== scenario.id);
    localStorage.setItem(LOCAL_SCENARIOS_KEY, JSON.stringify([scenario, ...filtered]));
  } catch (err) {
    console.warn('Failed to save community scenario to localStorage', err);
  }
}

let hasWarnedSchema = false;

export async function fetchCommunityScenarios(): Promise<Scenario[]> {
  const localList = getLocalCommunityScenarios();
  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('community_scenarios')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      if (!hasWarnedSchema) {
        hasWarnedSchema = true;
        console.warn('Note: Supabase table "community_scenarios" not found. Using local-first storage. Run "supabase/schema.sql" in Supabase SQL Editor to enable cloud sync.');
      }
      return localList;
    }

    const remoteList = (data as CommunityScenarioDbRow[]).map(mapDbRowToScenario);
    const combined = [...remoteList];
    for (const local of localList) {
      if (!combined.some((s) => s.id === local.id)) {
        combined.push(local);
      }
    }
    return combined;
  } catch (err) {
    console.error('Error fetching community scenarios:', err);
    return localList;
  }
}

export async function createCommunityScenario({
  category,
  title,
  description,
  options,
  insight,
  authorLabel,
}: {
  category: string;
  title: string;
  description: string;
  options: { id: OptionId; label: string }[];
  insight?: string;
  authorLabel?: string;
}): Promise<{ success: boolean; error?: string; scenario?: Scenario }> {
  const newId = `community-q-${Date.now()}`;
  const author = authorLabel?.trim() || 'A fellow thinker';
  const newScenario: Scenario = {
    id: newId,
    category: category as any,
    title: title.trim(),
    description: description.trim(),
    options,
    responses: [],
    insight: insight?.trim() || 'Every choice carries a reason worth understanding.',
    isCommunity: true,
    authorLabel: author,
    createdAt: new Date().toISOString(),
  };

  saveLocalCommunityScenario(newScenario);

  if (!supabase) {
    return { success: true, scenario: newScenario };
  }

  try {
    const { data, error } = await supabase
      .from('community_scenarios')
      .insert([
        {
          id: newId,
          category,
          title: title.trim(),
          description: description.trim(),
          options,
          insight: newScenario.insight,
          author_label: author,
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn('Failed to publish to Supabase, but saved locally:', error.message);
      return { success: true, scenario: newScenario };
    }

    return {
      success: true,
      scenario: mapDbRowToScenario(data as CommunityScenarioDbRow),
    };
  } catch (err: any) {
    console.warn('Error during community scenario publication:', err);
    return { success: true, scenario: newScenario };
  }
}

export function subscribeToCommunityScenarios(
  onNewScenario: (scenario: Scenario) => void
): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('public:community_scenarios')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'community_scenarios',
      },
      (payload) => {
        if (payload.new) {
          const mapped = mapDbRowToScenario(payload.new as CommunityScenarioDbRow);
          onNewScenario(mapped);
        }
      }
    )
    .subscribe();

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}
