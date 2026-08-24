import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import { safeParseGenres } from '@/lib/catalog';
import {
  Sparkles,
  Trophy,
  Flame,
  Film,
  Tv,
  Gamepad2,
  CheckCircle2,
  Clock,
  PlusCircle,
  History,
  TrendingUp,
} from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // Fetch complete user data
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) redirect('/auth/sign-in');

  // Fetch recent user entries
  const entries = await prisma.userEntry.findMany({
    where: { userId: user.id },
    include: { catalogItem: true },
    orderBy: { updatedAt: 'desc' },
    take: 8,
  });

  // Fetch recent score audit ledger events
  const scoreEvents = await prisma.scoreEvent.findMany({
    where: { userId: user.id },
    include: {
      entry: {
        include: { catalogItem: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  // Calculate user level & XP progress
  const totalScore = dbUser.totalScore;
  const level = Math.floor(totalScore / 40) + 1;
  const currentLevelXP = totalScore % 40;
  const xpForNextLevel = 40;
  const progressPercent = Math.min((currentLevelXP / xpForNextLevel) * 100, 100);

  const totalLogged =
    dbUser.moviesLoggedCount + dbUser.seriesLoggedCount + dbUser.gamesLoggedCount;
  const completedCount = entries.filter((e) => e.status === 'completed').length;
  const completionRate =
    entries.length > 0 ? Math.round((completedCount / entries.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* HEADER STATS CARD */}
      <div className="card-aui p-8 bg-eerie border border-stroke-dark space-y-8 rounded-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-space border border-fire text-mist font-extrabold text-2xl flex items-center justify-center font-display rounded-md shadow-md">
              {dbUser.displayName.charAt(0)}
            </div>
            <div>
              <span className="text-aui-eyebrow">[ USER PROFILE ]</span>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-3xl font-extrabold text-mist font-display">
                  {dbUser.displayName}
                </h1>
                <span className="bg-fire text-mist text-xs font-bold px-3 py-1 font-display rounded-sm">
                  Level {level} Scout
                </span>
              </div>
              <p className="text-xs text-mist/60 font-serif-accent italic mt-1">
                Member since {new Date(dbUser.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* XP & Next Level Gauge */}
          <div className="w-full md:w-80 space-y-2 bg-space p-4 border border-stroke-dark rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-extrabold text-fire text-sm font-display">
                <Sparkles className="w-4 h-4 text-fire" />
                <span>{totalScore} Total XP</span>
              </div>
              <span className="text-xs font-bold text-mist/60">
                {currentLevelXP} / {xpForNextLevel} XP
              </span>
            </div>
            <div className="w-full h-3 bg-eerie p-0.5 border border-stroke-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-fire transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-mist/60 text-right font-serif-accent italic">
              {xpForNextLevel - currentLevelXP} XP remaining to Level {level + 1}
            </p>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-stroke-dark">
          <div className="flex items-center gap-3 border-l-2 border-mist pl-3">
            <div>
              <p className="text-2xl font-extrabold text-mist font-display">{dbUser.moviesLoggedCount}</p>
              <p className="text-[10px] text-mist/60 uppercase font-bold tracking-wider">Movies Logged</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-fire pl-3">
            <div>
              <p className="text-2xl font-extrabold text-mist font-display">{dbUser.seriesLoggedCount}</p>
              <p className="text-[10px] text-mist/60 uppercase font-bold tracking-wider">TV Series</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-mist/40 pl-3">
            <div>
              <p className="text-2xl font-extrabold text-mist font-display">{dbUser.gamesLoggedCount}</p>
              <p className="text-[10px] text-mist/60 uppercase font-bold tracking-wider">Games Logged</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-fire pl-3">
            <div>
              <p className="text-2xl font-extrabold text-fire font-display">{completionRate}%</p>
              <p className="text-[10px] text-mist/60 uppercase font-bold tracking-wider">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Recently Logged Media */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-stroke-dark pb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-fire" />
              <h2 className="text-xl font-extrabold text-mist font-display">Recently Logged Titles</h2>
            </div>
            <Link
              href="/library"
              className="text-xs font-bold text-fire hover:underline transition-colors font-display"
            >
              View Full Library ({totalLogged})
            </Link>
          </div>

          {entries.length === 0 ? (
            <div className="card-aui p-12 text-center space-y-4 bg-eerie border border-stroke-dark rounded-xl">
              <Film className="w-10 h-10 text-mist/40 mx-auto" />
              <h3 className="text-lg font-bold text-mist font-display">Your library is currently empty</h3>
              <p className="text-xs text-mist/60 font-serif-accent italic max-w-sm mx-auto">
                Search the catalog to start logging your favorite movies, TV series, and games to earn XP!
              </p>
              <Link
                href="/browse"
                className="btn-aui-fire inline-flex items-center gap-2 px-6 py-3 text-xs cursor-pointer rounded-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Browse Catalog</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {entries.map((entry) => (
                <MediaCard
                  key={entry.id}
                  id={entry.catalogItem.id}
                  externalId={entry.catalogItem.externalId}
                  type={entry.catalogItem.type as any}
                  title={entry.catalogItem.title}
                  coverUrl={entry.catalogItem.coverUrl}
                  releaseYear={entry.catalogItem.releaseYear}
                  genres={safeParseGenres(entry.catalogItem.genres)}
                  userEntry={{
                    status: entry.status as any,
                    userRating: entry.userRating,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 col): Score Events Audit Log */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-stroke-dark pb-4">
            <History className="w-5 h-5 text-fire" />
            <h2 className="text-xl font-extrabold text-mist font-display">XP Ledger Feed</h2>
          </div>

          <div className="card-aui p-5 bg-eerie border border-stroke-dark space-y-3 rounded-xl">
            {scoreEvents.length === 0 ? (
              <p className="text-xs text-mist/60 text-center py-6 font-serif-accent italic">No score events recorded yet</p>
            ) : (
              scoreEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-3.5 bg-space border border-stroke-dark rounded-md"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-mist capitalize font-display">
                      {evt.type.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-mist/60 font-serif-accent italic line-clamp-1">
                      {evt.entry.catalogItem.title}
                    </p>
                  </div>
                  <div className="bg-fire/15 border border-fire/30 text-fire px-2.5 py-1 text-xs font-extrabold font-display rounded-sm">
                    +{evt.points} XP
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
