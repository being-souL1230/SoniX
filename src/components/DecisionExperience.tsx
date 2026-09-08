import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bookmark, LockKeyhole } from 'lucide-react';
import { getScenario, scenarios } from '../data/scenarios';
import type { Journey } from '../hooks/useJourney';
import { findNextScenario } from '../lib/decisions';
import { fetchCommunityPerspectives, subscribeToCommunityPerspectives } from '../lib/supabase';
import type { Perspective } from '../types/social';
import { ChoiceList } from './ChoiceList';
import { ComparisonView } from './ComparisonView';
import { PerspectiveCollection } from './PerspectiveCollection';
import { PerspectiveDetail } from './PerspectiveDetail';
import { PerspectivePair } from './PerspectivePair';
import { ProgressIndicator } from './ProgressIndicator';
import { ReconsiderPanel } from './ReconsiderPanel';
import { ReflectionPanel } from './ReflectionPanel';
import { ScenarioCard } from './ScenarioCard';

export default function DecisionExperience({ journey, onJourney }: { journey: Journey; onJourney: () => void }) {
  const [detailId, setDetailId] = useState<string | null>(null);
  const [comparisonPair, setComparisonPair] = useState<[Perspective, Perspective] | null>(null);
  const [communityResponses, setCommunityResponses] = useState<Perspective[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const session = journey.session;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      root.current?.closest('.modal-scroll')?.scrollTo({ top: 0 });
      root.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [session?.stage, session?.scenarioId, detailId]);

  // Fetch community perspectives & subscribe to live inserts
  useEffect(() => {
    if (!session?.scenarioId) return;

    let isMounted = true;
    fetchCommunityPerspectives(session.scenarioId).then((data) => {
      if (isMounted) {
        setCommunityResponses(data);
      }
    });

    const unsubscribe = subscribeToCommunityPerspectives(session.scenarioId, (newPerspective) => {
      setCommunityResponses((prev) => {
        if (prev.some((p) => p.id === newPerspective.id)) return prev;
        return [newPerspective, ...prev];
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [session?.scenarioId]);

  if (!session) return null;
  const scenario = getScenario(session.scenarioId);
  if (!scenario) return null;

  // Combine live community perspectives with seeded perspectives
  const allResponses = [...communityResponses, ...scenario.responses];
  const detail = allResponses.find((response) => response.id === detailId);
  const detailIndex = detail ? allResponses.findIndex((response) => response.id === detail.id) : -1;

  const openDetail = (index: number) => {
    const response = allResponses[index];
    if (!response) return;
    journey.viewResponse(response.id);
    setDetailId(response.id);
  };

  const chooseNext = () => {
    setDetailId(null);
    setComparisonPair(null);
    if (journey.activePath) {
      if (journey.activePath.currentIndex < journey.activePath.scenarioIds.length - 1) {
        journey.advancePath();
      } else {
        journey.finishPath();
        onJourney();
      }
      return;
    }
    const next = findNextScenario(
      scenarios,
      journey.completedScenarios.map((entry) => entry.scenarioId),
      scenario.id
    );
    if (next) journey.start(next.id);
  };

  const reconsider = () => {
    setDetailId(null);
    setComparisonPair(null);
    journey.reconsider();
  };

  return (
    <div className="decision-experience" ref={root}>
      <ProgressIndicator stage={session.stage} />
      {journey.activePath && (
        <div
          className="odyssey-progress"
          aria-label={`Odyssey situation ${journey.activePath.currentIndex + 1} of ${journey.activePath.scenarioIds.length}`}
        >
          <span>Perspective odyssey</span>
          <div>
            {journey.activePath.scenarioIds.map((id, index) => (
              <span key={id} className={index <= journey.activePath!.currentIndex ? 'is-reached' : ''}>
                {index + 1}
              </span>
            ))}
          </div>
        </div>
      )}
      <motion.div
        key={`${scenario.id}-${session.stage}-${detail?.id ?? ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {session.stage === 'choose' && (
          <section>
            <div className="flow-heading">
              <p className="eyebrow">Your first instinct belongs to you.</p>
              <h2 tabIndex={-1} data-step-heading>
                First, what would you do?
              </h2>
              <p>No right answer. No crowd to follow. Just a moment to choose.</p>
            </div>
            <div className="decision-layout">
              <ScenarioCard scenario={scenario} />
              <div className="decision-choices">
                <p className="eyebrow">Choose the answer closest to you</p>
                <ChoiceList choices={scenario.options} selected={session.selectedOption} onSelect={journey.choose} />
                <p className="choice-reassurance">
                  <LockKeyhole size={14} /> Other perspectives stay hidden until you choose.
                </p>
                <button
                  className="button button-dark button-full"
                  disabled={!session.selectedOption}
                  onClick={journey.reveal}
                >
                  Reveal other perspectives <ArrowRight size={17} />
                </button>
              </div>
            </div>
            <div className="decision-meta-actions">
              <p className="prototype-note">
                An anonymous social experience. All perspectives are thoughtfully explored together.
              </p>
              <button
                className={`decision-save ${journey.isSaved(scenario.id) ? 'is-saved' : ''}`}
                onClick={() => journey.toggleSaved(scenario.id)}
                aria-pressed={journey.isSaved(scenario.id)}
              >
                <Bookmark size={13} fill={journey.isSaved(scenario.id) ? 'currentColor' : 'none'} />
                {journey.isSaved(scenario.id) ? 'Saved for another moment' : 'Save for another moment'}
              </button>
            </div>
          </section>
        )}

        {session.stage === 'perspectives' && !detail && !comparisonPair && session.selectedOption && (
          <section>
            <div className="flow-heading">
              <p className="eyebrow">The same situation. A different story.</p>
              <h2 tabIndex={-1} data-step-heading>
                Meet the minds behind the choices.
              </h2>
              <p>Open a perspective. Look for a reason you had not considered.</p>
            </div>
            <ComparisonView scenario={scenario} selected={session.selectedOption} />
            <div className="perspectives-heading">
              <h3>There is a person behind every answer.</h3>
              <span>
                {session.viewedResponses.length} of {allResponses.length} explored
              </span>
            </div>
            <PerspectiveCollection
              responses={allResponses}
              viewed={session.viewedResponses}
              selected={session.selectedOption}
              onCompare={(pair) => {
                pair.forEach((response) => journey.viewResponse(response.id));
                setComparisonPair(pair);
              }}
              onOpen={(response) => {
                journey.viewResponse(response.id);
                setDetailId(response.id);
              }}
            />
            <div className="flow-actions flow-actions-sticky">
              <p>No most-popular opinion. Just more ways to see it.</p>
              <button className="button button-dark" onClick={reconsider}>
                Reconsider my answer <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {session.stage === 'perspectives' && detail && session.selectedOption && (
          <PerspectiveDetail
            response={detail}
            scenario={scenario}
            selected={session.selectedOption}
            position={detailIndex + 1}
            total={allResponses.length}
            onBack={() => setDetailId(null)}
            onPrevious={detailIndex > 0 ? () => openDetail(detailIndex - 1) : undefined}
            onNext={detailIndex < allResponses.length - 1 ? () => openDetail(detailIndex + 1) : undefined}
            onReconsider={reconsider}
          />
        )}
        {session.stage === 'perspectives' && comparisonPair && session.selectedOption && (
          <PerspectivePair
            pair={comparisonPair}
            scenario={scenario}
            selected={session.selectedOption}
            onBack={() => setComparisonPair(null)}
            onReconsider={reconsider}
          />
        )}
        {session.stage === 'reconsider' && session.selectedOption && (
          <ReconsiderPanel
            scenario={scenario}
            original={session.selectedOption}
            onBack={journey.backToPerspectives}
            onComplete={journey.complete}
          />
        )}
        {session.stage === 'reflection' && session.selectedOption && (
          <ReflectionPanel
            scenario={scenario}
            session={session}
            storageAvailable={journey.storageAvailable}
            note={journey.reflectionNotes[scenario.id] ?? ''}
            onSaveNote={(note) => journey.saveReflectionNote(scenario.id, note)}
            nextLabel={
              journey.activePath
                ? journey.activePath.currentIndex < 2
                  ? 'Continue my odyssey'
                  : 'Complete my odyssey'
                : undefined
            }
            onNext={chooseNext}
            onJourney={onJourney}
          />
        )}
      </motion.div>
    </div>
  );
}