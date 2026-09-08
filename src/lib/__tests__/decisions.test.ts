import { describe, it, expect } from 'vitest';
import { getDistribution, findNextScenario } from '../decisions';
import type { Scenario } from '../../types/social';

const mockScenario: Scenario = {
  id: 'test-scenario',
  category: 'Ethics',
  title: 'Test Scenario Dilemma',
  description: 'A test dilemma description.',
  insight: 'Takeaway reflection',
  options: [
    { id: 'A', label: 'Option Alpha' },
    { id: 'B', label: 'Option Beta' },
    { id: 'C', label: 'Option Gamma' },
    { id: 'D', label: 'Option Delta' },
  ],
  responses: [
    { id: 'r1', anonymousLabel: 'User 1', selectedOption: 'A', reasoning: 'Reason A', avatar: 1, tags: ['Ethics'] },
    { id: 'r2', anonymousLabel: 'User 2', selectedOption: 'A', reasoning: 'Reason A2', avatar: 2, tags: ['Ethics'] },
    { id: 'r3', anonymousLabel: 'User 3', selectedOption: 'B', reasoning: 'Reason B', avatar: 3, tags: ['Ethics'] },
    { id: 'r4', anonymousLabel: 'User 4', selectedOption: 'C', reasoning: 'Reason C', avatar: 4, tags: ['Ethics'] },
  ],
};

describe('decisions - getDistribution', () => {
  it('calculates distribution accurately without user selection', () => {
    const { total, distribution } = getDistribution(mockScenario, null);

    expect(total).toBe(4);
    expect(distribution).toHaveLength(4);

    const optionA = distribution.find((d) => d.id === 'A');
    const optionB = distribution.find((d) => d.id === 'B');
    const optionC = distribution.find((d) => d.id === 'C');
    const optionD = distribution.find((d) => d.id === 'D');

    expect(optionA?.count).toBe(2);
    expect(optionA?.percentage).toBe(50);

    expect(optionB?.count).toBe(1);
    expect(optionB?.percentage).toBe(25);

    expect(optionC?.count).toBe(1);
    expect(optionC?.percentage).toBe(25);

    expect(optionD?.count).toBe(0);
    expect(optionD?.percentage).toBe(0);
  });

  it('increments count and recalculates distribution when user makes a selection', () => {
    const { total, distribution } = getDistribution(mockScenario, 'D');

    expect(total).toBe(5);
    const optionD = distribution.find((d) => d.id === 'D');
    expect(optionD?.count).toBe(1);
    expect(optionD?.percentage).toBe(20);

    const optionA = distribution.find((d) => d.id === 'A');
    expect(optionA?.count).toBe(2);
    expect(optionA?.percentage).toBe(40);
  });

  it('handles scenarios with zero initial responses gracefully', () => {
    const emptyScenario: Scenario = {
      ...mockScenario,
      responses: [],
    };

    const withoutSelection = getDistribution(emptyScenario, null);
    expect(withoutSelection.total).toBe(0);
    withoutSelection.distribution.forEach((opt) => {
      expect(opt.count).toBe(0);
      expect(opt.percentage).toBe(0);
    });

    const withSelection = getDistribution(emptyScenario, 'B');
    expect(withSelection.total).toBe(1);
    const optB = withSelection.distribution.find((d) => d.id === 'B');
    expect(optB?.count).toBe(1);
    expect(optB?.percentage).toBe(100);
  });
});

describe('decisions - findNextScenario', () => {
  const catalog: Scenario[] = [
    { ...mockScenario, id: 'scenario-1' },
    { ...mockScenario, id: 'scenario-2' },
    { ...mockScenario, id: 'scenario-3' },
  ];

  it('returns the first unseen scenario that is not current', () => {
    const next = findNextScenario(catalog, ['scenario-1'], 'scenario-1');
    expect(next?.id).toBe('scenario-2');
  });

  it('skips all completed scenarios to find the next available one', () => {
    const next = findNextScenario(catalog, ['scenario-1', 'scenario-2'], 'scenario-1');
    expect(next?.id).toBe('scenario-3');
  });

  it('cycles to the next in catalog when all scenarios are completed', () => {
    const next = findNextScenario(catalog, ['scenario-1', 'scenario-2', 'scenario-3'], 'scenario-2');
    expect(next?.id).toBe('scenario-3');

    const loopBack = findNextScenario(catalog, ['scenario-1', 'scenario-2', 'scenario-3'], 'scenario-3');
    expect(loopBack?.id).toBe('scenario-1');
  });

  it('returns undefined if catalog is empty', () => {
    const next = findNextScenario([], []);
    expect(next).toBeUndefined();
  });
});
