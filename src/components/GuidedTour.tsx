import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  type TourStep,
  type GuidedTourProps,
  TOUR_STEPS,
  TourWelcomeModal,
  TourHudCard,
  TourResumeBadge,
  TourCompletedModal,
} from './tour';

export type { TourStep, GuidedTourProps };
export { TOUR_STEPS };

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

  // Keyboard navigation
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
        {/* Phase 1: Welcome Intro Modal */}
        {phase === 'welcome' && (
          <TourWelcomeModal onStartTour={handleStartTour} onSkip={handleSkip} />
        )}

        {/* Phase 2: Interactive Spotlight HUD Card */}
        {phase === 'tour' && !isModalOpen && !isPausedForTrial && (
          <TourHudCard
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            highlightRect={highlightRect}
            onStepSelect={setCurrentStepIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkip={handleSkip}
            onPauseForTrial={() => setIsPausedForTrial(true)}
            onStartExperience={onStartExperience}
            onNavigateToExplore={onNavigateToExplore}
            onOpenAskModal={onOpenAskModal}
            onOpenJourney={onOpenJourney}
          />
        )}

        {/* Floating Resume Badge when trial is active and modal is closed */}
        {phase === 'tour' && isPausedForTrial && !isModalOpen && (
          <TourResumeBadge
            currentStepIndex={currentStepIndex}
            totalSteps={TOUR_STEPS.length}
            onResume={() => setIsPausedForTrial(false)}
          />
        )}

        {/* Phase 3: Completion Celebration */}
        {phase === 'completed' && (
          <TourCompletedModal onFinish={handleFinish} />
        )}
      </div>
    </AnimatePresence>
  );
}
