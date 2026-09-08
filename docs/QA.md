# SoniX Verification Guide

## Verification Status: Executed vs Planned

| Layer / Check | Status | Verification Tool / Command | Evidence & Result |
| :--- | :--- | :--- | :--- |
| **Static Type Check** | **EXECUTED** | `npm run typecheck` (`tsc --noEmit`) | 0 TypeScript errors across source, pages, components, and tests |
| **Unit Test Suite** | **EXECUTED** | `npm run test` (`vitest run`) | 12 tests passed: `decisions.test.ts` (distribution math & scenario sequencing), `content-integrity.test.ts` (validates all 74 curated scenarios, 4 options A-D each, unique IDs, and valid perspectives & reasoning) |
| **Production Multi-Chunk Build** | **EXECUTED** | `npm run build` (`vite build`) | Successful. Monolithic singlefile eliminated; HTML payload reduced to 1.68 kB with dedicated chunks for React, Framer Motion, Supabase, Lucide icons, and lazy-loaded `DecisionExperience` |
| **Content Integrity & Data Schema** | **EXECUTED** | Automated test suite | All 74 curated scenarios verified (20 foundational seeds + 54 expanded drafts) across 8 life realms with 592 curated perspectives and thinking archetypes |
| **Interactive Guided Tour** | **EXECUTED** | Architectural & component test (`GuidedTour.tsx`) | Non-blocking floating bottom HUD dock, dynamic target element spotlight rings with fine-tuned vertical offset, live click pass-through, page synchronization, "Try it now" pausing, keyboard navigation, and localStorage persistence |
| **Supabase Architecture Split** | **EXECUTED** | Architectural refactor | Isolated into `client.ts`, `types.ts`, `mappers.ts`, `perspectives.ts`, `scenarios.ts` with local-first offline fallback |
| **Browser E2E / Interaction Flow** | **PLANNED** | Manual / Headless browser | Documented checklist below (Choose → Reveal → Explore → Reconsider → Reflect) |
| **Responsive Viewport Matrix** | **PLANNED** | Visual matrix (375px–1440px) | Viewport plan defined in table below |
| **Accessibility (axe / Screen Reader)** | **PLANNED** | axe-core / VoiceOver / NVDA | Native semantics, focus trap, and ARIA patterns implemented; browser-driven axe run planned |

## Build and Source Verification Details

- **Production build**: Executed successfully with Vite 7 multi-chunk architecture (`dist/index.html` at 1.68 kB).
- **Curated scenarios**: 74 total (20 core seeds + 54 expanded situations) across 8 life realms, all verified with unique IDs and 4 distinct options (A-D).
- **Curated perspectives**: 592 authentic perspectives authored across 8 thinking archetypes (*The Quiet Optimist*, *The Grounded Realist*, *The Boundary Keeper*, etc.).
- **Interactive Guided Tour**: Non-blocking floating bottom HUD dock (`fixed bottom-5`), pointer-events pass-through on glowing target spotlights, live Discover/Explore routing synchronization, and quick "Try it now" pause/resume mechanism.
- **Backend resilience**: Supabase integration operates in local-first fallback mode (`localStorage`) when environment variables are omitted or network is offline, ensuring 100% functionality out-of-the-box.

---

## Interactive Guided Tour Verification

1. **First-Visit Auto Prompt**: Open SoniX in a fresh browser session (or clear `localStorage`). Confirm the welcome card automatically appears after a 1.2s delay.
2. **Welcome Card Layout**: Confirm the dialog displays the BrandMark, "See the other side of social" heading, the 3 core pillars (Blind First Choice, Explore Diverse Reasons, Reconsider & Private Notes) without cluttering nested boxes, and clear "Skip" and "Start Tour" action buttons.
3. **Step 1 — Blind Choice**: Click "Start Tour". Confirm the screen is not blocked by an opaque modal. Confirm the floating tour HUD appears at `bottom-5` and a glowing spotlight ring highlights the hero decision button (`[data-tour="hero-start"]`).
4. **Try It Now Pausing**: Click "Try now" (or the highlighted button). Confirm the tour pauses into a small floating "Resume Tour" button in the bottom corner while the decision modal opens. Confirm clicking "Resume Tour" restores the tour at the active step.
5. **Step 2 — Live Explore**: Advance to Step 2. Confirm the page automatically transitions to the Explore page (`#explore`). Confirm the spotlight highlights the category filter bar with a fine-tuned vertical offset (-8px) for optimal visual alignment. Confirm clicking filter tags updates the page in real-time beneath the tour.
6. **Step 3 — Curated Odyssey**: Advance to Step 3. Confirm the spotlight highlights the "Build an odyssey" button (`[data-tour="explore-odyssey"]`).
7. **Step 4 — Community Dilemmas**: Advance to Step 4. Confirm the spotlight highlights the "Ask a question" action in the top navigation bar (`[data-tour="nav-ask"]`).
8. **Step 5 — My Journey**: Advance to Step 5. Confirm the spotlight highlights "My journey" (`[data-tour="nav-journey"]`).
9. **Skip & Keyboard Controls**: Press `Escape` or click "Skip tour" at any step. Confirm the tour closes cleanly and sets `sonix_tour_seen_v1` in `localStorage` so recurring visits are not interrupted. Test left and right arrow keys to step backward and forward.
10. **Re-triggering Tour**: Click "Guided Tour" in desktop navigation (or "Quick Tour" in the mobile drawer). Confirm the tour immediately reopens at Step 1 for returning visitors.

