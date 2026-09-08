import type { ReactNode } from 'react';

export interface TourStep {
  id: string;
  targetSelector: string;
  page?: 'discover' | 'explore';
  badge: string;
  title: string;
  description: string;
  icon: ReactNode;
  actionPrompt?: string;
  offsetY?: number;
}

export interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  isModalOpen?: boolean;
  currentPage?: 'discover' | 'explore';
  onNavigatePage?: (destination: 'discover' | 'explore') => void;
  onStartExperience?: () => void;
  onNavigateToExplore?: () => void;
  onOpenAskModal?: () => void;
  onOpenJourney?: () => void;
}
