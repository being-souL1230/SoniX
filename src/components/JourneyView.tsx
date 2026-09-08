import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Bookmark, Check, Fingerprint, RotateCcw, X } from 'lucide-react';
import { getScenario } from '../data/scenarios';
import type { Journey } from '../hooks/useJourney';

interface JourneyViewProps {
  journey: Journey;
  onStart: (id?: string) => void;
  onResume: () => void;
  onReflection: (id: string) => void;
}

export function JourneyView({ journey, onStart, onResume, onReflection }: JourneyViewProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const current = journey.session && getScenario(journey.session.scenarioId);
  const entries = [...journey.completedScenarios].reverse();
  const saved = journey.savedScenarios.map(getScenario).filter((scenario) => Boolean(scenario));
  const changedCount = entries.filter((entry) => entry.current !== 'unsure' && entry.current !== entry.original).length;
  const openCount = entries.filter((entry) => entry.current === 'unsure').length;
  const categoryCount = new Set(entries.map((entry) => getScenario(entry.scenarioId)?.category).filter(Boolean)).size;

  return (
    <section className="journey-view">
      <div className="flow-heading">
        <p className="eyebrow">Not a score. A story.</p>
        <h2>Your mind, in motion.</h2>
        <p>A collection of choices, second thoughts, and little shifts. Only yours.</p>
      </div>

      {entries.length > 0 && (
        <div className="journey-synthesis">
          <Fingerprint size={23} strokeWidth={1.3} />
          <p>You have explored <strong>{entries.length} {entries.length === 1 ? 'crossroad' : 'crossroads'}</strong> across <strong>{categoryCount} {categoryCount === 1 ? 'part' : 'parts'} of life</strong>. {changedCount > 0 ? `${changedCount} ${changedCount === 1 ? 'choice has' : 'choices have'} moved.` : 'Your choices have stayed grounded so far.'}{openCount > 0 ? ` ${openCount} ${openCount === 1 ? 'thought is' : 'thoughts are'} still open.` : ''}</p>
        </div>
      )}

      {current && journey.session?.stage !== 'reflection' && (
        <div className="resume-journey">
          <div><span className="eyebrow">An unfinished thought</span><p>{current.title}</p></div>
          <button className="button button-dark button-small" onClick={onResume}>Continue <ArrowRight size={16} /></button>
        </div>
      )}

      {saved.length > 0 && (
        <section className="saved-journey">
          <div className="journey-section-heading"><div><span className="eyebrow">For another moment</span><h3>Saved situations</h3></div><span>{saved.length}</span></div>
          <div className="saved-journey-list">
            {saved.map((scenario) => scenario && (
              <div key={scenario.id}>
                <button className="saved-journey-open" onClick={() => onStart(scenario.id)}><Bookmark size={15} fill="currentColor" /><span><small>{scenario.category}</small>{scenario.title}</span><ArrowUpRight size={16} /></button>
                <button className="saved-journey-remove" onClick={() => journey.toggleSaved(scenario.id)} aria-label={`Remove ${scenario.title} from saved situations`}><X size={15} /></button>
              </div>
            ))}
          </div>
        </section>
      )}

      {entries.length === 0 ? (
        <div className="journey-empty">
          <span className="empty-orb"><Fingerprint size={57} strokeWidth={1.1} /></span>
          <h3>Every shift starts somewhere.</h3>
          <p>Your before-and-after reflections will appear here after your first situation.</p>
          <button className="button button-dark" onClick={() => onStart()}>Make your first choice <ArrowRight size={17} /></button>
        </div>
      ) : (
        <div className="journey-entries">
          <div className="journey-section-heading"><div><span className="eyebrow">Before and after</span><h3>Your reflections</h3></div><span>{entries.length}</span></div>
          {entries.map((entry) => {
            const scenario = getScenario(entry.scenarioId)!;
            const changed = entry.current !== 'unsure' && entry.current !== entry.original;
            return (
              <button className="journey-entry" key={entry.scenarioId} onClick={() => onReflection(entry.scenarioId)}>
                <span className="journey-entry-content">
                  <span className="eyebrow">{scenario.category} <span className="entry-date">/ {new Date(entry.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></span>
                  <strong>{scenario.title}</strong>
                  <small>{entry.current === 'unsure' ? 'Still open to another angle' : changed ? 'A new perspective changed your choice' : 'Your choice stayed; your context grew'}</small>
                </span>
                <span className="journey-mini-reflection" aria-label={`Original choice ${entry.original}, current choice ${entry.current}`}><span>{entry.original}</span><ArrowRight size={15} /><span className="journey-current">{entry.current === 'unsure' ? '?' : entry.current}</span></span>
                <ArrowUpRight size={19} />
              </button>
            );
          })}
        </div>
      )}

      <div className="journey-privacy"><Fingerprint size={17} /><p>{journey.storageAvailable ? 'Stored only in this browser. No account, no server, no one watching.' : 'Browser storage is unavailable. Your journey works, but lasts only for this visit.'}</p></div>
      {resetDone && <p className="inline-success" role="status"><Check size={16} /> Your local journey has been cleared.</p>}
      {(entries.length > 0 || journey.session || saved.length > 0) && (
        <div className="journey-reset">
          {confirmReset ? (
            <div role="alert"><p>Clear all choices, saved situations, and reflections from this device? This cannot be undone.</p><div className="flex flex-wrap gap-3"><button className="button button-danger button-small" onClick={() => { journey.reset(); setConfirmReset(false); setResetDone(true); }}>Yes, reset my journey</button><button className="button button-outline button-small" onClick={() => setConfirmReset(false)}>Keep my journey</button></div></div>
          ) : <button className="text-button" onClick={() => setConfirmReset(true)}><RotateCcw size={14} /> Reset this demo</button>}
        </div>
      )}
    </section>
  );
}