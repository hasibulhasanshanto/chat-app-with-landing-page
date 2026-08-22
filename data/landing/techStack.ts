import { Code2, Layers, Zap, Cpu, Radio, Lock, LucideIcon } from 'lucide-react';

export interface TechStackItem {
  icon: LucideIcon;
  iconColor: string;
  name: string;
  desc: string;
}

export const STACK_ITEMS: TechStackItem[] = [
  {
    icon: Code2,
    iconColor: 'text-primary',
    name: 'Next.js 16',
    desc: 'App Router & Turbopack',
  },
  {
    icon: Layers,
    iconColor: 'text-sky-500',
    name: 'React 19',
    desc: 'Concurrent React Engine',
  },
  {
    icon: Zap,
    iconColor: 'text-rose-500',
    name: 'TanStack Query',
    desc: 'v5 Infinite Pagination',
  },
  {
    icon: Cpu,
    iconColor: 'text-amber-600',
    name: 'Zustand v5',
    desc: 'Atomic UI State Store',
  },
  {
    icon: Radio,
    iconColor: 'text-emerald-600',
    name: 'Socket.io',
    desc: 'Real-Time Event Engine',
  },
  {
    icon: Lock,
    iconColor: 'text-purple-600',
    name: 'JWT + Cookies',
    desc: 'Middleware Route Guards',
  },
];
