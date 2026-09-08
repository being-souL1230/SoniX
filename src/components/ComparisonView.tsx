import { motion } from 'framer-motion';
import { getDistribution } from '../lib/decisions';
import type { OptionId, Scenario } from '../types/social';

export function ComparisonView({ scenario, selected }: { scenario: Scenario; selected: OptionId | null }) {
  const { total, distribution } = getDistribution(scenario, selected);
  const circumference = 2 * Math.PI * 67;
  let offset = 0;

  return (
    <figure className="comparison-view">
      <div className="comparison-donut">
        <motion.svg viewBox="0 0 160 160" initial={{ opacity: 0, rotate: -120 }} animate={{ opacity: 1, rotate: -90 }} transition={{ duration: 0.7 }} aria-hidden="true">
          <circle cx="80" cy="80" r="67" stroke="#e9ece5" strokeWidth="14" fill="none" />
          {distribution.map((item) => {
            const start = offset;
            offset += item.percentage / 100 * circumference;
            return <circle key={item.id} cx="80" cy="80" r="67" fill="none" stroke={item.color} strokeWidth="14" strokeDasharray={`${Math.max(0, item.percentage / 100 * circumference - 4)} ${circumference}`} strokeDashoffset={-start} />;
          })}
        </motion.svg>
        <div className="donut-center"><strong>{total}</strong><span>different minds</span></div>
      </div>
      <div className="comparison-content">
        <figcaption>Different choices. Equal space.</figcaption>
        <ul>
          {distribution.map((item) => (
            <li key={item.id} aria-label={`${item.label} ${item.count} of ${total} choices${selected === item.id ? ', including yours' : ''}`}>
              <span className="legend-dot" style={{ background: item.color }} />
              <span className="legend-option">{item.label}{selected === item.id && <small> (you)</small>}</span>
              <strong>{item.percentage.toFixed(1)}%</strong>
            </li>
          ))}
        </ul>
        <p className="data-note">{scenario.responses.length} curated perspectives{selected ? ' + your choice' : ''}. Not a live poll. Percentages rounded.</p>
      </div>
    </figure>
  );
}