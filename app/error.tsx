'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  RotateCcw,
  Home,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected client runtime errors for monitoring
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-error/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Error Box */}
      <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Icon Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center shadow-md shadow-error/10">
            <AlertTriangle className="w-6 h-6 text-error" />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 bg-surface-container-low text-error px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-error/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Application Exception Encountered</span>
        </div>

        {/* Title & Message */}
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-2">
          Something went sideways
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
          An unexpected error occurred while processing your request. Don&apos;t worry, your data and account are safe.
        </p>

        {/* Technical Error Code if present */}
        {error?.digest && (
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-2.5 mb-6 text-[11px] font-mono text-on-surface-variant/80 truncate">
            Error ID: {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-surface-container-low text-on-surface border border-outline-variant/30 font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-surface-container-high transition-all active:scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Footer Support Link */}
        <div className="mt-6 pt-5 border-t border-outline-variant/20">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>Return to Chat Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
