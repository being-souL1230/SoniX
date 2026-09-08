import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Choice, OptionId } from '../types/social';

export function ChoiceButton({ choice, selected, onSelect, tabbable }: { choice: Choice; selected: boolean; onSelect: (id: OptionId) => void; tabbable: boolean }) {
  return (
    <motion.button type="button" role="radio" aria-checked={selected} tabIndex={tabbable ? 0 : -1} className={`choice-button ${selected ? 'is-selected' : ''}`} onClick={() => onSelect(choice.id)} whileTap={{ scale: 0.985 }}>
      <span className="choice-letter">{choice.id}</span><span className="choice-text">{choice.label}</span><span className="choice-check">{selected ? <Check size={16} /> : <span />}</span>
    </motion.button>
  );
}

export function ChoiceList({ choices, selected, onSelect, label = 'Choose your response' }: { choices: Choice[]; selected: OptionId | null; onSelect: (id: OptionId) => void; label?: string }) {
  return (
    <div className="choice-list" role="radiogroup" aria-label={label} onKeyDown={(event) => {
      const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const index = Math.max(0, choices.findIndex((choice) => choice.id === selected));
      const direction = event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : (index + direction + choices.length) % choices.length;
      onSelect(choices[next].id);
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
    }}>
      {choices.map((choice, index) => <ChoiceButton key={choice.id} choice={choice} selected={selected === choice.id} onSelect={onSelect} tabbable={selected === choice.id || (!selected && index === 0)} />)}
    </div>
  );
}