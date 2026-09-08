import { useState } from 'react';
import {
  Check,
  Compass,
  HelpCircle,
  MessageSquarePlus,
  Send,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { categories, registerCommunityScenario } from '../data/scenarios';
import { CategoryIcon } from './Brand';
import { createCommunityScenario } from '../lib/supabase';
import type { Category, OptionId, Scenario } from '../types/social';

export function QuestionModal({
  onCreated,
  onCancel,
}: {
  onCreated: (scenario: Scenario) => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState<Category>('Life');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [insight, setInsight] = useState('');
  const [authorLabel, setAuthorLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and a description for your situation.');
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setError('Please provide all 4 choices (A, B, C, and D) for other thinkers to consider.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const options: { id: OptionId; label: string }[] = [
      { id: 'A', label: optionA.trim() },
      { id: 'B', label: optionB.trim() },
      { id: 'C', label: optionC.trim() },
      { id: 'D', label: optionD.trim() },
    ];

    const result = await createCommunityScenario({
      category,
      title: title.trim(),
      description: description.trim(),
      options,
      insight: insight.trim() || undefined,
      authorLabel: authorLabel.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success && result.scenario) {
      registerCommunityScenario(result.scenario);
      onCreated(result.scenario);
    } else {
      setError(result.error || 'Failed to publish situation. Please try again.');
    }
  };

  return (
    <section className="question-modal-content">
      <div className="flow-heading">
        <span className="odyssey-mark">
          <MessageSquarePlus size={30} strokeWidth={1.3} />
        </span>
        <p className="eyebrow">Ask the community</p>
        <h2>Pose a thoughtful crossroads.</h2>
        <p>
          Ask a real question without revealing anyone&apos;s answers upfront. Others will choose
          their instinct, explore diverse reasoning, and respond anonymously.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        {/* Category Selection */}
        <fieldset className="question-field-group">
          <legend className="question-label">
            <Compass size={14} /> Choose a realm of life
          </legend>
          <div className="question-category-grid">
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  className={`question-category-pill ${active ? 'is-selected' : ''}`}
                  onClick={() => setCategory(cat)}
                  aria-pressed={active}
                >
                  <CategoryIcon category={cat} size={18} />
                  <span>{cat}</span>
                  {active && <Check size={12} />}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Question Title */}
        <div className="question-input-group">
          <label htmlFor="q-title" className="question-label">
            <HelpCircle size={14} /> The Question or Dilemma
          </label>
          <input
            id="q-title"
            type="text"
            placeholder="e.g., A colleague took credit for your presentation in front of leadership. What would you do?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={140}
          />
          <span className="question-char-count">{title.length} / 140</span>
        </div>

        {/* Context / Description */}
        <div className="question-input-group">
          <label htmlFor="q-desc" className="question-label">
            Context & Background
          </label>
          <textarea
            id="q-desc"
            rows={3}
            placeholder="Explain the background so thinkers have enough context to reflect deeply..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
          />
          <span className="question-char-count">{description.length} / 500</span>
        </div>

        {/* Four Choices */}
        <fieldset className="question-field-group">
          <legend className="question-label">
            Provide 4 distinct perspectives/actions
          </legend>
          <div className="question-options-grid">
            <div className="question-option-item">
              <span className="choice-letter">A</span>
              <input
                type="text"
                placeholder="Option A (e.g. Confront them privately after the meeting)"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="question-option-item">
              <span className="choice-letter">B</span>
              <input
                type="text"
                placeholder="Option B (e.g. Send follow-up notes documenting your role)"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="question-option-item">
              <span className="choice-letter">C</span>
              <input
                type="text"
                placeholder="Option C (e.g. Let it pass but establish firm future boundaries)"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="question-option-item">
              <span className="choice-letter">D</span>
              <input
                type="text"
                placeholder="Option D (e.g. Speak directly to the team leader)"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                required
                maxLength={100}
              />
            </div>
          </div>
        </fieldset>

        {/* Optional Reflection Insight */}
        <div className="question-input-group">
          <label htmlFor="q-insight" className="question-label">
            <Sparkles size={14} /> Takeaway or Reflection Insight <small>(optional)</small>
          </label>
          <input
            id="q-insight"
            type="text"
            placeholder="A thoughtful thought to leave with the reader after they reflect..."
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            maxLength={180}
          />
        </div>

        {/* Author Alias */}
        <div className="question-input-group">
          <label htmlFor="q-alias" className="question-label">
            Your Anonymous Pseudonym
          </label>
          <input
            id="q-alias"
            type="text"
            placeholder="e.g. A Perplexed Teammate (or leave blank for 'A fellow thinker')"
            value={authorLabel}
            onChange={(e) => setAuthorLabel(e.target.value)}
            maxLength={35}
          />
        </div>

        {error && (
          <div className="community-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="question-form-actions">
          <button
            type="button"
            className="text-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish to Community'}
            <Send size={15} />
          </button>
        </div>
      </form>
    </section>
  );
}
