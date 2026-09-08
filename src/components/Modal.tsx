import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { BrandMark } from './Brand';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  compact?: boolean;
}

export function Modal({ title, children, onClose, compact = false }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const labelId = useId();
  closeRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const appRoot = document.getElementById('root');
    const wasInert = appRoot?.inert ?? false;
    document.body.style.overflow = 'hidden';
    if (appRoot) appRoot.inert = true;
    const frame = requestAnimationFrame(() => panel.current?.focus());

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== 'Tab') return;
      const elements = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select, textarea, summary, [tabindex="0"]') ?? []).filter((element) => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); panel.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current || !elements.includes(document.activeElement as HTMLElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (appRoot) appRoot.inert = wasInert;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      else appRoot?.querySelector<HTMLElement>('.brand-link')?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={panel} className={`modal-panel ${compact ? 'modal-compact' : ''}`} role="dialog" aria-modal="true" aria-labelledby={labelId} tabIndex={-1} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.25 }}>
        <div className="modal-topbar"><span className="modal-label" id={labelId}><BrandMark />{title}</span><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button></div>
        <div className="modal-scroll">{children}</div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}