import { describe, it, expect } from 'vitest';
import { scenarios } from '../../data/scenarios';

describe('Content and Scenario Integrity', () => {
  it('contains at least 20 core curated scenarios', () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(20);
  });

  it('ensures all scenarios have unique non-empty IDs', () => {
    const ids = scenarios.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    ids.forEach((id) => {
      expect(id.trim()).not.toBe('');
    });
  });

  it('ensures each scenario has valid title, category, and context description', () => {
    scenarios.forEach((s) => {
      expect(s.title.trim().length).toBeGreaterThan(5);
      expect(s.description.trim().length).toBeGreaterThan(15);
      expect(s.category.trim().length).toBeGreaterThan(2);
    });
  });

  it('ensures each scenario defines exactly 4 distinct options (A, B, C, D)', () => {
    const validOptionIds = ['A', 'B', 'C', 'D'];

    scenarios.forEach((s) => {
      expect(s.options).toHaveLength(4);
      const optionIds = s.options.map((o) => o.id);
      expect(optionIds).toEqual(validOptionIds);

      s.options.forEach((opt) => {
        expect(opt.label.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('ensures every perspective in responses references a valid option and has reasoning', () => {
    const validOptionIds = new Set(['A', 'B', 'C', 'D']);

    scenarios.forEach((s) => {
      expect(s.responses.length).toBeGreaterThanOrEqual(4);
      s.responses.forEach((resp) => {
        expect(validOptionIds.has(resp.selectedOption)).toBe(true);
        expect(resp.reasoning.trim().length).toBeGreaterThan(5);
        expect(resp.anonymousLabel.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
