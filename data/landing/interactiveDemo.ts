export interface DemoMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
}

export interface DemoConversation {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
  isGroup?: boolean;
  lastTime: string;
  messages: DemoMessage[];
}

export const EMOJI_LIST = ['👍', '❤️', '😊', '🎉', '🚀', '🔥', '👏', '✨', '👋', '💯'];

export const DEMO_PREVIEWS: DemoConversation[] = [
  {
    id: 'sarah',
    name: 'Sarah Ahmed',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    online: true,
    lastTime: '10:44 AM',
    messages: [
      { id: 1, sender: 'sarah', text: 'Hey! Are we still meeting at 4 PM for the design review?', time: '10:42 AM' },
      { id: 2, sender: 'me', text: "Yes, absolutely! I've updated the Figma components.", time: '10:43 AM' },
      { id: 3, sender: 'sarah', text: 'Perfect! See you then. Looking forward to it.', time: '10:44 AM' },
    ],
  },
  {
    id: 'team',
    name: 'Design Team',
    role: '6 members',
    isGroup: true,
    online: true,
    lastTime: '10:30 AM',
    messages: [
      { id: 1, sender: 'Alex Rivera', text: 'New landing page components have been deployed!', time: '10:25 AM' },
      { id: 2, sender: 'me', text: 'The typography and micro-interactions look stunning.', time: '10:28 AM' },
      { id: 3, sender: 'Sarah Ahmed', text: 'Agree! Let us do a quick QA pass today.', time: '10:30 AM' },
    ],
  },
  {
    id: 'david',
    name: 'David Chen',
    role: 'Engineering Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    online: false,
    lastTime: 'Yesterday',
    messages: [
      { id: 1, sender: 'david', text: 'API endpoints for socket events are fully tested.', time: 'Yesterday' },
      { id: 2, sender: 'me', text: 'Awesome! Optimistic UI handling is rock solid.', time: 'Yesterday' },
    ],
  },
];
