import React from 'react';
import { Zap, Users, ShieldCheck, RefreshCw, MessageSquareDashed, Smartphone } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    iconBg: 'bg-primary/10 text-primary',
    title: 'Real-Time WebSockets',
    description:
      'Bi-directional Socket.io connection delivering instant messages, real-time group updates, and optimistic UI synchronization.',
  },
  {
    icon: Users,
    iconBg: 'bg-sky-500/10 text-sky-600',
    title: 'Dynamic Group Channels',
    description:
      'Create multi-member groups, manage participants, assign admin privileges, and rename channels seamlessly in real time.',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-indigo-500/10 text-indigo-600',
    title: 'Enterprise Security',
    description:
      'JWT Bearer authentication on every request and WebSocket handshake with automatic session verification and refresh.',
  },
  {
    icon: RefreshCw,
    iconBg: 'bg-emerald-500/10 text-emerald-600',
    title: 'Cross-Tab Instant Sync',
    description:
      'Seamless multi-window experience powered by BroadcastChannel and TanStack Query cache invalidation.',
  },
  {
    icon: MessageSquareDashed,
    iconBg: 'bg-purple-500/10 text-purple-600',
    title: 'Live 3-Dots Typing Indicator',
    description:
      'Accurate multi-channel presence events let you know precisely when team members are composing replies.',
  },
  {
    icon: Smartphone,
    iconBg: 'bg-amber-500/10 text-amber-600',
    title: 'Fluid Mobile Experience',
    description:
      'Engineered with responsive sliding drawer views, touch-first message composers, and adaptive sidebar panels.',
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 bg-surface-container-low border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Engineered for Speed, Clarity, and Scale
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant">
            Built with Next.js 16 App Router, Tailwind CSS, TanStack Query, and Socket.io for an uncompromising communication experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="gsap-feature-card bg-surface-container-lowest p-6 sm:p-7 rounded-3xl border border-outline-variant/20 shadow-xs hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
