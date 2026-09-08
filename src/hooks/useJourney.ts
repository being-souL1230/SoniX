import { useEffect, useState } from 'react';
import { getScenario, scenarios } from '../data/scenarios';
import { findNextScenario } from '../lib/decisions';
import { optionIds, type JourneyState, type OptionId, type Session } from '../types/social';

const STORAGE_KEY = 'sonix-journey-v1';
const freshState = (): JourneyState => ({ version: 1, session: null, completedScenarios: [], savedScenarios: [] });
const isOption = (value: unknown): value is OptionId => optionIds.includes(value as OptionId);

function readJourney(): JourneyState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return freshState();
    const parsed = JSON.parse(stored);
    if (parsed.version !== 1 || !Array.isArray(parsed.completedScenarios)) return freshState();
    const completedScenarios = parsed.completedScenarios.filter((entry: Record<string, unknown>) =>
      entry && typeof entry.scenarioId === 'string' && getScenario(entry.scenarioId) &&
      isOption(entry.original) && (isOption(entry.current) || entry.current === 'unsure') &&
      Array.isArray(entry.viewedResponses) && entry.viewedResponses.every((id) => typeof id === 'string') &&
      typeof entry.completedAt === 'string' && Number.isFinite(Date.parse(entry.completedAt)),
    );
    const savedScenarios = Array.isArray(parsed.savedScenarios)
      ? [...new Set<string>(parsed.savedScenarios.filter((id: unknown): id is string => typeof id === 'string' && Boolean(getScenario(id))))]
      : [];
    const s = parsed.session;
    const validSession = s && typeof s.scenarioId === 'string' && getScenario(s.scenarioId) &&
      ['choose', 'perspectives', 'reconsider', 'reflection'].includes(s.stage) &&
      (isOption(s.selectedOption) || (s.selectedOption === null && s.stage === 'choose')) &&
      (isOption(s.reconsideredOption) || s.reconsideredOption === null || s.reconsideredOption === 'unsure') &&
      (s.stage !== 'reflection' || s.reconsideredOption !== null) &&
      Array.isArray(s.viewedResponses) && s.viewedResponses.every((id: unknown) => typeof id === 'string');
    return { version: 1, session: validSession ? s : null, completedScenarios, savedScenarios };
  } catch {
    return freshState();
  }
}

export function useJourney() {
  const [state, setState] = useState<JourneyState>(readJourney);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [state]);

  const updateSession = (updater: (session: Session) => Session) => {
    setState((previous) => previous.session ? { ...previous, session: updater(previous.session) } : previous);
  };

  const start = (scenarioId?: string, preselected?: OptionId) => {
    const next = scenarioId ? getScenario(scenarioId) : findNextScenario(scenarios, state.completedScenarios.map((entry) => entry.scenarioId));
    if (!next) return;
    setState((previous) => ({ ...previous, session: {
      scenarioId: next.id, selectedOption: preselected ?? null, reconsideredOption: null,
      stage: 'choose', viewedResponses: [],
    } }));
  };

  const choose = (option: OptionId) => updateSession((session) => session.stage === 'choose' ? { ...session, selectedOption: option } : session);
  const reveal = () => updateSession((session) => session.selectedOption && session.stage === 'choose' ? { ...session, stage: 'perspectives' } : session);
  const reconsider = () => updateSession((session) => session.selectedOption ? { ...session, stage: 'reconsider' } : session);
  const backToPerspectives = () => updateSession((session) => session.selectedOption ? { ...session, stage: 'perspectives' } : session);
  const viewResponse = (id: string) => updateSession((session) => session.stage !== 'choose' && !session.viewedResponses.includes(id)
    ? { ...session, viewedResponses: [...session.viewedResponses, id] } : session);

  const complete = (current: OptionId | 'unsure') => {
    setState((previous) => {
      const session = previous.session;
      if (!session?.selectedOption || session.stage !== 'reconsider') return previous;
      return {
        ...previous,
        session: { ...session, reconsideredOption: current, stage: 'reflection' },
        completedScenarios: [
          ...previous.completedScenarios.filter((entry) => entry.scenarioId !== session.scenarioId),
          { scenarioId: session.scenarioId, original: session.selectedOption, current, viewedResponses: session.viewedResponses, completedAt: new Date().toISOString() },
        ],
      };
    });
  };

  const openReflection = (scenarioId: string) => {
    const entry = state.completedScenarios.find((item) => item.scenarioId === scenarioId);
    if (!entry) return;
    setState((previous) => ({ ...previous, session: {
      scenarioId, selectedOption: entry.original, reconsideredOption: entry.current,
      stage: 'reflection', viewedResponses: entry.viewedResponses,
    } }));
  };

  const toggleSaved = (scenarioId: string) => {
    if (!getScenario(scenarioId)) return;
    setState((previous) => ({
      ...previous,
      savedScenarios: previous.savedScenarios.includes(scenarioId)
        ? previous.savedScenarios.filter((id) => id !== scenarioId)
        : [...previous.savedScenarios, scenarioId],
    }));
  };

  return {
    ...state, storageAvailable, start, choose, reveal, reconsider, backToPerspectives,
    viewResponse, complete, openReflection, toggleSaved,
    isSaved: (scenarioId: string) => state.savedScenarios.includes(scenarioId),
    reset: () => setState(freshState()),
  };
}

export type Journey = ReturnType<typeof useJourney>;