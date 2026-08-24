'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy } from 'lucide-react';

const FIXED_SLIDES = [
  {
    id: 'slide-1',
    title: 'Interstellar',
    type: 'movie',
    coverUrl: 'https://image.tmdb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    id: 'slide-2',
    title: 'Cinema Theater',
    type: 'movie',
    coverUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600',
  },
  {
    id: 'slide-3',
    title: 'Esports Gaming',
    type: 'game',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600',
  },
  {
    id: 'slide-4',
    title: 'Breaking Bad',
    type: 'series',
    coverUrl: 'https://image.tmdb.org/t/p/w1280/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  },
  {
    id: 'slide-5',
    title: 'Console Gaming',
    type: 'game',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600',
  },
  {
    id: 'slide-6',
    title: 'Fight Club',
    type: 'movie',
    coverUrl: 'https://image.tmdb.org/t/p/w1280/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  },
  {
    id: 'slide-7',
    title: 'Retro Arcade',
    type: 'game',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600',
  },
  {
    id: 'slide-8',
    title: 'The Last of Us',
    type: 'series',
    coverUrl: 'https://image.tmdb.org/t/p/w1280/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
  },
  {
    id: 'slide-9',
    title: 'Movie Screen & Projector',
    type: 'movie',
    coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600',
  },
  {
    id: 'slide-10',
    title: 'Cinema Auditorium',
    type: 'movie',
    coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600',
  },
];

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600';

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
      setImgSrc(DEFAULT_FALLBACK_IMAGE);
    }
  };

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
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
        className={`object-cover object-center transition-transform duration-[5000ms] ease-out ${
          isActive && !prefersReducedMotion ? 'scale-[1.08]' : 'scale-100'
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

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % FIXED_SLIDES.length);
  }, []);

  // Auto-advance timer (every 5s)
  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      return;
    }

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, nextSlide]);

  return (
    <div className="relative w-full overflow-hidden bg-[#0F0E17]">
      {/* Background Poster Slideshow */}
      <div
        className="relative w-full h-200 sm:h-300 flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        tabIndex={0}
        aria-label="Media cover slideshow"
      >
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

        {/* Dark Bottom-Heavy Gradient Overlay for readability */}
        <div className="absolute inset-0 z-1 bg-linear-to-t from-[#0F0E17] via-[#0F0E17]/75 to-[#0F0E17]/60 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="max-w-3xl space-y-6 text-left">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#FFFFFE] tracking-tight leading-[1.08] font-display">
              Track everything you've watched and played.
            </h1>

            {/* Main Copy */}
            <p className="text-[#94A1B2] text-lg sm:text-xl leading-relaxed font-serif-accent max-w-2xl">
              Track every movie, show, and game you finish. Rate it, rank it against your friends, earn points and have fun!
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md">
              <Link
                href="/browse"
                className="agency-btn-primary px-8 py-4 flex items-center justify-center gap-3 transition-all text-center shadow-lg cursor-pointer"
              >
                <span>Browse Stuff</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/leaderboards"
                className="agency-btn-secondary px-8 py-4 flex items-center justify-center gap-3 transition-all text-center cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-[#FFD93D]" />
                <span>See the Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