---

## Core Journey

1. Open Discover and activate **Start exploring**.
2. Confirm the reveal action is disabled before selecting an answer and no perspective results are visible.
3. Select option **A**. Confirm A is visibly selected and the reveal action becomes enabled.
4. Use the arrow keys, Home, and End to move through choices. Confirm focus and selection agree.
5. Reveal the responses. Confirm the distribution includes eight curated perspectives plus one visitor choice.
6. Open a matching perspective and read the full response. Return to all perspectives.
7. Open a contrasting perspective. Confirm its chosen option differs from the visitor's original answer and it is marked explored afterward.
8. Reconsider. Select the change action. Confirm the final action is disabled until a different choice is selected.
9. Choose **C** and save the reflection. Confirm Before is A, Now is C, and the diagram uses the new choice.
10. Open **My journey**. Confirm the entry displays A to C and opens the same reflection.
11. Repeat with **Keep**. Confirm both circles show the original answer and the copy does not claim that the answer changed.
12. Repeat with **Unsure**. Confirm the current state is a question mark and does not silently replace the original option.
13. Continue to the next situation. Confirm it has different content and all perspectives are hidden again.

---

## Explore and Navigation

1. Open **Explore** from desktop navigation and from the mobile menu.
2. Select every category. On a small screen, use the native topic selector. Confirm only matching situations remain.
3. Search for a word within a title, context, or category. Confirm filtering is case-insensitive.
4. Enter an unmatched query and verify the empty-state reset action restores all items.
5. Toggle **Saved only** and **Community questions only** filters to confirm correct isolation of bookmarked and community dilemmas.
6. Use **A few more possibilities** to progressively load scenarios. Confirm the catalog ends cleanly at 74 curated scenarios, avoiding infinite doomscrolling.
7. Use **Surprise me**. Confirm it opens a random situation from the filtered results, or the entire collection if there are no matches.
8. Test Discover, Explore, How it works, brand-home links, browser Back, and browser Forward.
9. Test every footer link, the back-to-top control, FAQ disclosure, how-it-works step, benefit accordion, and illustrative reflection.
10. Activate **Skip to content** while on Explore. Confirm it focuses the Explore content without navigating back to Discover.

---

## Persistence and Privacy

1. Select an option and close the dialog. Open **My journey** and resume the unfinished situation.
2. Refresh the page. Confirm the session and completed reflections remain in the same browser.
3. Complete the same scenario again. Confirm its existing journey entry is replaced by the latest reflection, not duplicated.
4. Open **Reset this demo**. Cancel and confirm the journey is unchanged.
5. Open reset again and confirm. Verify both the active situation and saved reflections are cleared.
6. Block site storage. Confirm the core flow still works and the privacy message explains that progress lasts only for this visit.
7. Put invalid JSON or an incompatible version into `sonix-journey-v1`. Refresh and confirm a fresh, usable journey is initialized.
8. Inspect network activity after initial loading while choosing, revealing, filtering, reading, reconsidering, and resetting. Verify there are no tracking or third-party analytics calls.

---

## Keyboard and Accessibility

1. Use only `Tab`, `Shift+Tab`, `Enter`, `Space`, arrow keys, `Home`, `End`, and `Escape` for the complete journey.
2. Confirm the modal traps focus, the background is inert, and `Escape` closes it.
3. Close a modal and confirm focus returns to the initiating control, or the home brand if that control no longer exists.
4. Confirm stage changes focus the new heading and reset the dialog's scroll position.
5. Confirm choices announce their checked state, the progress indicator announces the current stage, and the comparison is understandable without color cues alone.
6. Enable reduced motion (`prefers-reduced-motion: reduce`) and repeat the experience. Ambient movement and transform-based motion should stop without hiding content.
7. Test with browser zoom at 200% and a screen reader. Confirm labels, disclosure controls, modal titles, and keyboard order remain understandable.

---

## Viewport Matrix

| Width | Primary checks | Browser verification |
| ---: | --- | --- |
| 1440 px | Hero text/artwork balance, navigation with Guided Tour button, four-column perspective grid | Not executed here |
| 1280 px | No hero overlap, circular featured scenario, readable quotes | Not executed here |
| 1024 px | Reduced navigation spacing, three-column perspective grid | Not executed here |
| 768 px | Mobile drawer with Quick Tour, topic layout, contained modal scrolling | Not executed here |
| 430 px | Stacked hero, readable scenario circles, native topic filter, swipe controls | Not executed here |
| 375 px | No horizontal page overflow, tap targets, before/after circles, text wrapping | Not executed here |

On mobile, verify the perspective arrows scroll one circle at a time and correctly disable at either end. A full response must always remain available by opening a circle; clipped preview text must never be the only way to read it.

---

## Content and Integrity

- Every scenario must have a unique ID, a valid category, four options A-D, and eight perspectives (verified: 74 scenarios, 592 perspectives).
- Every perspective must reference one of its scenario's four options and have substantive local reasoning.
- No response should be accessible through the decision UI before a first choice is committed.
- Chart percentages are small-demo proportions rounded to one decimal place. Equal counts must have equal arc lengths and equal displayed values; rounded labels need not add to exactly 100.0%.
- Illustrative reflection quotes must remain labeled, and curated perspectives must not be presented as live users or a representative public poll.
- Free access must start the real experience rather than opening a fake billing or signup screen.