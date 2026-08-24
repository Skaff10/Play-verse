'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * AUI-style fullscreen hero with background poster slideshow.
 * Near-viewport-height with gradient overlay, left-aligned headline and CTA buttons.
 */

const FIXED_SLIDES = [
  { id: 'slide-1', title: 'Interstellar', coverUrl: 'https://image.tmdb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 'slide-2', title: 'Cinema Theater', coverUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600' },
  { id: 'slide-3', title: 'Esports Gaming', coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600' },
  { id: 'slide-4', title: 'Breaking Bad', coverUrl: 'https://image.tmdb.org/t/p/w1280/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  { id: 'slide-5', title: 'Console Gaming', coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600' },
  { id: 'slide-6', title: 'Fight Club', coverUrl: 'https://image.tmdb.org/t/p/w1280/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
  { id: 'slide-7', title: 'Retro Arcade', coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600' },
  { id: 'slide-8', title: 'The Last of Us', coverUrl: 'https://image.tmdb.org/t/p/w1280/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg' },
  { id: 'slide-9', title: 'Movie Projector', coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600' },
  { id: 'slide-10', title: 'Cinema Auditorium', coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600' },
];

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600';

function HeroSlideImage({
  coverUrl,
  title,
  isActive,
  prefersReducedMotion,
  priority,
}: {
  coverUrl: string;
  title: string;
  isActive: boolean;
  prefersReducedMotion: boolean;
  priority: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(coverUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(coverUrl);
    setHasError(false);
  }, [coverUrl]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(DEFAULT_FALLBACK);
    }
  };

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
        isActive ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
      }`}
      aria-hidden={!isActive}
    >
      <Image
        src={imgSrc}
        alt={title || 'Cover image'}
        fill
        unoptimized
        priority={priority}
        className={`object-cover object-center transition-transform duration-[8000ms] ease-out ${
          isActive && !prefersReducedMotion ? 'scale-[1.06]' : 'scale-100'
        }`}
        onError={handleImageError}
      />
    </div>
  );
}

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % FIXED_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, nextSlide]);

  return (
    <section className="relative bg-space">
      <div
        className="relative mx-[10px] h-[calc(100svh-112px)] min-h-[500px] origin-top-left overflow-hidden rounded-xl md:mx-[20px] md:h-[calc(100svh-100px)] md:max-h-[1040px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        tabIndex={0}
        aria-label="Media cover slideshow"
      >
        {/* Rounded border overlay */}
        <div className="pointer-events-none absolute inset-[-1px] z-20 overflow-hidden rounded-xl border border-stroke-dark" />

        {/* Background slides */}
        {FIXED_SLIDES.map((slide, idx) => (
          <HeroSlideImage
            key={slide.id}
            coverUrl={slide.coverUrl}
            title={slide.title}
            isActive={idx === currentIndex}
            prefersReducedMotion={prefersReducedMotion}
            priority={idx === 0}
          />
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-space via-space/70 to-space/40 pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-space/80 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-8 pt-10 sm:px-10 md:px-12 lg:px-16 xl:px-20">
          {/* Top: CTA buttons */}
          <div className="mt-3 flex gap-[10px]">
            <Link href="/browse" className="btn-aui-primary">
              Start Tracking
            </Link>
            <Link href="/leaderboards" className="btn-aui-secondary">
              View Leaderboards
            </Link>
          </div>

          {/* Bottom: Headline & supporting content */}
          <div className="flex w-full flex-col justify-between gap-5 gap-y-10 lg:flex-row lg:items-end">
            {/* Main copy */}
            <div className="max-w-[650px] flex-1">
              <h1 className="text-3xl font-light leading-[1.3] tracking-[0.01em] text-white [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)] sm:text-4xl md:text-[2.5rem] lg:text-[2.75rem]">
                Your personal universe for every movie, show, and game you
                experience. Track it, rate it, own your taste.
              </h1>
            </div>

            {/* Right side: stat cards */}
            <div className="flex flex-col gap-3">
              <div className="group relative flex justify-between gap-3 overflow-hidden rounded-lg bg-space p-3">
                <div className="absolute inset-0 z-0 rounded-lg border border-stroke-dark transition-[opacity,border,background] duration-300 group-hover:border-mist group-hover:bg-mist" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-fire/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-fire">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-aui-eyebrow">Media Types</div>
                    <div className="mt-1 max-w-[230px] text-sm font-light leading-[1.2] text-mist transition-colors duration-300 group-hover:text-space">
                      Movies, TV Shows, and Video Games — all in one place
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative flex justify-between gap-3 overflow-hidden rounded-lg bg-space p-3">
                <div className="absolute inset-0 z-0 rounded-lg border border-stroke-dark transition-[opacity,border,background] duration-300 group-hover:border-mist group-hover:bg-mist" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-fire/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-fire">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-aui-eyebrow">XP System</div>
                    <div className="mt-1 max-w-[230px] text-sm font-light leading-[1.2] text-mist transition-colors duration-300 group-hover:text-space">
                      Earn points for finishing, rating, and reviewing titles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
