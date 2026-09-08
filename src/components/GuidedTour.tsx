import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  CheckCircle2,
  Eye,
  Route,
  MessageSquarePlus,
  Bookmark,
  Layers,
} from 'lucide-react';
import { BrandMark } from './Brand';

export interface TourStep {
  id: string;
  targetSelector: string;
  page?: 'discover' | 'explore';
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionPrompt?: string;
  offsetY?: number;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'start-dilemma',
    targetSelector: '[data-tour="hero-start"]',
    page: 'discover',
    badge: 'Step 1 of 5 • Blind Choice',
    title: 'Make Your Blind First Choice',
    description:
      'Every interaction begins with a real crossroads. You pick your stance before seeing what anyone else chose — keeping your first instinct completely uninfluenced.',
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
      'Browse real dilemmas across Career, Ethics, Relationships, Money, and more. Try clicking any category tag above — the page updates in real-time!',
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
      'Pose your own crossroads with 4 distinct options. Other thinkers will respond with their authentic reasoning — zero profiles, zero follower counts.',
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

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  isModalOpen?: boolean;
  currentPage?: 'discover' | 'explore';
  onNavigatePage?: (destination: 'discover' | 'explore') => void;
  onStartExperience?: () => void;
  onNavigateToExplore?: () => void;
  onOpenAskModal?: () => void;
  onOpenJourney?: () => void;
}

