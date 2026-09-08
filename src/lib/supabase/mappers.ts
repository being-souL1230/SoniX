import type { OptionId, Perspective, Scenario } from '../../types/social';
import type { CommunityDbRow, CommunityScenarioDbRow } from './types';

export function mapDbRowToPerspective(row: CommunityDbRow): Perspective {
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
