import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MessageSquare,
  Home,
  MessageCircle,
  ArrowRight,
  Search,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { LandingHeader, LandingFooter } from '@/components/landing';

export const metadata: Metadata = {
  title: '404 — Page Not Found | ChatFlow',
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Reusable Landing Header */}
      <LandingHeader />

      {/* 404 Content Body */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-2xl w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span>Error 404 • Destination Lost in Transit</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>

          {/* Large Gradient 404 Display */}
          <div className="relative mb-4">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tight text-on-surface select-none">
              4
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                0
              </span>
              4
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/20 rounded-full blur-xl -z-10" />
          </div>

          {/* Headline & Description */}
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-3">
            Message Could Not Be Delivered
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-md mx-auto leading-relaxed mb-8">
            The page or channel you are looking for has either drifted out of frequency, been moved, or does not exist.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface border border-outline-variant/40 font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-surface-container-high shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Go to Chat Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Helpful Destinations Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-5 shadow-xs max-w-lg mx-auto text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span>Looking for one of these?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <Link
                href="/login"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-medium"
              >
                <span>Login / Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant" />
              </Link>
              <Link
                href="/#features"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-medium"
              >
                <span>Platform Features</span>
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant" />
              </Link>
              <Link
                href="/#demo"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-medium"
              >
                <span>Interactive Live Demo</span>
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant" />
              </Link>
              <Link
                href="/#tech-stack"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-medium"
              >
                <span>Architecture & Stack</span>
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Reusable Landing Footer */}
      <LandingFooter />
    </div>
  );
}
