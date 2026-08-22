'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { FAQS } from '@/data/landing/faq';

export function LandingFAQ() {
  // First FAQ item is open by default on initial render
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant">
            Everything you need to know about ChatFlow’s architecture, real-time socket engine, and features.
          </p>
        </div>

        {/* FAQ Accordion List with Brand-aligned Active States */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl overflow-hidden transition-all duration-200 border ${
                  isOpen
                    ? 'bg-surface-container-lowest border-primary/35 shadow-md ring-1 ring-primary/20'
                    : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/60 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className={`w-full px-6 py-5 flex items-center justify-between text-left gap-4 transition-colors cursor-pointer ${
                    isOpen ? 'bg-primary/[0.03]' : 'hover:bg-surface-container-low/70'
                  }`}
                >
                  <span
                    className={`font-bold text-base transition-colors ${
                      isOpen ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Brand Styled Active/Inactive Chevron Toggle Button */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                      isOpen
                        ? 'rotate-180 bg-primary text-on-primary shadow-sm shadow-primary/30 scale-105'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-2 text-sm text-on-surface-variant leading-relaxed border-t border-primary/10 bg-primary/[0.02] animate-in fade-in slide-in-from-top-1 duration-150">
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
