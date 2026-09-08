import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Avatar } from './Brand';
import type { OptionId, Perspective, Scenario } from '../types/social';

interface PerspectiveDetailProps {
  response: Perspective;
  scenario: Scenario;
  selected: OptionId;
  position: number;
  total: number;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onReconsider: () => void;
}

export function PerspectiveDetail({ response, scenario, selected, position, total, onBack, onPrevious, onNext, onReconsider }: PerspectiveDetailProps) {
  const sameChoice = response.selectedOption === selected;
  return (
    <section className="perspective-detail">
      <div className="detail-browser">
        <button className="text-button" onClick={onBack}><ArrowLeft size={16} /> All perspectives</button>
        <div>
          <span><strong>{String(position).padStart(2, '0')}</strong> / {String(total).padStart(2, '0')}</span>
          <button onClick={onPrevious} disabled={!onPrevious} aria-label="Previous anonymous perspective"><ArrowLeft size={16} /></button>
          <button onClick={onNext} disabled={!onNext} aria-label="Next anonymous perspective"><ArrowRight size={16} /></button>
        </div>
      </div>
      <div className="detail-identity">
        <Avatar index={response.avatar} />
        <p className="eyebrow">A different life. A different lens.</p>
        <h2 tabIndex={-1} data-step-heading>{response.anonymousLabel}</h2>
        <p className="identity-context">{response.tags.join(' / ')}</p>
      </div>
      <blockquote>&ldquo;{response.reasoning}&rdquo;</blockquote>
      <div className="detail-comparison">
        <div><span className="eyebrow">Their choice</span><p><span className="inline-choice-letter">{response.selectedOption}</span>{scenario.options.find((option) => option.id === response.selectedOption)?.label}</p></div>
        <div><span className="eyebrow">Your choice</span><p><span className="inline-choice-letter">{selected}</span>{scenario.options.find((option) => option.id === selected)?.label}</p></div>
      </div>
      <p className="detail-insight">{sameChoice ? 'The same answer can come from a completely different place. Did their reason feel like yours?' : 'You chose different paths. Is there something in their reasoning you can understand, even without agreeing?'}</p>
      <div className="flow-actions">
        <p className="data-note">A curated anonymous perspective, not a live user profile.</p>
        <button className="button button-dark" onClick={onReconsider}>Reconsider my answer <ArrowRight size={16} /></button>
      </div>
    </section>
  );
}