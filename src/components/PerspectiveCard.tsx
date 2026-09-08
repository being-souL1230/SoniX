import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, GitCompareArrows, Plus } from 'lucide-react';
import { Avatar, orbColors } from './Brand';
import type { Perspective } from '../types/social';

interface PerspectiveCardProps {
  response: Perspective;
  viewed: boolean;
  onOpen: () => void;
  onToggleCompare: () => void;
  selectedForCompare: boolean;
  compareDisabled: boolean;
  index: number;
}

export function PerspectiveCard({
  response,
  viewed,
  onOpen,
  onToggleCompare,
  selectedForCompare,
  compareDisabled,
  index,
}: PerspectiveCardProps) {
  return (
    <motion.div
      className={`perspective-shell ${selectedForCompare ? 'is-comparing' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <button
        className="perspective-orb"
        style={{ '--orb-color': orbColors[response.avatar % orbColors.length] } as CSSProperties}
        onClick={onOpen}
        aria-label={`Explore ${response.anonymousLabel}, chose ${response.selectedOption}${viewed ? ', already explored' : ''}`}
      >
        <Avatar index={response.avatar} />
        <h3>{response.anonymousLabel}</h3>
        <span className="perspective-choice">Chose {response.selectedOption}</span>
        <p>&ldquo;{response.reasoning}&rdquo;</p>
        <span className="perspective-open">
          {viewed ? (
            <>
              <Check size={13} /> Explored
            </>
          ) : (
            <>
              Their perspective <ArrowUpRight size={14} />
            </>
          )}
        </span>
      </button>
      <button
        className="perspective-compare-toggle"
        disabled={compareDisabled && !selectedForCompare}
        onClick={onToggleCompare}
        aria-pressed={selectedForCompare}
        aria-label={`${selectedForCompare ? 'Remove' : 'Add'} ${response.anonymousLabel} ${selectedForCompare ? 'from' : 'to'} perspective comparison`}
      >
        {selectedForCompare ? <Check size={14} /> : <Plus size={14} />}
        <GitCompareArrows size={12} />
      </button>
    </motion.div>
  );
}