import { Compass, ArrowRight } from 'lucide-react';

interface TourResumeBadgeProps {
  currentStepIndex: number;
  totalSteps: number;
  onResume: () => void;
}

export function TourResumeBadge({ currentStepIndex, totalSteps, onResume }: TourResumeBadgeProps) {
  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 pointer-events-auto animate-fadeIn max-w-[calc(100vw-24px)]">
      <button
        type="button"
        onClick={onResume}
        style={{ color: '#27352b', backgroundColor: '#eef4eb' }}
        className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#cad5c6] shadow-lg hover:shadow-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 max-w-full"
      >
        <Compass size={15} className="text-[#365744] shrink-0" />
        <span className="truncate">Resume Tour ({currentStepIndex + 1}/{totalSteps})</span>
        <ArrowRight size={14} className="shrink-0" />
      </button>
    </div>
  );
}
