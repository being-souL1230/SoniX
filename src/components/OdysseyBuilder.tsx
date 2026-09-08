import { useState } from 'react';
import { ArrowRight, Check, Compass, Route } from 'lucide-react';
import { CategoryIcon } from './Brand';
import { categories } from '../data/scenarios';
import type { Category } from '../types/social';

export function OdysseyBuilder({ onCreate }: { onCreate: (categories: Category[]) => void }) {
  const [selected, setSelected] = useState<Category[]>(['Life', 'Friendship', 'Ethics']);
  const toggle = (category: Category) => {
    setSelected((current) => current.includes(category)
      ? current.filter((item) => item !== category)
      : current.length < 3 ? [...current, category] : current,
    );
  };

  return (
    <section className="odyssey-builder">
      <div className="flow-heading">
        <span className="odyssey-mark"><Compass size={30} strokeWidth={1.3} /></span>
        <p className="eyebrow">Three situations. One thoughtful arc.</p>
        <h2>Build a small perspective odyssey.</h2>
        <p>Choose up to three parts of life. SoniX will create a private three-situation path from the local collection.</p>
      </div>

      <div className="odyssey-route" aria-hidden="true">
        {[0, 1, 2].map((index) => <span key={index} className={selected[index] ? 'is-filled' : ''}>{selected[index] ? <CategoryIcon category={selected[index]} size={24} /> : index + 1}</span>)}
      </div>

      <fieldset className="odyssey-categories">
        <legend>Where would you like to look?</legend>
        {categories.map((category) => {
          const active = selected.includes(category);
          const disabled = !active && selected.length === 3;
          return (
            <button type="button" key={category} className={active ? 'is-selected' : ''} disabled={disabled} onClick={() => toggle(category)} aria-pressed={active}>
              <CategoryIcon category={category} size={24} />
              <span>{category}</span>
              {active && <Check size={13} />}
            </button>
          );
        })}
      </fieldset>

      <div className="odyssey-note"><Route size={18} /><p>Your path favors situations you have not completed. Progress stays only in this browser.</p></div>
      <button className="button button-dark button-full" disabled={selected.length === 0} onClick={() => onCreate(selected)}>
        Begin my three-situation path <ArrowRight size={17} />
      </button>
    </section>
  );
}
