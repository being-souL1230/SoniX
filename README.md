# SoniX

## See the Other Side of Social

SoniX is a premium social dilemma and perspective-sharing platform built around **decisions, not posts**. The working concept, **Perspective**, asks a simple question: *"See how others would choose."*

Instead of doomscrolling through profiles or algorithms, a visitor encounters a real-life situation, makes an uninfluenced first choice, explores the diverse reasoning behind other choices, and decides whether their own perspective has shifted.

**Choose > Reveal > Explore > Reconsider > Reflect.**

![SoniX Hero Section](public/images/Hero%20Section.png)

---

## What Makes SoniX Different

1. **Anonymous Perspectives, Not Influencers**: Every opinion is grounded in personal reasoning, not usernames, follower counts, or vanity metrics.
2. **Curated Odyssey**: Select up to 3 life realms to embark on a guided 3-situation reflective path. Tracks progress (1-2-3), avoids completed scenarios, and persists across browser refreshes.
3. **Perspective Pair Comparison**: Select any two anonymous perspectives to compare side-by-side in a circular composition—without popularity contests or ranking scores.
4. **Private Reflection Notes**: Record personal 400-character notes alongside completed decisions. Editable, reviewable in *My Journey*, and kept strictly in browser `localStorage`.
5. **Community Dilemmas & Live Perspectives**: Thinkers can author their own dilemmas with 4 distinct options and contribute perspectives in real-time, supported by Supabase with seamless local-first offline fallback.
6. **No Infinite Feeds or Ads**: Free access, no mandatory signup or credit card requirements, and zero dark patterns.

---

## Running Locally

### Requirements
- Node.js 20.19+ or 22.12+
- npm

### Development
```sh
npm install
npm run dev
```

### Verification & Automated Testing
```sh
# Run TypeScript type safety check (0 errors)
npm run typecheck

# Run Vitest unit tests (distribution math, scenario & schema integrity)
npm run test

# Run tests in interactive watch mode
npm run test:watch
```

### Production Build & Preview
```sh
npm run build
npm run preview
```

The production output is generated in `dist/` using Vite multi-chunk code splitting (`vendor-react`, `vendor-motion`, `vendor-supabase`, `vendor-icons`, and lazy-loaded `DecisionExperience`). Initial HTML payload is just **~1.66 kB**.

---

## Real-Time & Local-First Resilience

SoniX is built **local-first**:
- **Zero-Config Default**: Operates 100% locally out-of-the-box using browser `localStorage` and curated catalog data.
- **Optional Supabase Live Sync**: When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided in `.env`, SoniX automatically enables live community questions and real-time perspective subscriptions via Postgres changes.
- **Graceful Fallbacks**: If network calls fail or Supabase is unconfigured, all operations seamlessly fall back to local browser storage without throwing errors or interrupting the user journey.

---

## Product Experience

### 1. Discover
An editorial landing experience featuring sticky navigation, original circular branding artwork, interactive how-it-works steps, a featured dilemma, curated realm discovery, benefit accordions, and native FAQ disclosures.

### 2. Choose
A clean circular presentation of a situation, category, background context, and four distinct choices. The reveal action remains disabled until a choice is selected. Radio-style controls support arrow keys, Home, End, Space, and Enter.

### 3. Reveal and Explore
Reveals a proportional choice distribution and anonymous perspective circles. Opening any perspective reveals full contextual reasoning, identity tag, and a direct relationship comparison with the visitor's choice. Explored perspectives are marked without vanity scores.

### 4. Perspective Pair
Enables side-by-side comparison of any two viewpoints in an unclipped circular layout, highlighting nuanced contrasts without ranking them.

### 5. Reconsider
The visitor can reaffirm their original answer ("Keep"), embrace a new viewpoint ("Change"), or remain thoughtfully "Unsure". Changing requires selecting a new option.

### 6. Reflect & Private Notes
Before and after appear as linked circular states. Users can jot down private 400-character reflection notes saved exclusively to local storage.

### 7. Curated Odyssey
A guided 3-stage journey tailored to chosen life realms (Career, Ethics, Relationships, College, etc.), guiding the user through successive dilemmas.

### 8. Explore Catalog & Community Questions
Browse dozens of situations across eight categories. Includes category filtering, real-time search, "Surprise me" randomizer, and the **"Post a Question"** modal for community dilemmas.

### 9. My Journey
Resume unfinished situations, revisit completed reflections with personal notes, or reset the journey with confirmation.

---

## Content & Realms

