import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Radio } from 'lucide-react';
import { LandingInteractiveDemo } from './LandingInteractiveDemo';

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          {/* Pill Badge */}
          <div className="gsap-hero-badge inline-flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Next.js 16 + WebSockets Real-Time Platform</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>

          {/* Headline */}
          <h1 className="gsap-hero-title text-4xl sm:text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6">
            Seamless Conversations.{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Instant Collaboration.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="gsap-hero-subtitle text-base sm:text-lg text-on-surface-variant leading-relaxed mb-8 max-w-2xl mx-auto">
            Experience lightning-fast 1-on-1 and group messaging with optimistic UI, live presence indicators, user search, and enterprise-grade reliability.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/login"
              className="gsap-hero-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Start Chatting Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="gsap-hero-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface border border-outline-variant/40 font-semibold text-base px-6 py-3.5 rounded-xl hover:bg-surface-container-high shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Try Live Preview</span>
            </a>
          </div>

          {/* Trust Metrics */}
          <div className="gsap-hero-metrics grid grid-cols-3 gap-4 max-w-md mx-auto mt-10 pt-8 border-t border-outline-variant/30 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-on-surface">&lt; 30ms</div>
              <div className="text-xs text-on-surface-variant font-medium">Socket Latency</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-on-surface">100%</div>
              <div className="text-xs text-on-surface-variant font-medium">Live Synced</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-on-surface">JWT</div>
              <div className="text-xs text-on-surface-variant font-medium">Secure Auth</div>
            </div>
          </div>
        </div>

        {/* Interactive Live Teaser Component */}
        <LandingInteractiveDemo />
      </div>
    </section>
  );
}
