'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer';

    const variantStyles = {
      primary:
        'bg-primary text-on-primary shadow-sm hover:shadow-md hover:bg-primary/90 hover:brightness-105',
      secondary:
        'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 shadow-sm',
      outline:
        'border border-outline-variant/60 bg-transparent text-on-surface hover:bg-surface-container-high hover:border-outline-variant',
      ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high',
      danger:
        'bg-error text-on-error hover:bg-error/90 shadow-sm hover:shadow-md',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
      icon: 'w-10 h-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
