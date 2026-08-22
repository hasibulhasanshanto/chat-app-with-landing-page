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
      // 1. Hero Section Entrance Animation
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl
        .fromTo(
          '.gsap-hero-badge',
          { opacity: 0, y: -20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.1 }
        )
        .fromTo(
          '.gsap-hero-title',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 },
          '-=0.4'
        )
        .fromTo(
          '.gsap-hero-subtitle',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          '.gsap-hero-cta',
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
          '-=0.4'
        )
        .fromTo(
          '.gsap-hero-metrics',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '#demo',
          { opacity: 0, y: 45, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out' },
          '-=0.4'
        );

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
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#features',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 3. Tech Stack Grid Stagger Animation
      gsap.fromTo(
        '.gsap-stack-card',
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '#tech-stack',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 4. Testimonials Box Entrance
      gsap.fromTo(
        '#testimonials .max-w-4xl',
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#testimonials',
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 5. FAQ Accordion Items Stagger Animation
      gsap.fromTo(
        '#faq .space-y-4 > div',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#faq',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 6. CTA Banner Pulsing Reveal
      gsap.fromTo(
        '.gsap-cta-banner',
        { opacity: 0, y: 40, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-cta-banner',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
