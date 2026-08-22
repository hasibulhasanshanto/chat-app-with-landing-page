'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, Sparkles } from 'lucide-react';
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

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // 3-second reliable auto change
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const activeTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-surface-container-low border-b border-outline-variant/30 relative overflow-hidden">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-10 w-[300px] h-[300px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Client Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2 sm:mb-3">
            Loved by Modern Teams Worldwide
          </h2>
          <p className="text-xs sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            See how engineering leads, designers, and fast-paced product teams experience seamless communication with ChatFlow.
          </p>
        </div>

        {/* Testimonial Box with Responsive Layout */}
        <div
          className="max-w-4xl mx-auto relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Ambient Glow Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-indigo-500/20 to-sky-500/30 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500 pointer-events-none" />

          <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-5 sm:p-10 md:p-12 shadow-xl transition-all duration-300">
            {/* Top Row: Rating & Floating Quote Icon */}
            <div className="flex items-center justify-between mb-5 sm:mb-8">
              <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 drop-shadow-xs"
                  />
                ))}
                <span className="text-[11px] sm:text-xs font-bold text-amber-700 ml-1">5.0</span>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/25 shrink-0">
                <Quote className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="min-h-[90px] sm:min-h-[110px] flex items-center mb-6 sm:mb-8">
              <blockquote
                key={activeTestimonial.id}
                className="text-base sm:text-xl md:text-2xl text-on-surface leading-relaxed font-semibold tracking-tight transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              >
                &ldquo;{activeTestimonial.quote}&rdquo;
              </blockquote>
            </div>

            {/* Bottom Row: Responsive User info and carousel controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pt-5 sm:pt-6 border-t border-outline-variant/20">
              <div
                key={`author-${activeTestimonial.id}`}
                className="flex items-center gap-3 min-w-0 animate-in fade-in slide-in-from-bottom-1 duration-200"
              >
                <Avatar
                  name={activeTestimonial.name}
                  src={activeTestimonial.avatar}
                  size="md"
                  isOnline={true}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-sm sm:text-base text-on-surface leading-tight truncate">
                      {activeTestimonial.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
                      <span>{activeTestimonial.badge}</span>
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 truncate">
                    {activeTestimonial.role} • <span className="font-semibold text-primary">{activeTestimonial.company}</span>
                  </div>
                </div>
              </div>

              {/* Slider Arrows & Pagination Bullets */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/10">
                <div className="flex items-center gap-1.5">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-6 sm:w-8 bg-primary shadow-xs'
                          : 'w-2 sm:w-2.5 bg-outline-variant/50 hover:bg-outline-variant'
                      }`}
                      title={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface flex items-center justify-center hover:bg-surface-container-high hover:border-primary/40 active:scale-95 transition-all cursor-pointer shadow-xs"
                    title="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all cursor-pointer"
                    title="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
