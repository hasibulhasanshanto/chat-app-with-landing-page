'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
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

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant">
            Everything you need to know about ChatFlow’s architecture, real-time socket engine, and features.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <span className="font-bold text-base text-on-surface">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 animate-in fade-in slide-in-from-top-1 duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 bg-surface-container-low border border-outline-variant/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-on-surface">Still have a question?</div>
              <div className="text-xs text-on-surface-variant">Feel free to test our live demo or get started immediately.</div>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs hover:bg-primary/90 transition-all shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Try ChatFlow</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
