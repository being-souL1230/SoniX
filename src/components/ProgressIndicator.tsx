import { Check } from 'lucide-react';
import type { Stage } from '../types/social';

const steps: { label: string; stage: Stage }[] = [{ label: 'Choose', stage: 'choose' }, { label: 'Explore', stage: 'perspectives' }, { label: 'Reconsider', stage: 'reconsider' }, { label: 'Reflect', stage: 'reflection' }];

export function ProgressIndicator({ stage }: { stage: Stage }) {
  const current = steps.findIndex((step) => step.stage === stage);
  return <ol className="progress-indicator" aria-label="Your decision journey">{steps.map((step, index) => <li key={step.stage} className={index <= current ? 'is-reached' : ''} aria-current={index === current ? 'step' : undefined}><span className="progress-dot">{index < current ? <Check size={12} /> : `0${index + 1}`}</span><span>{step.label}</span></li>)}</ol>;
}