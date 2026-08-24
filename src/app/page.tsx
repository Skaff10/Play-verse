import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { safeParseGenres } from '@/lib/catalog';
import MediaCard from '@/components/MediaCard';
import HeroSlideshow from '@/components/HeroSlideshow';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60; // revalidate page every 60 seconds

export default async function LandingPage() {
  // Fetch top catalog items for the hero background slideshow
  const heroCatalogItems = await prisma.catalogItem.findMany({
    where: { coverUrl: { not: '' } },
    orderBy: { ratingCount: 'desc' },
    take: 15,
    select: {
      id: true,
      title: true,
      coverUrl: true,
      type: true,
    },
  });

  // Fetch top catalog items for landing page showcase (ONLY real rated titles)
  const topMovies = await prisma.catalogItem.findMany({
    where: { type: 'movie', ratingCount: { gt: 0 } },
    orderBy: [{ weightedRating: 'desc' }, { ratingCount: 'desc' }],
    take: 4,
  });

  const topSeries = await prisma.catalogItem.findMany({
    where: { type: 'series', ratingCount: { gt: 0 } },
    orderBy: [{ weightedRating: 'desc' }, { ratingCount: 'desc' }],
    take: 4,
  });

  const topGames = await prisma.catalogItem.findMany({
    where: { type: 'game', ratingCount: { gt: 0 } },
    orderBy: [{ weightedRating: 'desc' }, { ratingCount: 'desc' }],
    take: 4,
  });

  // Fetch top 3 XP Leaderboard users
  const topUsers = await prisma.user.findMany({
    orderBy: { totalScore: 'desc' },
    take: 3,
  });

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* HERO SECTION — Full-Bleed Poster/Cover Slideshow */}
      <HeroSlideshow />

      {/* GAMIFICATION & SCORING RULES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#2E2B40] pb-6 gap-4">
          <div>
            <span className="agency-badge uppercase tracking-wider text-xs font-bold">[ HOW THE POINTS WORK ]</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFE] font-display mt-2">
              You get XP for actually finishing things
            </h2>
          </div>
          <p className="text-[#94A1B2] text-sm font-serif-accent italic max-w-md">
            Not for adding fifty titles to a list you'll never touch. Log it, finish it, rate it, maybe write something about why you loved or hated it — that's the whole game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="agency-card p-8 space-y-4">
            <div className="agency-counter text-4xl font-extrabold">01</div>
            <div className="inline-block bg-[#0F0E17] text-[#4ECDC4] border border-[#2E2B40] px-2.5 py-1 text-xs font-bold font-display">
              +2 XP
            </div>
            <h3 className="font-extrabold text-xl text-[#FFFFFE] font-display">In Progress</h3>
            <p className="text-xs text-[#94A1B2] leading-relaxed">
              Add something you're currently watching or playing
            </p>
          </div>

          <div className="agency-card p-8 space-y-4 border-t-4 border-t-[#FF6B6B]">
            <div className="agency-counter text-4xl font-extrabold">02</div>
            <div className="inline-block bg-[#FF6B6B] text-[#FFFFFE] px-2.5 py-1 text-xs font-bold font-display">
              +5 XP
            </div>
            <h3 className="font-extrabold text-xl text-[#FFFFFE] font-display">Finish It</h3>
            <p className="text-xs text-[#94A1B2] leading-relaxed">
              Finish it (or +3 XP if you're upgrading something already in progress)
            </p>
          </div>

          <div className="agency-card p-8 space-y-4">
            <div className="agency-counter text-4xl font-extrabold">03</div>
            <div className="inline-block bg-[#0F0E17] text-[#4ECDC4] border border-[#2E2B40] px-2.5 py-1 text-xs font-bold font-display">
              +2 XP
            </div>
            <h3 className="font-extrabold text-xl text-[#FFFFFE] font-display">Rate & Review</h3>
            <p className="text-xs text-[#94A1B2] leading-relaxed">
              Rate it 1–10 and leave a review of 40+ characters — bonus points for actually explaining yourself
            </p>
          </div>

          <div className="agency-card p-8 space-y-4">
            <div className="agency-counter text-4xl font-extrabold">04</div>
            <div className="inline-block bg-[#0F0E17] text-[#4ECDC4] border border-[#2E2B40] px-2.5 py-1 text-xs font-bold font-display">
              +1 XP
            </div>
            <h3 className="font-extrabold text-xl text-[#FFFFFE] font-display">Rewatch / Replay</h3>
            <p className="text-xs text-[#94A1B2] leading-relaxed">
              Rewatch or replay it (caps out at +5 lifetime per title, so no farming the same movie fifty times)
            </p>
          </div>
        </div>
      </section>

      {/* TOP MOVIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-[#2E2B40] pb-4">
          <div>
            <span className="agency-badge text-xs font-bold uppercase">[ TOP RATED MOVIES ]</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFE] font-display mt-1">Top Rated Movies</h2>
          </div>
          <Link
            href="/browse?type=movie"
            className="text-xs font-bold text-[#4ECDC4] hover:text-[#FF6B6B] flex items-center gap-1 font-display transition-colors"
          >
            <span>View All Movies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {topMovies.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                externalId={item.externalId}
                type={item.type as any}
                title={item.title}
                coverUrl={item.coverUrl}
                releaseYear={item.releaseYear}
                genres={safeParseGenres(item.genres)}
                avgRating={item.avgRating}
                ratingCount={item.ratingCount}
                weightedRating={item.weightedRating}
              />
            ))}
          </div>
        ) : (
          <div className="agency-card p-8 text-center bg-[#1A1825] border border-[#2E2B40] space-y-2">
            <p className="text-sm font-extrabold text-[#FFFFFE] font-display">No rated movies yet</p>
            <p className="text-xs text-[#94A1B2] font-serif-accent italic">Be the first to rate a movie!</p>
          </div>
        )}
      </section>

      {/* SHOWS PEOPLE ACTUALLY FINISHED GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-[#2E2B40] pb-4">
          <div>
            <span className="agency-badge text-xs font-bold uppercase">[ SHOWS PEOPLE ACTUALLY FINISHED ]</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFE] font-display mt-1">Top Rated Shows</h2>
          </div>
          <Link
            href="/browse?type=series"
            className="text-xs font-bold text-[#4ECDC4] hover:text-[#FF6B6B] flex items-center gap-1 font-display transition-colors"
          >
            <span>View All Shows</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topSeries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {topSeries.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                externalId={item.externalId}
                type={item.type as any}
                title={item.title}
                coverUrl={item.coverUrl}
                releaseYear={item.releaseYear}
                genres={safeParseGenres(item.genres)}
                avgRating={item.avgRating}
                ratingCount={item.ratingCount}
                weightedRating={item.weightedRating}
              />
            ))}
          </div>
        ) : (
          <div className="agency-card p-8 text-center bg-[#1A1825] border border-[#2E2B40] space-y-2">
            <p className="text-sm font-extrabold text-[#FFFFFE] font-display">No rated shows yet</p>
            <p className="text-xs text-[#94A1B2] font-serif-accent italic">Be the first to rate a TV show!</p>
          </div>
        )}
      </section>

      {/* TOP GAMES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-[#2E2B40] pb-4">
          <div>
            <span className="agency-badge text-xs font-bold uppercase">[ TOP RATED GAMES ]</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFE] font-display mt-1">Top Rated Games</h2>
          </div>
          <Link
            href="/browse?type=game"
            className="text-xs font-bold text-[#4ECDC4] hover:text-[#FF6B6B] flex items-center gap-1 font-display transition-colors"
          >
            <span>View All Games</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {topGames.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                externalId={item.externalId}
                type={item.type as any}
                title={item.title}
                coverUrl={item.coverUrl}
                releaseYear={item.releaseYear}
                genres={safeParseGenres(item.genres)}
                avgRating={item.avgRating}
                ratingCount={item.ratingCount}
                weightedRating={item.weightedRating}
              />
            ))}
          </div>
        ) : (
          <div className="agency-card p-8 text-center bg-[#1A1825] border border-[#2E2B40] space-y-2">
            <p className="text-sm font-extrabold text-[#FFFFFE] font-display">No rated games yet</p>
            <p className="text-xs text-[#94A1B2] font-serif-accent italic">Be the first to rate a game!</p>
          </div>
        )}
      </section>

      {/* LEADERBOARD PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="agency-card p-10 space-y-8 bg-[#1A1825] border border-[#2E2B40]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2B40] pb-6">
            <div>
              <span className="agency-badge text-xs font-bold uppercase">[ WHO'S WINNING ]</span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#FFFFFE] font-display mt-1">
                The people with too much free time
              </h3>
            </div>
            <Link
              href="/leaderboards"
              className="agency-btn-secondary px-6 py-2.5 text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Full Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#4ECDC4]" />
            </Link>
          </div>

          {topUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topUsers.map((u, i) => (
                <div
                  key={u.id}
                  className="flex items-center gap-4 p-5 bg-[#0F0E17] border border-[#2E2B40] hover:border-[#FF6B6B] transition-colors"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center font-extrabold text-base font-display ${
                      i === 0
                        ? 'bg-[#FFD93D] text-[#0F0E17]'
                        : i === 1
                        ? 'bg-[#4ECDC4] text-[#0F0E17]'
                        : 'bg-[#FF6B6B] text-[#FFFFFE]'
                    }`}
                  >
                    0{i + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-extrabold text-[#FFFFFE] text-base font-display">{u.displayName}</h4>
                    <p className="text-xs text-[#94A1B2] font-serif-accent italic">
                      {u.moviesLoggedCount + u.seriesLoggedCount + u.gamesLoggedCount} Media Logged
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#FF6B6B] text-lg font-display">{u.totalScore}</span>
                    <span className="text-[10px] text-[#94A1B2] font-bold block uppercase">XP</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#94A1B2] font-serif-accent italic bg-[#0F0E17] border border-[#2E2B40]">
              No active users on the leaderboard yet. Sign up and start logging!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