export function GuidedTour({
  isOpen,
  onClose,
  isModalOpen = false,
  currentPage = 'discover',
  onNavigatePage,
  onStartExperience,
  onNavigateToExplore,
  onOpenAskModal,
  onOpenJourney,
}: GuidedTourProps) {
  const [phase, setPhase] = useState<'welcome' | 'tour' | 'completed'>('welcome');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [isPausedForTrial, setIsPausedForTrial] = useState(false);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Auto-switch page if step requires it
  useEffect(() => {
    if (phase === 'tour' && isOpen && !isModalOpen && !isPausedForTrial) {
      if (currentStep?.page && currentStep.page !== currentPage && onNavigatePage) {
        onNavigatePage(currentStep.page);
      }
    }
  }, [phase, isOpen, isModalOpen, isPausedForTrial, currentStepIndex, currentStep, currentPage, onNavigatePage]);

  // When modal closes, automatically unpause and resume tour at next step
  useEffect(() => {
    if (!isModalOpen && isPausedForTrial) {
      const timer = setTimeout(() => {
        setIsPausedForTrial(false);
        setCurrentStepIndex((prev) => Math.min(prev + 1, TOUR_STEPS.length - 1));
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, isPausedForTrial]);

  // Measure and position the spotlight over target element
  const updateHighlightPosition = useCallback(() => {
    if (phase !== 'tour' || !isOpen || isModalOpen || isPausedForTrial) {
      setHighlightRect(null);
      return;
    }

    const selector = currentStep?.targetSelector;
    if (!selector) {
      setHighlightRect(null);
      return;
    }

    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);
      // Only scroll if out of comfortable view
      if (rect.top < 70 || rect.bottom > window.innerHeight - 150) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightRect(null);
    }
  }, [phase, isOpen, isModalOpen, isPausedForTrial, currentStep]);

  useEffect(() => {
    if (!isOpen || isModalOpen || isPausedForTrial) return;
    updateHighlightPosition();

    window.addEventListener('resize', updateHighlightPosition);
    window.addEventListener('scroll', updateHighlightPosition, { passive: true });

    const timeout = setTimeout(updateHighlightPosition, 300);

    return () => {
      window.removeEventListener('resize', updateHighlightPosition);
      window.removeEventListener('scroll', updateHighlightPosition);
      clearTimeout(timeout);
    };
  }, [isOpen, phase, currentStepIndex, isModalOpen, isPausedForTrial, updateHighlightPosition]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen || isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight' && phase === 'tour' && !isPausedForTrial) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && phase === 'tour' && currentStepIndex > 0 && !isPausedForTrial) {
        setCurrentStepIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, phase, currentStepIndex, isModalOpen, isPausedForTrial]);

  const handleStartTour = () => {
    setPhase('tour');
    setCurrentStepIndex(0);
    if (currentPage !== 'discover' && onNavigatePage) {
      onNavigatePage('discover');
    }
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setPhase('completed');
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    try {
      localStorage.setItem('sonix_tour_seen_v1', 'true');
    } catch {
      // Ignore storage errors
    }
    onClose();
    setTimeout(() => {
      setPhase('welcome');
      setCurrentStepIndex(0);
      setIsPausedForTrial(false);
    }, 400);
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('sonix_tour_seen_v1', 'true');
    } catch {
      // Ignore storage errors
    }
    onClose();
    setTimeout(() => {
      setPhase('welcome');
      setCurrentStepIndex(0);
      setIsPausedForTrial(false);
      onStartExperience?.();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none font-sans">
        {/* Phase 1: Welcome Intro Card */}
        {phase === 'welcome' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg max-h-[88dvh] overflow-y-auto bg-[#fdfdf9] border border-[#e0e5d9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 shadow-2xl text-[#27352b]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="tour-welcome-title"
            >
              <button
                type="button"
                onClick={handleSkip}
                className="absolute top-5 right-5 p-2 text-[#6b7567] hover:text-[#27352b] hover:bg-[#e4ede0]/50 rounded-full transition-colors cursor-pointer"
                aria-label="Skip tour"
                title="Skip tour"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#e4ede0] flex items-center justify-center text-[#365744]">
                  <BrandMark />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#e4ede0] text-[#365744]">
                    <Sparkles size={12} /> Welcome to SoniX
                  </span>
                </div>
              </div>

              <h2 id="tour-welcome-title" className="text-2xl sm:text-3xl font-serif font-medium text-[#27352b] mb-2 leading-tight">
                See the other side of social.
              </h2>
              <p className="text-sm sm:text-base text-[#5d6b5b] mb-5 leading-relaxed">
                SoniX is built around <strong>decisions, not posts</strong>. No profiles, no popularity contests, and no infinite feeds.
              </p>

              {/* Clean flow items directly on card surface */}
              <div className="my-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-[#e4ede0] text-[#2c4735] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="block text-sm font-semibold text-[#27352b]">Blind First Choice</strong>
                    <p className="text-xs sm:text-sm text-[#5a6857] mt-0.5 leading-relaxed">
                      Pick what you genuinely believe before anyone else's vote can influence you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-[#e4ede0] text-[#2c4735] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="block text-sm font-semibold text-[#27352b]">Explore Diverse Reasons</strong>
                    <p className="text-xs sm:text-sm text-[#5a6857] mt-0.5 leading-relaxed">
                      Read anonymous perspectives that chose differently and discover why.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-[#e4ede0] text-[#2c4735] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="block text-sm font-semibold text-[#27352b]">Reconsider & Private Notes</strong>
                    <p className="text-xs sm:text-sm text-[#5a6857] mt-0.5 leading-relaxed">
                      Keep or evolve your perspective, and save personal notes only in your browser.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#e0e5d9]">
                <button
                  type="button"
                  onClick={handleSkip}
                  style={{ color: '#27352b' }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-medium bg-[#f0f4ec] hover:bg-[#e4ede0] border border-[#cad5c6] transition-all text-center cursor-pointer active:scale-98"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleStartTour}
                  style={{ color: '#ffffff', backgroundColor: '#26372b' }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 hover:bg-[#365744] rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <span style={{ color: '#ffffff' }}>Start Tour</span>
                  <ArrowRight size={16} style={{ color: '#ffffff' }} />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Phase 2: Non-Blocking Real-Time Interactive Spotlight & Bottom Dock */}
        {phase === 'tour' && !isModalOpen && !isPausedForTrial && (
          <>
            {/* Glowing Element Marker on the Page (allows real-time clicks on the element!) */}
            {highlightRect && (
              <motion.div
                initial={false}
                animate={{
                  top: highlightRect.top - 4 + (currentStep?.offsetY ?? 0),
                  left: highlightRect.left - 4,
                  width: highlightRect.width + 8,
                  height: highlightRect.height + 8,
                }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="fixed z-40 rounded-2xl ring-4 ring-[#4f7756] shadow-[0_0_24px_rgba(79,119,86,0.65)] pointer-events-none"
              />
            )}

            {/* Bottom-Docked Floating Tour Card (Leaves 85% of screen completely visible and interactive!) */}
            <div className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 max-w-xl w-auto sm:w-full z-50 pointer-events-auto">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#fdfdf9]/95 backdrop-blur-md border border-[#cad5c6] rounded-2xl p-3.5 sm:p-5 shadow-2xl text-[#27352b] box-border"
                role="dialog"
                aria-modal="false"
              >
                {/* Header with Step Badge & Controls */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#e4ede0] text-[#365744] truncate">
                      {currentStep.icon}
                      <span>{currentStep.badge}</span>
                    </span>
                    {/* Step Dots */}
                    <div className="hidden sm:flex items-center gap-1 ml-1">
                      {TOUR_STEPS.map((step, idx) => (
                        <button
                          key={step.id}
                          onClick={() => setCurrentStepIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === currentStepIndex
                              ? 'w-5 bg-[#365744]'
                              : idx < currentStepIndex
                              ? 'w-1.5 bg-[#a0b7a2]'
                              : 'w-1.5 bg-[#dbe2d6]'
                          }`}
                          aria-label={`Go to step ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-xs text-[#6b7567] hover:text-[#27352b] py-1 px-2.5 rounded-full hover:bg-[#e4ede0]/50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Skip tour</span>
                    <X size={14} />
                  </button>
                </div>

                {/* Content */}
                <h3 className="text-base sm:text-lg font-serif font-medium text-[#27352b] mb-1">
                  {currentStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5848] mb-3 leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Real-Time Action Prompt / Jump */}
                {currentStep.actionPrompt && (
                  <div className="mb-3.5 text-xs text-[#52634f] bg-[#f2f6ee] border border-[#dce5d7] rounded-xl px-3 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-2 h-2 rounded-full bg-[#5b7756] shrink-0 animate-pulse" />
                      <span className="break-words leading-tight">{currentStep.actionPrompt}</span>
                    </div>
                    {currentStep.id === 'start-dilemma' && onStartExperience && (
                      <button
                        type="button"
                        onClick={() => { setIsPausedForTrial(true); onStartExperience(); }}
                        className="shrink-0 text-[11px] font-semibold text-[#2c4735] bg-[#e4ede0] hover:bg-[#d5e3cf] py-1 px-2.5 rounded-full transition-colors cursor-pointer"
                      >
                        Try now →
                      </button>
                    )}
                    {currentStep.id === 'curated-odyssey' && onNavigateToExplore && (
                      <button
                        type="button"
                        onClick={() => { setIsPausedForTrial(true); onNavigateToExplore(); }}
                        className="shrink-0 text-[11px] font-semibold text-[#2c4735] bg-[#e4ede0] hover:bg-[#d5e3cf] py-1 px-2.5 rounded-full transition-colors cursor-pointer"
                      >
                        Try Odyssey →
                      </button>
                    )}
                    {currentStep.id === 'ask-question' && onOpenAskModal && (
                      <button
                        type="button"
                        onClick={() => { setIsPausedForTrial(true); onOpenAskModal(); }}
                        className="shrink-0 text-[11px] font-semibold text-[#2c4735] bg-[#e4ede0] hover:bg-[#d5e3cf] py-1 px-2.5 rounded-full transition-colors cursor-pointer"
                      >
                        Ask now →
                      </button>
                    )}
                    {currentStep.id === 'my-journey' && onOpenJourney && (
                      <button
                        type="button"
                        onClick={() => { setIsPausedForTrial(true); onOpenJourney(); }}
                        className="shrink-0 text-[11px] font-semibold text-[#2c4735] bg-[#e4ede0] hover:bg-[#d5e3cf] py-1 px-2.5 rounded-full transition-colors cursor-pointer"
                      >
                        Open Journey →
                      </button>
                    )}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#e0e5d9]">
                  <span className="text-[11px] text-[#788574]">
                    Step {currentStepIndex + 1} of {TOUR_STEPS.length}
                  </span>

                  <div className="flex items-center gap-2">
                    {currentStepIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="p-2 rounded-full border border-[#cad5c6] hover:bg-[#e4ede0]/50 text-[#27352b] transition-colors cursor-pointer"
                        aria-label="Previous step"
                      >
                        <ArrowLeft size={15} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      style={{ color: '#ffffff', backgroundColor: '#26372b' }}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full hover:bg-[#365744] text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      {currentStepIndex === TOUR_STEPS.length - 1 ? (
                        <>
                          <span style={{ color: '#ffffff' }}>Finish Tour</span> <CheckCircle2 size={15} style={{ color: '#ffffff' }} />
                        </>
                      ) : (
                        <>
                          <span style={{ color: '#ffffff' }}>Next Step</span> <ArrowRight size={15} style={{ color: '#ffffff' }} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Floating Resume Badge when trial is paused and modal is closed */}
        {phase === 'tour' && isPausedForTrial && !isModalOpen && (
          <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 pointer-events-auto animate-fadeIn max-w-[calc(100vw-24px)]">
            <button
              type="button"
              onClick={() => setIsPausedForTrial(false)}
              style={{ color: '#27352b', backgroundColor: '#eef4eb' }}
              className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#cad5c6] shadow-lg hover:shadow-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 max-w-full"
            >
              <Compass size={15} className="text-[#365744] shrink-0" />
              <span className="truncate">Resume Tour ({currentStepIndex + 1}/{TOUR_STEPS.length})</span>
              <ArrowRight size={14} className="shrink-0" />
            </button>
          </div>
        )}

        {/* Phase 3: Completion Celebration */}
        {phase === 'completed' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#fdfdf9] border border-[#e0e5d9] rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-[#27352b]"
            >
              <div className="w-14 h-14 rounded-full bg-[#e4ede0] text-[#365744] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="text-2xl font-serif font-medium text-[#27352b] mb-2">
                You're ready to explore!
              </h2>
              <p className="text-sm text-[#6b7567] mb-6 leading-relaxed">
                Take a moment, trust your instincts, and enjoy discovering how other minds approach the crossroads of life.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleFinish}
                  style={{ color: '#ffffff', backgroundColor: '#26372b' }}
                  className="w-full sm:w-auto px-6 py-3 hover:bg-[#365744] rounded-full text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span style={{ color: '#ffffff' }}>Start Exploring Now</span> <ArrowRight size={16} className="inline ml-1" style={{ color: '#ffffff' }} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
