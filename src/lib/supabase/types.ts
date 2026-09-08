import type { OptionId } from '../../types/social';

export interface CommunityDbRow {
  id: string;
  scenario_id: string;
  selected_option: string;
  reasoning: string;
  anonymous_label: string;
  created_at: string;
}

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
