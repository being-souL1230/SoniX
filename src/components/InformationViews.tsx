import { ArrowRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { howSteps, reflections } from '../data/content';
import { Avatar } from './Brand';

export function AboutView({ onStart }: { onStart: () => void }) {
  return (
    <section className="information-view">
      <p className="eyebrow">Frontend Odyssey / Reimagine Social</p>
      <h2>Not another feed.<br />Another frame of mind.</h2>
      <p>SoniX is a social experience built around human decisions. Its core concept, <strong>Perspective</strong>, replaces the usual scroll with a simple invitation: see how others would choose.</p>
      <ol className="about-steps">
        {howSteps.map((step, index) => (
          <li key={step.title}>
            <span>0{index + 1}</span>
            <div><h3>{step.title}</h3><p>{step.detail}</p></div>
          </li>
        ))}
      </ol>
      <div className="information-note">
        <Fingerprint size={23} />
        <p><strong>A deliberately frontend-only prototype.</strong> Seventy-three local situations. Eight curated perspectives for each. React, TypeScript, and your browser. No backend, database, API, authentication, or live user submissions.</p>
      </div>
      <h3>The social interaction is the shift.</h3>
      <p>Connection comes from a shared situation. Communication comes from the reason behind a choice. Discovery comes from another person's context. Participation means deciding, exploring, and reconsidering, not collecting likes.</p>
      <button className="button button-dark" onClick={onStart}>Experience it for yourself <ArrowRight size={16} /></button>
    </section>
  );
}

export function PrivacyView({ storageAvailable, onJourney }: { storageAvailable: boolean; onJourney: () => void }) {
  return (
    <section className="information-view">
      <span className="information-icon"><ShieldCheck size={36} strokeWidth={1.3} /></span>
      <p className="eyebrow">Anonymous is the starting point.</p>
      <h2>Your thoughts stay<br />on your side of the screen.</h2>
      <p>SoniX has no application backend. Your choices, opened perspectives, and reflections are held in React state and, when available, saved to <code>localStorage</code> in this browser.</p>
      <h3>What is saved?</h3>
      <p>Scenario IDs you save, your original and reconsidered choices, which curated responses you opened, and when you finished a reflection. No names, email addresses, or profile information are collected.</p>
      <h3>Who receives it?</h3>
      <p>No choices are sent to a server or analytics service. The site loads its assets and optional fonts when you open it; every product interaction then runs locally. The anonymous identities and stories are fictional, curated examples.</p>
      <h3>How do I delete it?</h3>
      <p>Open My journey and select Reset this demo. You will be asked to confirm before your saved situations, choices, and reflections are cleared. Clearing this site's browser data has the same effect.</p>
      <div className="information-note">
        <Fingerprint size={22} />
        <p>{storageAvailable ? 'Local storage is available in this browser. Your journey can continue on your next visit to this same device and browser.' : 'Local storage is unavailable. You can use the entire experience, but your progress will be lost when you close or refresh this page.'}</p>
      </div>
      <button className="button button-dark" onClick={onJourney}>Manage my journey <ArrowRight size={16} /></button>
    </section>
  );
}

export function ReflectionNote({ index, onStart }: { index: number; onStart: () => void }) {
  const note = reflections[index];
  return (
    <section className="information-view reflection-note">
      <Avatar index={note.avatar} />
      <p className="eyebrow">{note.label}</p>
      <h2>{note.title}</h2>
      <blockquote>&ldquo;{note.quote}&rdquo;</blockquote>
      <p>{note.body}</p>
      <p className="data-note">An illustrative reflection expressing the SoniX concept, not a customer testimonial.</p>
      <button className="button button-dark" onClick={onStart}>Find your own perspective <ArrowRight size={16} /></button>
    </section>
  );
}