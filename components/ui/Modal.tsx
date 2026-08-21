'use client';

import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const MAX_WIDTH_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200',
          MAX_WIDTH_MAP[maxWidth],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
            <div>
              <h2 className="text-lg font-bold text-on-surface">{title}</h2>
              {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
