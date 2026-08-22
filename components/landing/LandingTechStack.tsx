import React from 'react';
import { STACK_ITEMS } from '@/data/landing/techStack';

export function LandingTechStack() {
  return (
    <section id="tech-stack" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Technology Foundation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Modern Full-Stack Architecture
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant">
            Every layer of ChatFlow is optimized for responsiveness, developer experience, and bulletproof reliability.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {STACK_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="gsap-stack-card bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/20 text-center shadow-xs hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-surface-container mx-auto flex items-center justify-center mb-3 ${item.iconColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-on-surface mb-0.5">{item.name}</div>
                <div className="text-[11px] text-on-surface-variant leading-tight">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
