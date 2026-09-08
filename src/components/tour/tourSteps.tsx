import { Eye, Layers, Route, MessageSquarePlus, Bookmark } from 'lucide-react';
import type { TourStep } from './types';

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'start-dilemma',
    targetSelector: '[data-tour="hero-start"]',
    page: 'discover',
    badge: 'Step 1 of 5 • Blind Choice',
    title: 'Make Your Blind First Choice',
    description:
      'Every interaction begins with a real crossroads. You pick your stance before seeing what anyone else chose, keeping your first instinct completely uninfluenced.',
    icon: <Eye size={18} className="text-[#365744]" />,
    actionPrompt: 'Look at the highlighted button above! Click it to start immediately, or hit Next.',
  },
  {
    id: 'explore-realms',
    targetSelector: '[data-tour="explore-filters"]',
    page: 'explore',
    badge: 'Step 2 of 5 • Live Explore',
    title: 'Filter Across 8 Life Realms',
    description:
      'Browse real dilemmas across Career, Ethics, Relationships, Money, and more. Try clicking any category tag above; the page updates in real-time!',
    icon: <Layers size={18} className="text-[#365744]" />,
    actionPrompt: 'Interact live with the category filters above, then click Next.',
    offsetY: -8,
  },
  {
    id: 'curated-odyssey',
    targetSelector: '[data-tour="explore-odyssey"]',
    page: 'explore',
    badge: 'Step 3 of 5 • Curated Odyssey',
    title: 'Build a 3-Situation Odyssey',
    description:
      'Select up to 3 life realms to embark on a guided 3-situation progression with circular step indicators (1-2-3) that persists across visits.',
    icon: <Route size={18} className="text-[#365744]" />,
    actionPrompt: 'Click "Build an odyssey" above to try it now, or hit Next.',
  },
  {
    id: 'ask-question',
    targetSelector: '[data-tour="nav-ask"]',
    badge: 'Step 4 of 5 • Community Dilemmas',
    title: 'Ask Real Dilemmas Anonymously',
    description:
      'Pose your own crossroads with 4 distinct options. Other thinkers will respond with their authentic reasoning, with zero profiles and zero follower counts.',
    icon: <MessageSquarePlus size={18} className="text-[#365744]" />,
    actionPrompt: 'Click "Ask a question" in the top bar to draft your own question.',
  },
  {
    id: 'my-journey',
    targetSelector: '[data-tour="nav-journey"]',
    badge: 'Step 5 of 5 • Private Reflections',
    title: 'Private Reflections & Notes',
    description:
      'Compare perspectives side-by-side with Perspective Pair, and write personal 400-character reflection notes stored 100% privately in your browser.',
    icon: <Bookmark size={18} className="text-[#365744]" />,
    actionPrompt: 'Everything you reflect upon stays in your local browser storage.',
  },
];
