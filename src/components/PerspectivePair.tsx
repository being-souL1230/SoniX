import { ArrowLeft, ArrowRight, GitCompareArrows } from 'lucide-react';
import { Avatar } from './Brand';
import type { OptionId, Perspective, Scenario } from '../types/social';

export function PerspectivePair({ pair, scenario, selected, onBack, onReconsider }: { pair: [Perspective, Perspective]; scenario: Scenario; selected: OptionId; onBack: () => void; onReconsider: () => void }) {
  return (
    <section className="perspective-pair">
      <button className="text-button" onClick={onBack}><ArrowLeft size={16} /> All perspectives</button>
      <div className="flow-heading">
        <p className="eyebrow">Perspective pair</p>
        <h2 tabIndex={-1} data-step-heading>Two answers. Two reasons worth holding.</h2>
        <p>Comparison is not a contest. Notice what each person is trying to protect.</p>
      </div>
      <div className="pair-stage">
        {pair.map((response) => (
          <article className="pair-orb" key={response.id}>
            <Avatar index={response.avatar} />
            <span className="eyebrow">Chose {response.selectedOption}{response.selectedOption === selected ? ' / Like you' : ''}</span>
            <h3>{response.anonymousLabel}</h3>
            <blockquote>&ldquo;{response.reasoning}&rdquo;</blockquote>
            <p><span>{response.selectedOption}</span>{scenario.options.find((option) => option.id === response.selectedOption)?.label}</p>
          </article>
        ))}
        <span className="pair-link" aria-hidden="true"><GitCompareArrows size={23} /></span>
      </div>
      <div className="pair-prompt"><GitCompareArrows size={21} /><p>{pair[0].selectedOption === pair[1].selectedOption ? 'They reached the same choice from different lives. Which reason feels closer to your own?' : 'Their choices diverge, but both reasons hold a human need. What can you understand in each?'}</p></div>
      <div className="flow-actions"><p>A private comparison. Nothing is ranked or published.</p><button className="button button-dark" onClick={onReconsider}>Reconsider with both in mind <ArrowRight size={16} /></button></div>
    </section>
  );
}
