import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

export function LandingCTA() {
  return (
    <section className="py-20 bg-surface relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-primary via-indigo-600 to-primary text-on-primary rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-white/10">
          {/* Ambient inner glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-white/15 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Setup • No Credit Card Required</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-white tracking-tight leading-[1.15]">
              Ready to Upgrade Your Team&apos;s Communication?
            </h2>

            <p className="text-sm sm:text-base text-indigo-100 mb-8 leading-relaxed max-w-xl mx-auto">
              Join thousands of collaborators enjoying real-time instant messaging, live presence, and group workspaces with zero friction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary font-bold text-sm px-8 py-4 rounded-xl shadow-xl hover:bg-indigo-50 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Launch ChatFlow Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 font-semibold text-sm px-6 py-4 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Test Live Sandbox</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
