import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Footer } from './components/Footer';
import { AboutView, PrivacyView, ReflectionNote } from './components/InformationViews';
import { JourneyView } from './components/JourneyView';
import { Modal } from './components/Modal';
import { Navigation } from './components/Navigation';
import { OdysseyBuilder } from './components/OdysseyBuilder';
import { useJourney } from './hooks/useJourney';
import Explore from './pages/Explore';
import Landing from './pages/Landing';
import type { Category } from './types/social';

const DecisionExperience = lazy(() => import('./components/DecisionExperience'));
type Overlay = 'decision' | 'journey' | 'odyssey' | 'about' | 'privacy' | 'note' | null;
type Destination = 'discover' | 'explore' | 'how-it-works';

function scrollToDestination(destination: Destination, focus = false) {
  requestAnimationFrame(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    if (focus) {
      const target = document.getElementById(destination === 'how-it-works' ? 'how-it-works' : 'main-content');
      target?.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
    }
    if (destination === 'how-it-works') document.getElementById('how-it-works')?.scrollIntoView({ behavior });
    else window.scrollTo({ top: 0, behavior });
  });
}

export default function App() {
  const journey = useJourney();
  const [page, setPage] = useState<'discover' | 'explore'>(() => window.location.hash === '#explore' ? 'explore' : 'discover');
  const [exploreCategory, setExploreCategory] = useState<Category | 'All'>('All');
  const [exploreKey, setExploreKey] = useState(0);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [noteIndex, setNoteIndex] = useState(0);

  useEffect(() => {
    const syncRoute = () => {
      if (!['', '#discover', '#explore', '#how-it-works'].includes(window.location.hash)) return;
      const destination: Destination = window.location.hash === '#explore' ? 'explore' : window.location.hash === '#how-it-works' ? 'how-it-works' : 'discover';
      setPage(destination === 'explore' ? 'explore' : 'discover');
      scrollToDestination(destination);
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    if (window.location.hash === '#how-it-works') scrollToDestination('how-it-works');
    return () => { window.removeEventListener('popstate', syncRoute); window.removeEventListener('hashchange', syncRoute); };
  }, []);

  const navigate = (destination: Destination, category: Category | 'All' = 'All') => {
    setOverlay(null);
    setPage(destination === 'explore' ? 'explore' : 'discover');
    if (destination === 'explore') { setExploreCategory(category); setExploreKey((key) => key + 1); }
    if (window.location.hash !== `#${destination}`) window.history.pushState(null, '', `#${destination}`);
    scrollToDestination(destination, true);
  };
  const start = (scenarioId?: string) => { journey.start(scenarioId); setOverlay('decision'); };
  const openReflection = (scenarioId: string) => { journey.openReflection(scenarioId); setOverlay('decision'); };
  const modalTitles = {
    decision: 'A little room to think',
    journey: 'My journey',
    odyssey: 'A path through perspective',
    about: 'The idea behind SoniX',
    privacy: 'Your space. Your data.',
    note: 'A little more perspective',
  };

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault();
        const main = document.getElementById('main-content');
        main?.setAttribute('tabindex', '-1');
        main?.focus();
        main?.scrollIntoView();
      }}>Skip to content</a>

      <Navigation page={page} onNavigate={navigate} onStart={() => start()} onJourney={() => setOverlay('journey')} />
      {page === 'discover' ? (
        <Landing
          onStart={start}
          onExplore={(category) => navigate('explore', category ?? 'All')}
          onHow={() => navigate('how-it-works')}
          onNote={(index) => { setNoteIndex(index); setOverlay('note'); }}
        />
      ) : (
        <Explore
          key={exploreKey}
          initialCategory={exploreCategory}
          completed={journey.completedScenarios}
          savedScenarios={journey.savedScenarios}
          onToggleSave={journey.toggleSaved}
          onBuildPath={() => setOverlay('odyssey')}
          onStart={start}
        />
      )}
      <Footer onNavigate={navigate} onJourney={() => setOverlay('journey')} onAbout={() => setOverlay('about')} onPrivacy={() => setOverlay('privacy')} />

      <AnimatePresence mode="wait">
        {overlay && (
          <Modal key={overlay} title={modalTitles[overlay]} onClose={() => setOverlay(null)} compact={overlay === 'about' || overlay === 'privacy' || overlay === 'note'}>
            {overlay === 'decision' && (
              <Suspense fallback={<div className="loading-experience" role="status">Opening a little room to think...</div>}>
                <DecisionExperience journey={journey} onJourney={() => setOverlay('journey')} />
              </Suspense>
            )}
            {overlay === 'journey' && <JourneyView journey={journey} onStart={start} onResume={() => setOverlay('decision')} onReflection={openReflection} />}
            {overlay === 'odyssey' && (
              <OdysseyBuilder
                onCreate={(selectedCategories) => {
                  journey.createPath(selectedCategories);
                  setOverlay('decision');
                }}
              />
            )}
            {overlay === 'about' && <AboutView onStart={() => start()} />}
            {overlay === 'privacy' && <PrivacyView storageAvailable={journey.storageAvailable} onJourney={() => setOverlay('journey')} />}
            {overlay === 'note' && <ReflectionNote index={noteIndex} onStart={() => start()} />}
          </Modal>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
