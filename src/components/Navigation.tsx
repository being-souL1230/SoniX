import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Compass, Menu, MessageSquarePlus, X } from 'lucide-react';
import { Brand } from './Brand';

interface NavigationProps {
  page: 'discover' | 'explore';
  onNavigate: (page: 'discover' | 'explore' | 'how-it-works') => void;
  onStart: () => void;
  onJourney: () => void;
  onAsk?: () => void;
  onTour?: () => void;
}

export function Navigation({ page, onNavigate, onStart, onJourney, onAsk, onTour }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = (destination: 'discover' | 'explore' | 'how-it-works') => { onNavigate(destination); setMobileOpen(false); };
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <a href="#discover" className="brand-link" aria-label="SoniX home" onClick={(event) => { event.preventDefault(); navigate('discover'); }}><Brand /></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#discover" aria-current={page === 'discover' ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate('discover'); }}>Discover</a>
          <a href="#explore" data-tour="nav-explore" aria-current={page === 'explore' ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate('explore'); }}>Explore</a>
          <a href="#how-it-works" onClick={(event) => { event.preventDefault(); navigate('how-it-works'); }}>How it works <ArrowUpRight size={13} /></a>
        </nav>
        <div className="nav-actions">
          {onTour && (
            <button
              className="tour-nav-btn text-xs font-semibold text-[#27352b] bg-[#eef3ea] hover:bg-[#dce7d6] hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#cad5c6] transition-all cursor-pointer shadow-xs active:scale-95"
              onClick={onTour}
              title="Take a quick tour of SoniX"
            >
              <Compass size={14} className="text-[#365744]" /> Guided Tour
            </button>
          )}
          {onAsk && (
            <button className="button button-outline button-small nav-ask-btn hidden md:inline-flex" data-tour="nav-ask" onClick={onAsk}>
              <MessageSquarePlus size={14} /> Ask a question
            </button>
          )}
          <button className="journey-link" data-tour="nav-journey" onClick={onJourney}>My journey <ArrowUpRight size={15} /></button>
          <button className="button button-dark button-small nav-start-btn" onClick={onStart}>
            <span className="hidden sm:inline">Start exploring</span>
            <span className="sm:hidden">Explore</span>
            <ArrowRight size={15} />
          </button>
        </div>
        <button className="icon-button mobile-menu-toggle" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      {mobileOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          <button onClick={() => navigate('discover')}>Discover <ArrowUpRight size={17} /></button>
          <button onClick={() => navigate('explore')}>Explore <ArrowUpRight size={17} /></button>
          <button onClick={() => navigate('how-it-works')}>How it works <ArrowUpRight size={17} /></button>
          {onTour && (
            <button onClick={() => { onTour(); setMobileOpen(false); }}>
              <Compass size={16} className="text-[#5b7756] inline mr-1" /> Quick Tour <ArrowUpRight size={17} />
            </button>
          )}
          {onAsk && (
            <button onClick={() => { onAsk(); setMobileOpen(false); }}>
              Ask a question <ArrowUpRight size={17} />
            </button>
          )}
          <button onClick={() => { onJourney(); setMobileOpen(false); }}>My journey <ArrowUpRight size={17} /></button>
          <button className="button button-dark" onClick={() => { onStart(); setMobileOpen(false); }}>Start exploring <ArrowRight size={17} /></button>
        </nav>
      )}
    </header>
  );
}