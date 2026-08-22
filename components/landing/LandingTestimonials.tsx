'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

const TESTIMONIALS = [
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

export function LandingTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  const activeTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-20 bg-surface-container-low border-b border-outline-variant/30 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Client Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Loved by Modern Teams Worldwide
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant">
            See how engineering leads, designers, and product teams experience seamless communication with ChatFlow.
          </p>
        </div>

        {/* Testimonial Carousel Box */}
        <div
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 sm:p-12 shadow-xl relative transition-all duration-300">
            {/* Top Row: Rating & Quote Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1">
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Quote className="w-5 h-5" />
              </div>
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-base sm:text-xl text-on-surface leading-relaxed font-medium mb-8 min-h-[90px] transition-all">
              &ldquo;{activeTestimonial.quote}&rdquo;
            </blockquote>

            {/* Bottom Row: User info and carousel controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-4">
                <Avatar
                  name={activeTestimonial.name}
                  src={activeTestimonial.avatar}
                  size="lg"
                  isOnline={true}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-on-surface leading-tight">
                      {activeTestimonial.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {activeTestimonial.badge}
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant mt-0.5">
                    {activeTestimonial.role} • <span className="font-semibold text-primary">{activeTestimonial.company}</span>
                  </div>
                </div>
              </div>

              {/* Slider Arrows & Pagination */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 mr-2">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? 'w-7 bg-primary' : 'w-2 bg-outline-variant/60 hover:bg-outline-variant'
                      }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface flex items-center justify-center hover:bg-surface-container-high hover:border-primary/40 transition-all cursor-pointer"
                  title="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 hover:shadow-md transition-all cursor-pointer"
                  title="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
