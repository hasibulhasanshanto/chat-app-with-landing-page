import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Users,
  ArrowRight,
  Radio,
  Layers,
  Code2,
  Lock,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { LandingHeader, LandingFooter, LandingInteractiveDemo } from '@/components/landing';

export const metadata: Metadata = {
  title: 'ChatFlow — Modern Real-Time Messaging & Team Collaboration Platform',
  description:
    'ChatFlow is a next-generation real-time messaging workspace built with Next.js 16, React 19, and WebSockets. Experience instant 1-on-1 chats, group channels, live typing indicators, and enterprise-grade security.',
  keywords: [
    'real-time chat',
    'messaging platform',
    'team collaboration',
    'socket.io chat',
    'nextjs chat app',
    'group messaging',
    'live chat application',
    'live workspace',
    'ChatFlow',
  ],
  authors: [{ name: 'ChatFlow Team' }],
  creator: 'ChatFlow',
  publisher: 'ChatFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://chat-app-with-landing.vercel.app'
  ),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'ChatFlow — Modern Real-Time Messaging Platform',
    description:
      'Connect with your team instantly with lightning-fast real-time messaging, group channels, live typing indicators, and enterprise-grade reliability.',
    url: '/',
    siteName: 'ChatFlow',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/favicon.ico',
        width: 1200,
        height: 630,
        alt: 'ChatFlow Real-Time Messaging Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatFlow — Modern Real-Time Messaging Platform',
    description:
      'Experience lightning-fast 1-on-1 and group messaging with live presence, optimistic UI, and zero latency.',
    creator: '@ChatFlowApp',
    images: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function LandingPage() {
  // Structured Data (JSON-LD) for Search Engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ChatFlow',
    url: 'https://chat-app-with-landing.vercel.app',
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Any',
    description:
      'ChatFlow is a next-generation real-time messaging application with instant 1-on-1 chats, group channels, live typing indicators, and optimistic UI.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time WebSocket Messaging',
      'Direct 1-to-1 Conversations',
      'Multi-Member Group Channels',
      'Live Typing Indicators',
      'Infinite Message Scroll Pagination',
      'Enterprise JWT Security',
    ],
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Inject Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Reusable Landing Header */}
      <LandingHeader />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Ambient background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Next.js 16 + WebSockets Real-Time Platform</span>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6">
              Seamless Conversations.{' '}
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                Instant Collaboration.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-8 max-w-2xl mx-auto">
              Experience lightning-fast 1-on-1 and group messaging with optimistic UI, live presence indicators, user search, and enterprise-grade reliability.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Start Chatting Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface border border-outline-variant/40 font-semibold text-base px-6 py-3.5 rounded-xl hover:bg-surface-container-high shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Try Live Preview</span>
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-10 pt-8 border-t border-outline-variant/30 text-center">
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

      {/* 3. Feature Highlights Grid */}
      <section id="features" className="py-16 bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-3">
              Engineered for Speed, Clarity, and Scale
            </h2>
            <p className="text-sm text-on-surface-variant">
              Built with Next.js 16 App Router, Tailwind CSS, TanStack Query, and Socket.io for an uncompromising communication experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Real-Time WebSockets</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Bi-directional Socket.io connection delivering instant messages, real-time group updates, and optimistic UI synchronization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Dynamic Group Channels</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Create multi-member groups, manage participants, assign admin privileges, and rename channels seamlessly in real time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Enterprise Security</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                JWT Bearer authentication on every request and WebSocket handshake with automatic session verification and refresh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technology Stack Section */}
      <section id="tech-stack" className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-3">
              Modern Full-Stack Architecture
            </h2>
            <p className="text-sm text-on-surface-variant">
              Every layer of ChatFlow is optimized for responsiveness, developer experience, and bulletproof reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-surface-container mx-auto flex items-center justify-center mb-2 text-primary">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-on-surface">Next.js 16</div>
              <div className="text-[10px] text-on-surface-variant">App Router & Turbopack</div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-surface-container mx-auto flex items-center justify-center mb-2 text-sky-500">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-on-surface">React 19</div>
              <div className="text-[10px] text-on-surface-variant">Concurrent React</div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-surface-container mx-auto flex items-center justify-center mb-2 text-rose-500">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-on-surface">TanStack Query</div>
              <div className="text-[10px] text-on-surface-variant">v5 Infinite Pagination</div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-surface-container mx-auto flex items-center justify-center mb-2 text-amber-600">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-on-surface">Zustand v5</div>
              <div className="text-[10px] text-on-surface-variant">Atomic UI State</div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-surface-container mx-auto flex items-center justify-center mb-2 text-emerald-600">
                <Radio className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-on-surface">Socket.io</div>
              <div className="text-[10px] text-on-surface-variant">Real-Time Engine</div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-surface-container mx-auto flex items-center justify-center mb-2 text-purple-600">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-on-surface">JWT + Cookies</div>
              <div className="text-[10px] text-on-surface-variant">Middleware Guards</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-16 bg-surface relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary to-indigo-700 text-on-primary rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">
                Ready to Experience ChatFlow?
              </h2>
              <p className="text-sm text-indigo-100 mb-6 leading-relaxed">
                Join with your name and phone number in seconds. No complex setup or password required.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:bg-indigo-50 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Launch ChatFlow Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Reusable Landing Footer */}
      <LandingFooter />
    </div>
  );
}
