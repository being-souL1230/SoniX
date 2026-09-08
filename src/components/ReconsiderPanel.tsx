import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, HelpCircle, Shuffle } from 'lucide-react';
import { ChoiceList } from './ChoiceList';
import type { OptionId, Scenario } from '../types/social';

type Stance = 'keep' | 'change' | 'unsure';

export function ReconsiderPanel({ scenario, original, onBack, onComplete }: { scenario: Scenario; original: OptionId; onBack: () => void; onComplete: (option: OptionId | 'unsure') => void }) {
  const [stance, setStance] = useState<Stance | null>(null);
  const [revised, setRevised] = useState<OptionId | null>(null);
  const originalChoice = scenario.options.find((option) => option.id === original)!;
  const modes = [
    { id: 'keep' as const, label: 'I would keep my choice.', description: 'The same answer, with a little more context.', Icon: Check },
    { id: 'change' as const, label: 'I see a different way now.', description: 'Another perspective shifted something.', Icon: Shuffle },
    { id: 'unsure' as const, label: 'I am still thinking about it.', description: 'You do not have to turn curiosity into certainty.', Icon: HelpCircle },
  ];
  const canComplete = stance && (stance !== 'change' || revised);
  return <section className="reconsider-panel"><div className="flow-heading"><p className="eyebrow">There is no prize for staying the same.</p><h2 tabIndex={-1} data-step-heading>Would you choose differently?</h2><p>You have seen other angles. What feels right to you now?</p></div><div className="original-answer"><span className="eyebrow">You first chose</span><p><span className="inline-choice-letter">{original}</span>{originalChoice.label}</p></div><fieldset className="stance-options"><legend className="sr-only">How has your perspective changed?</legend>{modes.map(({ id, label, description, Icon }) => <label key={id} className={`stance-option ${stance === id ? 'is-selected' : ''}`}><input type="radio" name="reconsider-stance" value={id} checked={stance === id} onChange={() => setStance(id)} /><span className="stance-icon"><Icon size={21} strokeWidth={1.6} /></span><span><strong>{label}</strong><small>{description}</small></span><span className="stance-radio" aria-hidden="true">{stance === id && <span />}</span></label>)}</fieldset>{stance === 'change' && <motion.div className="revised-choices" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}><p className="eyebrow">Your new choice</p><ChoiceList choices={scenario.options.filter((option) => option.id !== original)} selected={revised} onSelect={setRevised} label="Choose your new answer" /></motion.div>}<div className="flow-actions"><button className="text-button" onClick={onBack}><ArrowLeft size={16} /> Explore a little more</button><button className="button button-dark" disabled={!canComplete} onClick={() => { if (stance === 'keep') onComplete(original); if (stance === 'unsure') onComplete('unsure'); if (stance === 'change' && revised) onComplete(revised); }}>See my reflection <ArrowRight size={16} /></button></div></section>;
}