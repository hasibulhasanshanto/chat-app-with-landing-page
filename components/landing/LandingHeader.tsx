'use client';

import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMounted } from '@/hooks/useMounted';

interface LandingHeaderProps {
  className?: string;
}

export function LandingHeader({ className = '' }: LandingHeaderProps) {
  const mounted = useMounted();
  const { isAuthenticated } = useAuth();

  return (
    <header className={`sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-on-surface tracking-tight leading-none">
              ChatFlow
            </span>
            <span className="text-[10px] uppercase font-semibold text-primary tracking-widest mt-0.5">
              Real-time Messaging
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
          <a href="#demo" className="hover:text-primary transition-colors">
            Interactive Demo
          </a>
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#tech-stack" className="hover:text-primary transition-colors">
            Tech Stack
          </a>
        </nav>

        {/* Right CTA / Auth Action */}
        <div className="flex items-center gap-3">
          {mounted && isAuthenticated ? (
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-primary text-on-primary text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Open Chat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-on-surface px-4 py-2 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Log In
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-primary text-on-primary text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
