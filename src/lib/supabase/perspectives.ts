import type { OptionId, Perspective } from '../../types/social';
import { supabase } from './client';
import { mapDbRowToPerspective } from './mappers';
import type { CommunityDbRow } from './types';

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
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}
