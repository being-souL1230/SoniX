import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bookmark, MessageSquarePlus, Route, Search, Shuffle, Users, X } from 'lucide-react';
import { categories, scenarios, getCommunityRegistry, setCommunityScenariosRegistry, registerCommunityScenario } from '../data/scenarios';
import { CategoryIcon } from '../components/Brand';
import { Reveal } from '../components/Reveal';
import { ScenarioCard } from '../components/ScenarioCard';
import { fetchCommunityScenarios, subscribeToCommunityScenarios } from '../lib/supabase';
import type { Category, JourneyEntry, Scenario } from '../types/social';

interface ExploreProps {
  initialCategory: Category | 'All';
  completed: JourneyEntry[];
  savedScenarios: string[];
  onStart: (id: string) => void;
  onToggleSave: (id: string) => void;
  onBuildPath: () => void;
  onAsk?: () => void;
}

export default function Explore({
  initialCategory,
  completed,
  savedScenarios,
  onStart,
  onToggleSave,
  onBuildPath,
  onAsk,
}: ExploreProps) {
  const [category, setCategory] = useState<Category | 'All'>(initialCategory);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const [savedOnly, setSavedOnly] = useState(false);
  const [communityOnly, setCommunityOnly] = useState(false);
  const [communityScenarios, setCommunityScenarios] = useState<Scenario[]>(getCommunityRegistry);

  useEffect(() => {
    let isMounted = true;
    fetchCommunityScenarios().then((list) => {
      if (isMounted) {
        setCommunityScenarios(list);
        setCommunityScenariosRegistry(list);
      }
    });

    const unsubscribe = subscribeToCommunityScenarios((newScenario) => {
      registerCommunityScenario(newScenario);
      setCommunityScenarios((prev) => {
        if (prev.some((s) => s.id === newScenario.id)) return prev;
        return [newScenario, ...prev];
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const allScenarios = useMemo(() => {
    const combined = [...communityScenarios];
    for (const s of scenarios) {
      if (!combined.some((item) => item.id === s.id)) {
        combined.push(s);
      }
    }
    return combined;
  }, [communityScenarios]);

  const filtered = useMemo(() => allScenarios.filter((scenario) =>
    (category === 'All' || scenario.category === category) &&
    (!savedOnly || savedScenarios.includes(scenario.id)) &&
    (!communityOnly || scenario.isCommunity) &&
    `${scenario.title} ${scenario.description} ${scenario.category} ${scenario.isCommunity ? 'community question user' : ''}`.toLowerCase().includes(search.trim().toLowerCase()),
  ), [allScenarios, category, savedOnly, savedScenarios, communityOnly, search]);

  const selectCategory = (next: Category | 'All') => { setCategory(next); setVisibleCount(8); };

  const surpriseMe = () => {
    const pool = filtered.length ? filtered : allScenarios;
    onStart(pool[Math.floor(Math.random() * pool.length)].id);
  };

  return (
    <main id="main-content" className="explore-page">
      <div className="container">
        <Reveal className="explore-heading">
          <div>
            <p className="eyebrow"><span className="status-dot" /> A situation for every side of life</p>
            <h1>Life is full of<br /><span className="text-sage">little crossroads.</span></h1>
            <p>Find a question that feels familiar. Leave with a perspective that does not.</p>
          </div>
          <div className="explore-heading-actions">
            {onAsk && (
              <button className="button button-dark" onClick={onAsk}>
                <MessageSquarePlus size={17} /> Ask a question
              </button>
            )}
            <button className="button button-outline" onClick={onBuildPath}>
              <Route size={17} /> Build an odyssey
            </button>
            <button className="button button-outline" onClick={surpriseMe}>
              <Shuffle size={17} /> Surprise me
            </button>
          </div>
        </Reveal>

        <div className="explore-filters" aria-label="Filter situations by topic">
          <div className="filter-orbits">
            {(['All', ...categories] as const).map((item) => (
              <button className={`category-filter ${category === item ? 'is-active' : ''}`} key={item} onClick={() => selectCategory(item)} aria-pressed={category === item}>
                <CategoryIcon category={item} size={25} />
                <span>{item === 'All' ? 'All situations' : item}</span>
              </button>
            ))}
          </div>
          <div className="mobile-category-filter">
            <span className="mobile-category-orb"><CategoryIcon category={category} size={26} /></span>
            <label htmlFor="explore-topic">
              <span>A part of your life</span>
              <select id="explore-topic" value={category} onChange={(event) => selectCategory(event.target.value as Category | 'All')}>
                <option value="All">All situations</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="explore-toolbar">
          <p role="status">{filtered.length} {filtered.length === 1 ? 'situation' : 'situations'}. <span>Zero right answers.</span></p>
          <div className="explore-tools">
            {communityScenarios.length > 0 && (
              <button
                className={`saved-filter-button ${communityOnly ? 'is-active' : ''}`}
                onClick={() => { setCommunityOnly((val) => !val); setVisibleCount(8); }}
                aria-pressed={communityOnly}
              >
                <Users size={15} /> Community questions <span>{communityScenarios.length}</span>
              </button>
            )}
            <button className={`saved-filter-button ${savedOnly ? 'is-active' : ''}`} onClick={() => { setSavedOnly((value) => !value); setVisibleCount(8); }} aria-pressed={savedOnly}>
              <Bookmark size={15} fill={savedOnly ? 'currentColor' : 'none'} /> Saved for later <span>{savedScenarios.length}</span>
            </button>
            <div className="search-field">
              <Search size={17} />
              <input aria-label="Search situations" value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(8); }} placeholder="Find a situation..." />
              {search && <button className="search-clear" aria-label="Clear search" onClick={() => { setSearch(''); setVisibleCount(8); }}><X size={15} /></button>}
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="scenario-grid">
              {filtered.slice(0, visibleCount).map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  compact
                  completed={completed.some((entry) => entry.scenarioId === scenario.id)}
                  saved={savedScenarios.includes(scenario.id)}
                  onToggleSave={() => onToggleSave(scenario.id)}
                  onOpen={() => onStart(scenario.id)}
                />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="explore-more">
                <p>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} situations</p>
                <button className="button button-outline" onClick={() => setVisibleCount((count) => count + 8)}>A few more possibilities <ArrowRight size={16} /></button>
              </div>
            )}
          </>
        ) : (
          <div className="search-empty">
            <Search size={35} strokeWidth={1.3} />
            <h2>{savedOnly ? 'Nothing saved here. Yet.' : communityOnly ? 'No community questions here yet.' : 'No situations here. Yet.'}</h2>
            <p>{savedOnly ? 'Save any circular situation and it will wait here for a quieter moment.' : communityOnly ? 'Be the first to post an anonymous question for others to reflect on.' : 'Try a different word or give another topic a little space.'}</p>
            {communityOnly && onAsk ? (
              <button className="button button-dark" onClick={onAsk}>
                <MessageSquarePlus size={16} /> Post the first question
              </button>
            ) : (
              <button className="button button-dark" onClick={() => { setSearch(''); selectCategory('All'); setSavedOnly(false); setCommunityOnly(false); }}>See every situation <ArrowRight size={16} /></button>
            )}
          </div>
        )}
        <p className="explore-bottom-note">Real-life questions. Curated voices. A little more understanding.</p>
      </div>
    </main>
  );
}