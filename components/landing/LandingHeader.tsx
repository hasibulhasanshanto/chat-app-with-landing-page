'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ArrowRight,
  Menu,
  X,
  Radio,
  Sparkles,
  Layers,
  HelpCircle,
  Star,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMounted } from '@/hooks/useMounted';

interface LandingHeaderProps {
  className?: string;
}

export function LandingHeader({ className = '' }: LandingHeaderProps) {
  const mounted = useMounted();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Smooth animated scroll to top when brand logo is clicked
  const handleScrollToTop = useCallback((e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      // If on landing page root, scroll smoothly to the very top
      if (window.location.pathname === '/' || window.location.pathname === '') {
        e.preventDefault();
        closeMenu();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  }, []);

  // Smooth animated scroll to section with header offset
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    closeMenu();

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 76;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 transition-all ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo & Name (Clicking scrolls to top smoothly) */}
        <Link
          href="/"
          onClick={handleScrollToTop}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
          title="Back to top"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
            <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg text-on-surface tracking-tight leading-none">
              ChatFlow
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-primary tracking-widest mt-0.5">
              Real-time Messaging
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Smooth Animated Scrolling */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-on-surface-variant">
          <a
            href="#demo"
            onClick={(e) => handleSmoothScroll(e, '#demo')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Interactive Demo
          </a>
          <a
            href="#features"
            onClick={(e) => handleSmoothScroll(e, '#features')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Features
          </a>
          <a
            href="#tech-stack"
            onClick={(e) => handleSmoothScroll(e, '#tech-stack')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Tech Stack
          </a>
          <a
            href="#testimonials"
            onClick={(e) => handleSmoothScroll(e, '#testimonials')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Reviews
          </a>
          <a
            href="#faq"
            onClick={(e) => handleSmoothScroll(e, '#faq')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Right CTA / Auth Action */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile & Tablet Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && isAuthenticated ? (
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-3 py-2 rounded-xl shadow-xs"
            >
              <span>Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-3 py-2 rounded-xl shadow-xs"
            >
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 sm:top-18 bg-surface/95 backdrop-blur-2xl border-b border-outline-variant/30 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 space-y-4">
            {/* Navigation links list with smooth scrolling */}
            <div className="space-y-1">
              <a
                href="#demo"
                onClick={(e) => handleSmoothScroll(e, '#demo')}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <span>Interactive Live Demo</span>
              </a>

              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, '#features')}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Core Features</span>
              </a>

              <a
                href="#tech-stack"
                onClick={(e) => handleSmoothScroll(e, '#tech-stack')}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span>Tech Stack & Architecture</span>
              </a>

              <a
                href="#testimonials"
                onClick={(e) => handleSmoothScroll(e, '#testimonials')}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span>Customer Reviews</span>
              </a>

              <a
                href="#faq"
                onClick={(e) => handleSmoothScroll(e, '#faq')}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span>Frequently Asked Questions</span>
              </a>
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-2.5">
              {mounted && isAuthenticated ? (
                <Link
                  href="/chat"
                  onClick={closeMenu}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-sm py-3.5 rounded-xl shadow-md"
                >
                  <span>Open Chat Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-sm py-3.5 rounded-xl shadow-md"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="w-full inline-flex items-center justify-center gap-2 bg-surface-container text-on-surface font-semibold text-sm py-3 rounded-xl border border-outline-variant/30"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Existing Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
