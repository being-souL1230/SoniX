import type { OptionId, Scenario } from '../types/social';

const choiceColors = ['#365744', '#a0b7a2', '#bba7c9', '#d4b584'];

export function getDistribution(scenario: Scenario, selected: OptionId | null) {
  const total = scenario.responses.length + (selected ? 1 : 0);
  const distribution = scenario.options.map((option, index) => {
    const count = scenario.responses.filter((response) => response.selectedOption === option.id).length + (selected === option.id ? 1 : 0);
    // Exact shares keep equally sized groups equal. Only presentation text is rounded.
    const percentage = total ? count / total * 100 : 0;
    return { ...option, count, percentage, color: choiceColors[index] };
  });
  return { total, distribution };
}

export function findNextScenario(catalog: Scenario[], completedIds: string[], currentId?: string): Scenario | undefined {
  const unseen = catalog.find((scenario) => scenario.id !== currentId && !completedIds.includes(scenario.id));
  if (unseen) return unseen;
  if (catalog.length === 0) return undefined;
  const currentIndex = catalog.findIndex((scenario) => scenario.id === currentId);
  return catalog[(currentIndex + 1) % catalog.length];
}