export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  badge: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    role: 'Lead Product Manager',
    company: 'TechVentures',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote:
      'ChatFlow completely replaced our messy Slack channels. The instantaneous WebSocket sync and fluid Material Design 3 interface make collaboration feel completely effortless.',
    badge: 'Verified Customer',
  },
  {
    id: 2,
    name: 'Alex Rivera',
    role: 'Staff Frontend Architect',
    company: 'NextGen Cloud',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote:
      'The optimistic UI and TanStack Query integration are world-class. Sending messages has zero perceived lag, and the live 3-dots typing indicators work flawlessly across all tabs.',
    badge: 'Verified Enterprise',
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'VP of Engineering',
    company: 'PulseScale Technologies',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote:
      'Security and cookie session revocation are rock solid. We deployed ChatFlow for our remote engineering squads and noticed an immediate boost in communication turnaround.',
    badge: 'Verified Customer',
  },
  {
    id: 4,
    name: 'Emily Watson',
    role: 'Head of Product Design',
    company: 'Studio Pixel & Co',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    quote:
      'The Google Stitch design aesthetics are astonishingly clean. Every transition, avatar badge, and subtle ambient glow makes the product feel incredibly premium.',
    badge: 'Design Partner',
  },
];
