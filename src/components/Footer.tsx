import Link from 'next/link';
import { CornerBrackets, CornerBracketsBottom } from './landing/CornerBracket';

/**
 * AUI-style footer.
 * Light #F1F0E0 bg, rounded-xl container, corner bracket decorations.
 * Left: CTA card with dark bg. Right: nav link columns.
 */
export default function Footer() {
  return (
    <footer className="mb-5 px-3 md:px-5 mt-16">
      <div className="mx-auto w-full overflow-hidden bg-mist p-4 pb-12 pt-6 text-space rounded-xl border border-space/10 shadow-2xl md:p-8">
        <CornerBrackets variant="light" />

        <div className="my-4 !px-2 md:!px-6 xl:my-16">
          <div className="mx-auto flex w-full flex-col justify-between gap-6 gap-y-8 md:flex-row md:gap-y-8 xl:max-w-[1560px]">
            {/* Left: CTA Card */}
            <div className="flex-1 md:max-w-[45%]">
              <div className="relative flex w-full flex-col justify-between gap-y-12 overflow-hidden rounded-lg bg-space px-6 py-6 text-mist lg:p-8 shadow-md">
                <div>
                  <h2 className="text-aui-heading text-3xl md:text-4xl lg:text-5xl">
                    Start tracking{' '}
                    <span className="opacity-50">your media journey</span>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-mist/70">
                    Movies, shows, and games — all in one place. Rate them, rank them, see how you compare.
                  </p>
                  <div className="mt-8 flex flex-col gap-[14px] xs:flex-row md:mt-10">
                    <Link href="/browse" className="btn-aui-primary w-full text-center">
                      Start Tracking
                    </Link>
                    <Link href="/leaderboards" className="btn-aui-secondary w-full text-center">
                      View Leaderboards
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Navigation Columns */}
            <div className="flex flex-1 flex-col gap-8 sm:flex-row sm:gap-12 md:pl-6 lg:pl-12">
              {/* Navigation */}
              <div className="space-y-4">
                <h4 className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-fire">
                  Navigation
                </h4>
                <ul className="space-y-3 text-sm text-space/90 font-medium">
                  <li>
                    <Link
                      href="/dashboard"
                      className="transition-colors hover:text-fire"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/library"
                      className="transition-colors hover:text-fire"
                    >
                      My Library
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/browse"
                      className="transition-colors hover:text-fire"
                    >
                      Browse Catalog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/leaderboards"
                      className="transition-colors hover:text-fire"
                    >
                      Leaderboards
                    </Link>
                  </li>
                </ul>
              </div>

              {/* XP System */}
              <div className="space-y-4">
                <h4 className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-fire">
                  XP System
                </h4>
                <ul className="space-y-3 text-sm text-space/90 font-medium">
                  <li className="flex items-center justify-between gap-8">
                    <span>In Progress</span>
                    <span className="font-bold text-fire">+2 XP</span>
                  </li>
                  <li className="flex items-center justify-between gap-8">
                    <span>Completed</span>
                    <span className="font-bold text-fire">+5 XP</span>
                  </li>
                  <li className="flex items-center justify-between gap-8">
                    <span>Rate & Review</span>
                    <span className="font-bold text-fire">+2 XP</span>
                  </li>
                  <li className="flex items-center justify-between gap-8">
                    <span>Replay / Rewatch</span>
                    <span className="font-bold text-fire">+1 XP</span>
                  </li>
                </ul>
              </div>

              {/* Account */}
              <div className="space-y-4">
                <h4 className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-fire">
                  Account
                </h4>
                <ul className="space-y-3 text-sm text-space/90 font-medium">
                  <li>
                    <Link
                      href="/auth/sign-in"
                      className="transition-colors hover:text-fire"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/sign-up"
                      className="transition-colors hover:text-fire"
                    >
                      Create Account
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto flex flex-col items-center justify-between gap-3 border-t border-space/20 px-3 pt-6 text-xs text-space/70 font-medium sm:flex-row md:px-6">
          <p>© 2026 PlayVerse. All rights reserved.</p>
          <p className="font-serif-accent italic text-space/80">
            Built for people who actually finish things.
          </p>
        </div>

        <CornerBracketsBottom variant="light" />
      </div>
    </footer>
  );
}
