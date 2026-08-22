import React from 'react';
import type { Metadata } from 'next';
import {
  LandingHeader,
  LandingHero,
  LandingFeatures,
  LandingTechStack,
  LandingTestimonials,
  LandingFAQ,
  LandingCTA,
  LandingFooter,
  LandingGsapAnimations,
} from '@/components/landing';

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
        url: '/icon.svg',
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
    images: ['/icon.svg'],
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
      'Live 3-Dots Typing Indicators',
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

      {/* GSAP Enhanced Animated Sections */}
      <LandingGsapAnimations>
        {/* 2. Hero Section with Interactive Sandbox Teaser */}
        <LandingHero />

        {/* 3. Core Features Grid */}
        <LandingFeatures />

        {/* 4. Full-Stack Tech Architecture */}
        <LandingTechStack />

        {/* 5. Client Testimonials & Review Slider */}
        <LandingTestimonials />

        {/* 6. Frequently Asked Questions (FAQ) Accordion */}
        <LandingFAQ />

        {/* 7. Call To Action (CTA) Banner */}
        <LandingCTA />
      </LandingGsapAnimations>

      {/* 8. Reusable Landing Footer */}
      <LandingFooter />
    </div>
  );
}
