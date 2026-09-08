# SoniX Verification Guide

## Build and Source Checks

- Production build: executed successfully with the provided Vite build tool.
- Scenario definitions: 20 verified in the local content file.
- Curated perspectives: 160 verified from the option groups (14 single-response groups, 52 two-response groups, and 14 three-response groups).
- Application API calls, backend SDKs, authentication, and placeholder content: none found in application source.
- Browser-driven interaction tests and screenshots: not executed in this environment. The checks below are prepared for a real browser, not represented as completed tests.

## Core Journey

1. Open Discover and activate Start exploring.
2. Confirm the reveal action is disabled before selecting an answer and no perspective results are visible.
3. Select A. Confirm A is visibly selected and the reveal action becomes enabled.
4. Use the arrow keys, Home, and End to move through choices. Confirm focus and selection agree.
5. Reveal the responses. Confirm the distribution includes eight curated perspectives plus one visitor choice.
6. Open a matching perspective and read the full response. Return to all perspectives.
7. Open a contrasting perspective. Confirm its chosen option differs from the visitor's original answer and it is marked explored afterward.
8. Reconsider. Select the change action. Confirm the final action is disabled until a different choice is selected.
9. Choose C and save the reflection. Confirm Before is A, Now is C, and the diagram uses the new choice.
10. Open My journey. Confirm the entry displays A to C and opens the same reflection.
11. Repeat with Keep. Confirm both circles show the original answer and the copy does not claim that the answer changed.
12. Repeat with Unsure. Confirm the current state is a question mark and does not silently replace the original option.
13. Continue to the next situation. Confirm it has different content and all perspectives are hidden again.

## Explore and Navigation

1. Open Explore from desktop navigation and from the mobile menu.
2. Select every category. On a small screen, use the native topic selector. Confirm only matching situations remain.
3. Search for a word within a title, context, or category. Confirm filtering is case-insensitive.
4. Enter an unmatched query and use the empty-state reset action.
5. Use A few more possibilities to reveal the remaining local scenarios. Confirm the catalog ends at 20, not an infinite feed.
6. Use Surprise me. Confirm it opens a situation from the filtered results, or the entire collection if there are no matches.
7. Test Discover, Explore, How it works, brand-home links, browser Back, and browser Forward.
8. Test every footer link, the back-to-top control, FAQ disclosure, how-it-works step, benefit accordion, and illustrative reflection.
9. Activate Skip to content while on Explore. Confirm it focuses the Explore content without changing to Discover.

## Persistence and Privacy

1. Select an option and close the dialog. Open My journey and resume the unfinished situation.
2. Refresh the page. Confirm the session and completed reflections remain in the same browser.
3. Complete the same scenario again. Confirm its existing journey entry is replaced by the latest reflection, not duplicated.
4. Open Reset this demo. Cancel and confirm the journey is unchanged.
5. Open reset again and confirm. Verify both the active situation and saved reflections are cleared.
6. Block site storage. Confirm the core flow still works and the privacy message explains that progress lasts only for this visit.
7. Put invalid JSON or an incompatible version into `sonix-journey-v1`. Refresh and confirm a fresh, usable journey.
8. Inspect network activity after initial loading while choosing, revealing, filtering, reading, reconsidering, and resetting. There should be no application data requests.

## Keyboard and Accessibility

1. Use only Tab, Shift+Tab, Enter, Space, arrow keys, Home, End, and Escape for the complete journey.
2. Confirm the modal traps focus, the background is inert, and Escape closes it.
3. Close a modal and confirm focus returns to the initiating control, or the home brand if that control no longer exists.
4. Confirm stage changes focus the new heading and reset the dialog's scroll position.
5. Confirm choices announce their checked state, the progress indicator announces the current stage, and the comparison is understandable without its colors.
6. Enable reduced motion and repeat the experience. Ambient movement and transform-based motion should stop without hiding content.
7. Test with browser zoom at 200% and a screen reader. Confirm labels, disclosure controls, modal titles, and keyboard order remain understandable.

## Viewport Matrix

| Width | Primary checks | Browser verification |
| ---: | --- | --- |
| 1440 px | Hero text/artwork balance, navigation, four-column perspective grid | Not executed here |
| 1280 px | No hero overlap, circular featured scenario, readable quotes | Not executed here |
| 1024 px | Reduced navigation spacing, three-column perspective grid | Not executed here |
| 768 px | Mobile menu, topic layout, contained modal scrolling | Not executed here |
| 430 px | Stacked hero, readable scenario circles, native topic filter, swipe controls | Not executed here |
| 375 px | No horizontal page overflow, tap targets, before/after circles, text wrapping | Not executed here |

On mobile, verify the perspective arrows scroll one circle at a time and correctly disable at either end. A full response must always remain available by opening a circle; clipped preview text must never be the only way to read it.

## Content and Integrity

- Every scenario must have a unique ID, a valid category, four options A-D, and eight perspectives.
- Every perspective must reference one of its scenario's four options and have substantive local reasoning.
- No response should be accessible through the decision UI before a first choice is committed.
- Chart percentages are small-demo proportions rounded to one decimal place. Equal counts must have equal arc lengths and equal displayed values; rounded labels need not add to exactly 100.0%.
- Illustrative reflection quotes must remain labeled, and curated perspectives must not be presented as live users or a representative public poll.
- Free access must start the real experience rather than opening a fake billing or signup screen.