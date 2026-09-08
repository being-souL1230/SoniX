import { createClient } from '@supabase/supabase-js';
import type { OptionId, Perspective, Scenario } from '../types/social';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface CommunityDbRow {
  id: string;
  scenario_id: string;
  selected_option: string;
  reasoning: string;
  anonymous_label: string;
  created_at: string;
}

export function mapDbRowToPerspective(row: CommunityDbRow): Perspective {
  // Generate a deterministic or pseudo-random avatar index based on id
  let hash = 0;
  for (let i = 0; i < row.id.length; i++) {
    hash = (hash << 5) - hash + row.id.charCodeAt(i);
    hash |= 0;
  }
  const avatarIndex = Math.abs(hash) % 8;

  return {
    id: `community-${row.id}`,
    anonymousLabel: row.anonymous_label || 'A fellow thinker',
    selectedOption: row.selected_option as OptionId,
    reasoning: row.reasoning,
    tags: ['Community', 'Live Response'],
    avatar: avatarIndex,
    isCommunity: true,
  };
}

export async function fetchCommunityPerspectives(scenarioId: string): Promise<Perspective[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('community_perspectives')
      .select('*')
      .eq('scenario_id', scenarioId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.warn('Could not fetch community perspectives:', error.message);
      return [];
    }

    return (data as CommunityDbRow[]).map(mapDbRowToPerspective);
  } catch (err) {
    console.error('Error fetching community perspectives:', err);
    return [];
  }
}

export async function submitCommunityPerspective({
  scenarioId,
  selectedOption,
  reasoning,
  anonymousLabel,
}: {
  scenarioId: string;
  selectedOption: OptionId;
  reasoning: string;
  anonymousLabel?: string;
}): Promise<{ success: boolean; error?: string; perspective?: Perspective }> {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const label = anonymousLabel?.trim() || 'A fellow thinker';
    const cleanReasoning = reasoning.trim();

    if (!cleanReasoning) {
      return { success: false, error: 'Reasoning cannot be empty' };
    }

    const { data, error } = await supabase
      .from('community_perspectives')
      .insert([
        {
          scenario_id: scenarioId,
          selected_option: selectedOption,
          reasoning: cleanReasoning,
          anonymous_label: label,
        },
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      perspective: mapDbRowToPerspective(data as CommunityDbRow),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to submit perspective' };
  }
}

export function subscribeToCommunityPerspectives(
  scenarioId: string,
  onNewPerspective: (perspective: Perspective) => void
): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`public:community_perspectives:scenario_id=eq.${scenarioId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'community_perspectives',
        filter: `scenario_id=eq.${scenarioId}`,
      },
      (payload) => {
        if (payload.new) {
          const mapped = mapDbRowToPerspective(payload.new as CommunityDbRow);
          onNewPerspective(mapped);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Community Scenarios (User-created Questions)
export interface CommunityScenarioDbRow {
  id: string;
  category: string;
  title: string;
  description: string;
  options: { id: OptionId; label: string }[];
  insight?: string;
  author_label?: string;
  created_at?: string;
}

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

export function mapDbRowToScenario(row: CommunityScenarioDbRow): Scenario {
  return {
    id: row.id,
    category: row.category as any,
    title: row.title,
    description: row.description,
    options: row.options,
    responses: [],
    insight: row.insight || 'Every choice carries a reason worth understanding.',
    isCommunity: true,
    authorLabel: row.author_label || 'A curious thinker',
    createdAt: row.created_at,
  };
}

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
      console.warn('Could not fetch community scenarios from Supabase, using local:', error.message);
      return localList;
    }

    const remoteList = (data as CommunityScenarioDbRow[]).map(mapDbRowToScenario);
    // Merge remote and local (avoiding duplicates)
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

  // Always save to localStorage immediately for instant local reflection
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
      // Still succeed locally
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
    supabase.removeChannel(channel);
  };
}

