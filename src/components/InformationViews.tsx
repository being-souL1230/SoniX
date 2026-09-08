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
        <p><strong>Local-first architecture with real-time community cloud.</strong> Seventy-three curated dilemmas paired with live community discussions powered by Supabase. React, TypeScript, and anonymous participation. No accounts, profiles, passwords, or algorithmic feeds.</p>
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
      <p className="eyebrow">Privacy & Data Architecture</p>
      <h2>Your thoughts stay private.<br />Community wisdom is shared.</h2>
      <p>SoniX uses a <strong>local-first privacy model</strong> paired with an anonymous cloud database powered by <strong>Supabase</strong>. There are no user accounts, passwords, email requirements, or personal tracking cookies.</p>

      <h3>1. What stays strictly on your device (Browser Storage)</h3>
      <p>Your personal blind choices, reconsidered votes, saved dilemma bookmarks, and private reflection notes are stored locally in your browser (<code>localStorage</code>). SoniX never tracks your personal voting history on our servers, and no analytics service monitors your choices.</p>

      <h3>2. What connects to the cloud (Supabase Database)</h3>
      <p>When you participate in community features (such as <strong>posting a dilemma</strong> or <strong>sharing an anonymous perspective</strong>), your submission is stored in our Supabase cloud database so other thinkers can discover it. These submissions are completely anonymous and never linked to personal identifiers or IP tracking.</p>

      <h3>3. Real-Time Community Sync</h3>
      <p>The platform combines 73 foundational curated dilemmas with real-time community dilemmas and perspectives fetched from Supabase, featuring instant fallback to local storage if offline.</p>

      <h3>4. How do I delete or reset my data?</h3>
      <p>Open <strong>My journey</strong> and select <strong>Reset this demo</strong>. This immediately wipes all your locally saved dilemmas, choices, reflections, and notes from your browser. Clearing your browser's site data produces the exact same result.</p>

      <div className="information-note">
        <Fingerprint size={22} />
        <p>{storageAvailable ? 'Local storage is active in this browser. Your private journey remains on this device until you choose to reset it.' : 'Local storage is unavailable. You can use the entire experience, but private progress will be lost when you close or refresh this page.'}</p>
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