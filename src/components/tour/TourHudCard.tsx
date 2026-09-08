import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import type { TourStep } from './types';
import { TOUR_STEPS } from './tourSteps';

interface TourHudCardProps {
  currentStep: TourStep;
  currentStepIndex: number;
  highlightRect: DOMRect | null;
  onStepSelect: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onPauseForTrial: () => void;
  onStartExperience?: () => void;
  onNavigateToExplore?: () => void;
  onOpenAskModal?: () => void;
  onOpenJourney?: () => void;
}

export function TourHudCard({
  currentStep,
  currentStepIndex,
  highlightRect,
  onStepSelect,
  onNext,
  onPrev,
  onSkip,
  onPauseForTrial,
  onStartExperience,
  onNavigateToExplore,
  onOpenAskModal,
  onOpenJourney,
}: TourHudCardProps) {
  return (
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
                    onClick={() => onStepSelect(idx)}
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
              onClick={onSkip}
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
                  onClick={() => {
                    onPauseForTrial();
                    onStartExperience();
                  }}
                  className="shrink-0 text-[11px] font-semibold text-[#2c4735] bg-[#e4ede0] hover:bg-[#d5e3cf] py-1 px-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Try now →
                </button>
              )}
              {currentStep.id === 'curated-odyssey' && onNavigateToExplore && (
                <button
                  type="button"
                  onClick={() => {
                    onPauseForTrial();
                    onNavigateToExplore();
                  }}
                  className="shrink-0 text-[11px] font-semibold text-[#2c4735] bg-[#e4ede0] hover:bg-[#d5e3cf] py-1 px-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Try Odyssey →
                </button>
              )}
              {currentStep.id === 'ask-question' && onOpenAskModal && (
                <button
                  type="button"
                  onClick={() => {
                    onPauseForTrial();
                    onOpenAskModal();
                  }}
                  className="shrink-0 text-[11px] font-semibold text-[#2c4735] bg-[#e4ede0] hover:bg-[#d5e3cf] py-1 px-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Ask now →
                </button>
              )}
              {currentStep.id === 'my-journey' && onOpenJourney && (
                <button
                  type="button"
                  onClick={() => {
                    onPauseForTrial();
                    onOpenJourney();
                  }}
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
                  onClick={onPrev}
                  className="p-2 rounded-full border border-[#cad5c6] hover:bg-[#e4ede0]/50 text-[#27352b] transition-colors cursor-pointer"
                  aria-label="Previous step"
                >
                  <ArrowLeft size={15} />
                </button>
              )}

              <button
                type="button"
                onClick={onNext}
                style={{ color: '#ffffff', backgroundColor: '#26372b' }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full hover:bg-[#365744] text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {currentStepIndex === TOUR_STEPS.length - 1 ? (
                  <>
                    <span style={{ color: '#ffffff' }}>Finish Tour</span>{' '}
                    <CheckCircle2 size={15} style={{ color: '#ffffff' }} />
                  </>
                ) : (
                  <>
                    <span style={{ color: '#ffffff' }}>Next Step</span>{' '}
                    <ArrowRight size={15} style={{ color: '#ffffff' }} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
