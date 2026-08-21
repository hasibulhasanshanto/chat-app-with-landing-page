import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className,
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary-container text-on-secondary-container',
    neutral: 'bg-surface-container-high text-on-surface-variant',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-error text-on-error',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium leading-none select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
