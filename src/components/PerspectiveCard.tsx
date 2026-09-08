import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { Avatar, orbColors } from './Brand';
import type { Perspective } from '../types/social';

export function PerspectiveCard({
  response,
  viewed,
  onOpen,
  index,
}: {
  response: Perspective;
  viewed: boolean;
  onOpen: () => void;
  index: number;
}) {
  return (
    <motion.button
      className="perspective-orb"
      style={{ '--orb-color': orbColors[response.avatar % orbColors.length] } as CSSProperties}
      onClick={onOpen}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.4 }}
      whileHover={{ y: -5 }}
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
    </motion.button>
  );
}