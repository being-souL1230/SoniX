import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { optionIds, type OptionId, type Perspective } from '../types/social';
import { PerspectiveCard } from './PerspectiveCard';

export function PerspectiveCollection({ responses, viewed, selected, onOpen }: { responses: Perspective[]; viewed: string[]; selected: OptionId; onOpen: (response: Perspective) => void }) {
  const collection = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [filter, setFilter] = useState<'All' | OptionId>('All');
  const filteredResponses = filter === 'All' ? responses : responses.filter((response) => response.selectedOption === filter);

  const updateEdges = () => {
    const element = collection.current;
    if (!element) return;
    const next = { start: element.scrollLeft < 5, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 5 };
    setEdges((previous) => previous.start === next.start && previous.end === next.end ? previous : next);
  };

  useEffect(() => {
    const observer = new ResizeObserver(updateEdges);
    if (collection.current) observer.observe(collection.current);
    updateEdges();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    collection.current?.scrollTo({ left: 0 });
    const frame = requestAnimationFrame(updateEdges);
    return () => cancelAnimationFrame(frame);
  }, [filter]);

  const move = (direction: number) => {
    const width = collection.current?.firstElementChild?.getBoundingClientRect().width ?? 270;
    collection.current?.scrollBy({ left: (width + 18) * direction, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="perspective-filter">
        <span>Follow one line of thought</span>
        <div role="group" aria-label="Filter perspectives by answer">
          <button className={filter === 'All' ? 'is-active' : ''} onClick={() => setFilter('All')} aria-pressed={filter === 'All'}>All</button>
          {optionIds.map((option) => (
            <button className={filter === option ? 'is-active' : ''} key={option} onClick={() => setFilter(option)} aria-pressed={filter === option} aria-label={`Show people who chose ${option}${selected === option ? ', your choice' : ''}`}>
              {option}<span>{selected === option ? 'You' : responses.filter((response) => response.selectedOption === option).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={`perspective-grid ${filter !== 'All' ? 'is-filtered' : ''}`} ref={collection} onScroll={updateEdges} aria-label={`${filter === 'All' ? 'All' : `Option ${filter}`} curated anonymous perspectives`}>
        {filteredResponses.map((response, index) => <PerspectiveCard key={response.id} response={response} index={index} viewed={viewed.includes(response.id)} onOpen={() => onOpen(response)} />)}
      </div>
      <div className="perspective-mobile-controls">
        <span>{filter === 'All' ? 'Swipe to explore another angle.' : `${filteredResponses.length} perspectives chose ${filter}.`}</span>
        <div>
          <button className="perspective-scroll-button" disabled={edges.start} onClick={() => move(-1)} aria-label="Previous perspectives"><ArrowLeft size={17} /></button>
          <button className="perspective-scroll-button" disabled={edges.end} onClick={() => move(1)} aria-label="Next perspectives"><ArrowRight size={17} /></button>
        </div>
      </div>
    </>
  );
}