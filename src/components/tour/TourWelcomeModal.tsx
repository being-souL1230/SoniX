import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { BrandMark } from '../Brand';

interface TourWelcomeModalProps {
  onStartTour: () => void;
  onSkip: () => void;
}

export function TourWelcomeModal({ onStartTour, onSkip }: TourWelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fadeIn">
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
          onClick={onSkip}
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
            onClick={onSkip}
            style={{ color: '#27352b' }}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-medium bg-[#f0f4ec] hover:bg-[#e4ede0] border border-[#cad5c6] transition-all text-center cursor-pointer active:scale-98"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onStartTour}
            style={{ color: '#ffffff', backgroundColor: '#26372b' }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 hover:bg-[#365744] rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span style={{ color: '#ffffff' }}>Start Tour</span>
            <ArrowRight size={16} style={{ color: '#ffffff' }} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