Situations span eight primary realms of life:
- **Life** & **Everyday**
- **Friendship** & **Relationships**
- **Career** & **College**
- **Ethics** & **Money**

Each dilemma features 4 distinct options (A, B, C, D) and thoughtfully authored perspectives with diverse thinking styles (analytical, cautious, empathetic, bold).

---

## Architecture & Code Organization

```text
src/
  App.tsx                         Application shell, hash-based routing, navigation overlays
  main.tsx                        React 19 entry point
  index.css                       Tailwind CSS v4, design tokens, responsive typography
  types/social.ts                 Core domain types (Scenario, Perspective, Journey, Session)
  data/
    scenarios.ts                  20 core foundational scenarios & curated perspectives
    additionalScenarios.ts        Expanded catalog of life dilemmas
    content.ts                    Landing editorial copy, FAQ, and steps
  hooks/
    useJourney.ts                 State machine transitions, persistence, odyssey & note management
  lib/
    decisions.ts                  Proportional distribution math and scenario sequencing
    supabase/
      client.ts                   Supabase client initialization & env guard
      types.ts                    Database row interfaces
      mappers.ts                  DB-to-domain model converters
      perspectives.ts             Community perspective queries, inserts, and realtime stream
      scenarios.ts                Community questions queries, inserts, and local storage fallback
      index.ts                    Unified service export
    __tests__/
      decisions.test.ts           Unit tests for distribution math and scenario cycling
      content-integrity.test.ts   Automated validation for all scenarios, choices, and perspectives
  components/
    Brand.tsx                     SVG brand marks, category badges, anonymous avatars
    Navigation.tsx                Sticky desktop & mobile navigation with quick actions
    Footer.tsx                    Navigation, privacy, and project disclosure
    Modal.tsx                     Accessible dialog with focus trap, Escape, and scroll locking
    Reveal.tsx                    Reduced-motion-safe animations
    ScenarioCard.tsx              Circular dilemma card component
    ChoiceList.tsx                Keyboard-accessible radio group
    ProgressIndicator.tsx         Visual stage progress tracker
    DecisionExperience.tsx        Lazy-loaded choose-to-reflect core journey
    ComparisonView.tsx            State-derived circular perspective distribution
    PerspectiveCard.tsx           Anonymous perspective circle preview
    PerspectiveCollection.tsx     Desktop grid and swipeable mobile perspective controls
    PerspectiveDetail.tsx         Full reasoning modal and answer contrast
    PerspectivePair.tsx           Side-by-side comparison modal for two viewpoints
    QuestionModal.tsx             Modal for posting community questions
    OdysseyBuilder.tsx            Guided 3-situation journey builder
    ReconsiderPanel.tsx           Keep, change, or unsure interaction panel
    ReflectionPanel.tsx           Before/after comparison and private reflection note editor
    JourneyView.tsx               Personal journey history, note previews, and reset dialog
    InformationViews.tsx          About, privacy, and methodology disclosures
public/
  images/Hero Section.png         Hero section illustration & previews
  images/perspective-world.png    Original compressed perspective artwork
  sonix-mark.svg                  Vector brand favicon
docs/
  QA.md                           Quality assurance guide & executed test matrix
```

---

## Accessibility & Performance

- **Accessible Semantics**: Native button, heading, fieldset, details/summary, and ARIA attributes used throughout.
- **Keyboard Navigation**: Full keyboard operability (Tab, Shift+Tab, Arrow keys, Home, End, Escape). Dialogs trap and restore focus with inert background.
- **Motion Preferences**: Respects `prefers-reduced-motion` across CSS animations and Framer Motion configurations (`MotionConfig reducedMotion="user"`).
- **Zero Asset Bloat**: Unused Three.js dependencies removed; lightweight SVG avatars eliminate external image requests.
- **Code Splitting**: Dynamic `React.lazy` loading for `DecisionExperience` with vendor chunk isolation for long-term browser caching.
- **Font Fallbacks**: Uses `font-display: swap` for DM Sans and Manrope with clean local sans-serif fallbacks.

---

## Verification & QA

Automated tests and typechecking can be verified anytime:
- `npm run typecheck` — 0 errors across all source and test files.
- `npm run test` — 12 automated unit tests passing in Vitest.
- `npm run build` — Production build succeeds with optimized bundle chunks.

For manual browser testing steps across viewports (375px to 1440px), refer to [docs/QA.md](file:///d:/Projects/SoniX/docs/QA.md).

---

## License & Attribution

Designed and developed as an exploration in thoughtful, anonymous social interaction.