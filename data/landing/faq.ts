export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: 'What makes ChatFlow faster than traditional chat apps?',
    answer:
      'ChatFlow uses bi-directional WebSockets (Socket.io) coupled with TanStack Query optimistic UI caching. When you send a message, it appears instantly on your screen while asynchronously synchronizing with the backend server, resulting in sub-30ms perceived latency.',
  },
  {
    question: 'How do 1-on-1 and group channels work?',
    answer:
      'You can initiate private 1-on-1 direct conversations with any registered user or create multi-member group channels. Group creators can add members, manage participants, rename group channels, and assign admin roles seamlessly in real time.',
  },
  {
    question: 'Do typing indicators and messages sync across multiple tabs and devices?',
    answer:
      'Yes! ChatFlow implements a dual-layer synchronization engine using Socket.io WebSockets, Server-Sent Events (SSE), and modern browser BroadcastChannels. When you type or receive messages in one tab, all open windows update in real-time.',
  },
  {
    question: 'How does authentication and session security work?',
    answer:
      'ChatFlow uses secure JWT Bearer tokens stored in encrypted HTTP cookies. All protected routes are guarded at the edge by Next.js Middleware. Logging out cleanly clears all tokens across paths and revokes active socket sessions.',
  },
  {
    question: 'Is there a limit on message history or scroll pagination?',
    answer:
      'No. ChatFlow features seamless infinite scroll pagination. When you scroll upwards, older historical messages are fetched smoothly in batches without shifting your scroll position.',
  },
  {
    question: 'How do I get started with ChatFlow?',
    answer:
      'Getting started takes less than 10 seconds! Simply visit the login page, enter your name and phone number to sign up or log in. No complicated password requirements or email verification hurdles.',
  },
];
