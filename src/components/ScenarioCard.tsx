import { ArrowUpRight, Bookmark } from 'lucide-react';
import { CategoryIcon } from './Brand';
import type { Scenario } from '../types/social';

interface ScenarioCardProps {
  scenario: Scenario;
  compact?: boolean;
  onOpen?: () => void;
  completed?: boolean;
  saved?: boolean;
  onToggleSave?: () => void;
}

export function ScenarioCard({ scenario, compact = false, onOpen, completed = false, saved = false, onToggleSave }: ScenarioCardProps) {
  const content = (
    <>
      <span className="scenario-category">
        <CategoryIcon category={scenario.category} size={compact ? 22 : 26} />
        <span>{scenario.category}</span>
        {scenario.isCommunity && <span className="community-tag">Community</span>}
      </span>
      <h3>{scenario.title}</h3>
      {!compact && <p>{scenario.description}</p>}
      {onOpen && (
        <span className="scenario-open">
          {completed ? 'Explore again' : 'What would you choose?'}
          <ArrowUpRight size={18} />
        </span>
      )}
    </>
  );
  if (!onOpen) return <div className={`scenario-orb ${compact ? 'scenario-orb-compact' : ''}`}>{content}</div>;
  return (
    <div className={`scenario-shell ${compact ? 'scenario-shell-compact' : ''}`}>
      <button className={`scenario-orb ${compact ? 'scenario-orb-compact' : ''}`} onClick={onOpen}>{content}</button>
      {onToggleSave && (
        <button className={`scenario-save ${saved ? 'is-saved' : ''}`} onClick={onToggleSave} aria-label={saved ? `Remove ${scenario.title} from saved situations` : `Save ${scenario.title} for later`} aria-pressed={saved}>
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      )}
    </div>
  );
}