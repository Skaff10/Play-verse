import Link from 'next/link';
import HeroSlideshow from '@/components/HeroSlideshow';
import AnnouncementBar from '@/components/landing/AnnouncementBar';
import PosterMarquee from '@/components/landing/PosterMarquee';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import StatusShowcase from '@/components/landing/StatusShowcase';
import { CornerBrackets, CornerBracketsBottom } from '@/components/landing/CornerBracket';

/**
 * Play Verse Landing Page — AUI.io-inspired layout & design system.
 *
 * Section order (matching AUI):
 * 1. Announcement Bar (fixed top)
 * 2. Hero (fullscreen with slideshow)
 * 3. Poster Marquee (logo strip equivalent)
 * 4. How It Works (sticky product card equivalent)
 * 5. Comparison (Apollo vs LLM → Spreadsheet vs Play Verse)
 * 6. Statement Section (big headline)
 * 7. Community CTA (partnership banner equivalent)
 * 8. Status Showcase (careers grid equivalent)
 * 9. Footer (handled by layout)
 */
export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Hero Section — fullscreen slideshow */}
      <section className="bg-space">
        <div className="space-y-12 pt-6 pb-1 md:space-y-24 lg:pt-8">
          <HeroSlideshow />
        </div>
      </section>

      {/* 3. Poster Marquee Strip */}
      <section className="bg-space">
        <div className="pt-16 pb-1 md:pt-32 space-y-12 md:space-y-24">
          <PosterMarquee />
        </div>
      </section>

      {/* 4. How It Works — light card with corner brackets */}
      <section className="bg-space">
        <div className="pt-16 pb-1 md:pt-32 space-y-12 md:space-y-24">
          <HowItWorksSection />
        </div>
      </section>

      {/* 5. Comparison Section — Spreadsheet vs Play Verse */}
      <section className="bg-space">
        <div className="pt-6 pb-1 md:pt-40 space-y-12 md:space-y-24">
          <ComparisonSection />
        </div>
      </section>

      {/* 6. Statement Section — big headline */}
      <section className="bg-space">
        <div className="pt-16 pb-1 md:pt-48 space-y-12 md:space-y-24">
          <div className="mx-auto w-full max-w-[1192px] px-5 md:px-0">
            <div className="mx-auto flex w-full flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <h2 className="text-aui-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-[646px] text-mist">
                <span className="opacity-50 block">Stop forgetting.</span>
                Start tracking.
              </h2>
              <p className="text-aui-content max-w-[400px]">
                Every movie you watched, every show you binged, every game you played — they all deserve to be remembered. Play Verse is where your media life lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Community CTA — partnership/banner equivalent */}
      <section className="bg-space">
        <div className="pt-16 pb-1 md:pt-32 space-y-12 md:space-y-24">
          <div className="mx-auto px-5 md:px-10 max-w-[1560px]">
            <div className="relative mx-auto w-full overflow-hidden rounded-xl border border-stroke-dark pb-6 pt-8 md:py-[84px]">
              <div className="mx-auto max-w-[1192px] px-5 md:px-10">
                <div className="mx-auto flex w-full flex-col items-center justify-between gap-5 gap-y-12 md:flex-row">
                  {/* Text */}
                  <div className="flex flex-1 flex-col justify-between gap-y-6 md:max-w-[610px] md:gap-y-12">
                    <h2 className="text-aui-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-mist">
                      Join the community{' '}
                      <span className="opacity-50">of media enthusiasts</span>
                    </h2>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Link href="/auth/sign-in" className="btn-aui-primary">
                        Create Your Profile
                      </Link>
                      <Link href="/browse" className="btn-aui-secondary">
                        Browse Catalog
                      </Link>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid flex-1 grid-cols-2 gap-4 md:max-w-[400px]">
                    <div className="rounded-lg border border-stroke-dark bg-eerie p-5">
                      <div className="text-2xl font-extrabold text-fire">3</div>
                      <div className="mt-1 text-xs text-mist/50">Media Types</div>
                    </div>
                    <div className="rounded-lg border border-stroke-dark bg-eerie p-5">
                      <div className="text-2xl font-extrabold text-fire">10</div>
                      <div className="mt-1 text-xs text-mist/50">XP per Title</div>
                    </div>
                    <div className="rounded-lg border border-stroke-dark bg-eerie p-5">
                      <div className="text-2xl font-extrabold text-fire">∞</div>
                      <div className="mt-1 text-xs text-mist/50">Titles to Track</div>
                    </div>
                    <div className="rounded-lg border border-stroke-dark bg-eerie p-5">
                      <div className="text-2xl font-extrabold text-fire">1–10</div>
                      <div className="mt-1 text-xs text-mist/50">Rating Scale</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Status Showcase — careers grid equivalent */}
      <section className="bg-space">
        <div className="pt-16 pb-16 md:pt-40 md:pb-40 space-y-12 md:space-y-24">
          <StatusShowcase />
        </div>
      </section>
    </div>
  );
}
