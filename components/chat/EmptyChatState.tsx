'use client';

import React from 'react';
import { Plus, MessageSquarePlus, Sparkles, Heart } from 'lucide-react';

interface EmptyChatStateProps {
  onOpenNewChat: () => void;
}

export function EmptyChatState({ onOpenNewChat }: EmptyChatStateProps) {
  return (
    <div className="flex-1 h-full bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Decorative background blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center -z-10">
        <div className="w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] absolute" />
        <div className="w-[350px] h-[350px] bg-secondary-container/10 rounded-full blur-[80px] absolute ml-[200px] mb-[150px]" />
      </div>

      <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
        {/* Abstract Graphic with floating UI elements */}
        <div className="w-56 h-56 mb-8 relative flex items-center justify-center">
          <svg
            className="w-full h-full text-surface-container-highest"
            fill="currentColor"
            viewBox="0 0 200 200"
          >
            <path
              className="text-primary-container/20 animate-pulse"
              d="M40 80 Q100 20 160 80 T160 160 Q100 120 40 160 Z"
            />
            <circle className="text-surface-tint/10" cx="100" cy="100" r="40" />
            <rect
              className="text-secondary-container/30 shadow-sm"
              height="40"
              rx="8"
              width="60"
              x="70"
              y="70"
            />
            <path
              className="text-on-surface-variant/30"
              d="M80 80 L120 80 M80 90 L110 90 M80 100 L100 100"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>

          {/* Floating UI Bubble 1 */}
          <div className="absolute -right-2 top-8 bg-surface-container-lowest p-3 rounded-2xl shadow-xl border border-outline-variant/30 animate-bounce duration-1000">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="w-14 h-2 rounded-full bg-surface-container-highest" />
            </div>
          </div>

          {/* Floating UI Bubble 2 */}
          <div className="absolute -left-4 bottom-10 bg-surface-container-lowest p-3.5 rounded-full shadow-lg border border-outline-variant/30">
            <Heart className="w-5 h-5 text-primary fill-primary/20" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-3 tracking-tight">
          Your messages, all in one place
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-on-surface-variant mb-8 max-w-sm leading-relaxed">
          Select a conversation from the sidebar or start a new one to begin chatting with your team.
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onOpenNewChat}
          className="group relative px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>
    </div>
  );
}
