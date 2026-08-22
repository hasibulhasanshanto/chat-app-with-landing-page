import { Zap, Users, ShieldCheck, RefreshCw, MessageSquareDashed, Smartphone, LucideIcon } from 'lucide-react';

export interface FeatureItem {
  icon: LucideIcon;
  iconBg: string;
  title: string;
  description: string;
}

export const FEATURES: FeatureItem[] = [
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
