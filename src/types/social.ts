export const optionIds = ['A', 'B', 'C', 'D'] as const;
export type OptionId = (typeof optionIds)[number];
export type Category = 'Life' | 'Friendship' | 'Career' | 'College' | 'Ethics' | 'Money' | 'Relationships' | 'Everyday';
export type Stage = 'choose' | 'perspectives' | 'reconsider' | 'reflection';

export interface Choice {
  id: OptionId;
  label: string;
}

export interface Perspective {
  id: string;
  anonymousLabel: string;
  selectedOption: OptionId;
  reasoning: string;
  tags: string[];
  avatar: number;
  isCommunity?: boolean;
}

export interface Scenario {
  id: string;
  category: Category;
  title: string;
  description: string;
  options: Choice[];
  responses: Perspective[];
  insight: string;
}

export interface Session {
  scenarioId: string;
  selectedOption: OptionId | null;
  reconsideredOption: OptionId | 'unsure' | null;
  stage: Stage;
  viewedResponses: string[];
}

export interface JourneyEntry {
  scenarioId: string;
  original: OptionId;
  current: OptionId | 'unsure';
  viewedResponses: string[];
  completedAt: string;
}

export interface JourneyState {
  version: 1;
  session: Session | null;
  completedScenarios: JourneyEntry[];
  savedScenarios: string[];
  reflectionNotes: Record<string, string>;
  activePath: GuidedPath | null;
}

export interface GuidedPath {
  scenarioIds: string[];
  currentIndex: number;
  categories: Category[];
  createdAt: string;
}