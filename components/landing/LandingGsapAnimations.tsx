'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LandingGsapAnimationsProps {
  children: React.ReactNode;
}

export function LandingGsapAnimations({ children }: LandingGsapAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register GSAP plugins safely on client
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // 1. Hero Section Subtle Entrance (Preserves LCP by animating from visible/near-visible state)
      const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      heroTl
        .from('.gsap-hero-badge', { y: -12, opacity: 0.4, duration: 0.5, delay: 0.05 })
        .from('.gsap-hero-title', { y: 20, opacity: 0.6, duration: 0.6, stagger: 0.1 }, '-=0.3')
        .from('.gsap-hero-subtitle', { y: 15, opacity: 0.7, duration: 0.5 }, '-=0.4')
        .from('.gsap-hero-cta', { y: 15, opacity: 0.8, scale: 0.98, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .from('.gsap-hero-metrics', { y: 12, opacity: 0.7, duration: 0.5 }, '-=0.3')
        .from('#demo', { y: 30, opacity: 0.7, duration: 0.8, ease: 'power3.out' }, '-=0.3');

      // Subtle float animation for ambient teaser demo
      gsap.to('#demo', {
        y: -6,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 2. Features Cards Scroll Trigger Animation
      gsap.fromTo(
        '.gsap-feature-card',
        { opacity: 0.3, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#features',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 3. Tech Stack Grid Stagger Animation
      gsap.fromTo(
        '.gsap-stack-card',
        { opacity: 0.3, y: 25, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '#tech-stack',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 4. Testimonials Box Entrance
      gsap.fromTo(
        '#testimonials .max-w-4xl',
        { opacity: 0.4, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#testimonials',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 5. FAQ Accordion Items Stagger Animation
      gsap.fromTo(
        '#faq .space-y-4 > div',
        { opacity: 0.4, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#faq',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 6. CTA Banner Pulsing Reveal
      gsap.fromTo(
        '.gsap-cta-banner',
        { opacity: 0.4, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-cta-banner',
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
