import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Fingerprint, MoveRight, Send, MessageSquarePlus, AlertCircle } from 'lucide-react';
import { ComparisonView } from './ComparisonView';
import type { Scenario, Session, OptionId } from '../types/social';
import { submitCommunityPerspective } from '../lib/supabase';

export function ReflectionPanel({
  scenario,
  session,
  storageAvailable,
  onNext,
  onJourney,
}: {
  scenario: Scenario;
  session: Session;
  storageAvailable: boolean;
  onNext: () => void;
  onJourney: () => void;
}) {
  const original = scenario.options.find((option) => option.id === session.selectedOption)!;
  const current = scenario.options.find((option) => option.id === session.reconsideredOption);
  const unsure = session.reconsideredOption === 'unsure';
  const changed = !unsure && original.id !== current?.id;

  // The active final choice
  const finalOptionId: OptionId = (current?.id ?? original.id) as OptionId;

  // Community submission state
  const [reasoningText, setReasoningText] = useState('');
  const [alias, setAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasoningText.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitCommunityPerspective({
      scenarioId: scenario.id,
      selectedOption: finalOptionId,
      reasoning: reasoningText,
      anonymousLabel: alias.trim() || 'A fellow thinker',
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setReasoningText('');
    } else {
      setSubmitError(result.error || 'Could not submit perspective.');
    }
  };

  return (
    <section className="reflection-panel">
      <div className="flow-heading">
        <span className="reflection-check">
          <Check size={23} />
        </span>
        <p className="eyebrow">A moment worth keeping.</p>
        <h2 tabIndex={-1} data-step-heading>
          {unsure
            ? 'A little uncertainty. A lot of possibility.'
            : changed
            ? 'A new angle. Still your choice.'
            : 'Same choice. A wider perspective.'}
        </h2>
        <p>
          {unsure
            ? 'Leaving room for another answer is its own kind of progress.'
            : changed
            ? 'Changing your mind is not losing your voice. It is using it.'
            : 'Understanding another view does not mean giving up your own.'}
        </p>
      </div>

      <div className="reflection-pair">
        <div className="reflection-orb">
          <span className="eyebrow">Before</span>
          <span className="reflection-letter">{original.id}</span>
          <p>{original.label}</p>
          <small>Your first instinct</small>
        </div>
        <MoveRight className="reflection-arrow" size={46} strokeWidth={1} />
        <div className="reflection-orb reflection-orb-after">
          <span className="eyebrow">Now</span>
          <span className="reflection-letter">{unsure ? '?' : current?.id}</span>
          <p>{unsure ? 'Still open. Still thinking.' : current?.label}</p>
          <small>
            {unsure
              ? 'Making room for possibility'
              : changed
              ? 'A different direction'
              : 'Grounded in your choice'}
          </small>
        </div>
      </div>

      <div className="reflection-insight">
        <Fingerprint size={25} strokeWidth={1.4} />
        <div>
          <h3>Something to take with you</h3>
          <p>{scenario.insight}</p>
          {session.viewedResponses.length === 0 && (
            <small>
              You reflected without opening a full response. You can revisit this situation anytime to explore the reasoning.
            </small>
          )}
        </div>
      </div>

      {changed && <ComparisonView scenario={scenario} selected={current?.id ?? null} />}

      {/* Community Contribution Box */}
      <div className="community-share-card">
        <div className="community-share-header">
          <div className="community-share-badge">
            <MessageSquarePlus size={18} />
          </div>
          <div>
            <p className="eyebrow">Share with others</p>
            <h3>Add your voice to this decision</h3>
            <p className="community-share-sub">
              Your perspective will be visible live to anyone exploring this situation.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="community-share-success">
            <Check size={20} />
            <div>
              <strong>Your perspective is now live!</strong>
              <p>Other thinkers exploring &ldquo;{scenario.title}&rdquo; will now see your viewpoint.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="community-share-form">
            <div className="community-input-group">
              <label htmlFor="reasoning-input">Why did you make choice {finalOptionId}?</label>
              <textarea
                id="reasoning-input"
                rows={3}
                placeholder="Explain the reasoning behind your answer..."
                value={reasoningText}
                onChange={(e) => setReasoningText(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="community-form-footer">
              <div className="community-alias-field">
                <input
                  type="text"
                  placeholder="Pseudonym (e.g. Calm Observer)"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  disabled={isSubmitting}
                  maxLength={30}
                />
              </div>

              <button
                type="submit"
                className="button button-dark button-small"
                disabled={isSubmitting || !reasoningText.trim()}
              >
                {isSubmitting ? 'Sharing...' : 'Publish to Community'}
                <Send size={14} />
              </button>
            </div>

            {submitError && (
              <div className="community-error">
                <AlertCircle size={15} />
                <span>{submitError}</span>
              </div>
            )}
          </form>
        )}
      </div>

      <div className="reflection-save-note">
        <Check size={13} />
        <span>
          {storageAvailable
            ? 'Reflection saved on this device. Only for you.'
            : 'Reflection saved for this visit. Browser storage is unavailable.'}
        </span>
      </div>

      <div className="flow-actions">
        <button className="text-button" onClick={onJourney}>
          View my journey <ArrowUpRight size={16} />
        </button>
        <button className="button button-dark" onClick={onNext}>
          Explore another situation <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}