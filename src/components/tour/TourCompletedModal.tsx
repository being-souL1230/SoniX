import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface TourCompletedModalProps {
  onFinish: () => void;
}

export function TourCompletedModal({ onFinish }: TourCompletedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fadeIn">
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
            onClick={onFinish}
            style={{ color: '#ffffff', backgroundColor: '#26372b' }}
            className="w-full sm:w-auto px-6 py-3 hover:bg-[#365744] rounded-full text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span style={{ color: '#ffffff' }}>Start Exploring Now</span>{' '}
            <ArrowRight size={16} className="inline ml-1" style={{ color: '#ffffff' }} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
