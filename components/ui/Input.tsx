'use client';

import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full group">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-on-surface-variant/60 group-focus-within:text-primary transition-colors pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-surface-container-low text-on-surface text-sm rounded-xl py-2.5 px-4 border border-outline-variant/30 transition-all placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface-container-lowest disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-error focus:ring-error/20 focus:border-error',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center justify-center text-on-surface-variant/60">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-error font-medium mt-0.5">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
