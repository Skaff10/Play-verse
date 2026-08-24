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
      <div className="agency-card p-8 bg-[#1A1825] border border-[#2E2B40] space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0F0E17] border border-[#FF6B6B] text-[#FFFFFE] font-extrabold text-2xl flex items-center justify-center font-display rounded-xs">
              {dbUser.displayName.charAt(0)}
            </div>
            <div>
              <span className="agency-badge text-xs font-bold uppercase">[ USER PROFILE ]</span>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-3xl font-extrabold text-[#FFFFFE] font-display">
                  {dbUser.displayName}
                </h1>
                <span className="bg-[#FF6B6B] text-[#FFFFFE] text-xs font-bold px-3 py-1 font-display">
                  Level {level} Scout
                </span>
              </div>
              <p className="text-xs text-[#94A1B2] font-serif-accent italic mt-1">
                Member since {new Date(dbUser.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* XP & Next Level Gauge */}
          <div className="w-full md:w-80 space-y-2 bg-[#0F0E17] p-4 border border-[#2E2B40]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-extrabold text-[#FF6B6B] text-sm font-display">
                <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
                <span>{totalScore} Total XP</span>
              </div>
              <span className="text-xs font-bold text-[#94A1B2]">
                {currentLevelXP} / {xpForNextLevel} XP
              </span>
            </div>
            <div className="w-full h-3 bg-[#242234] p-0.5 border border-[#2E2B40]">
              <div
                className="h-full bg-[#FF6B6B] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-[#94A1B2] text-right font-serif-accent italic">
              {xpForNextLevel - currentLevelXP} XP remaining to Level {level + 1}
            </p>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#2E2B40]">
          <div className="flex items-center gap-3 border-l-2 border-[#4ECDC4] pl-3">
            <div>
              <p className="text-2xl font-extrabold text-[#FFFFFE] font-display">{dbUser.moviesLoggedCount}</p>
              <p className="text-[10px] text-[#94A1B2] uppercase font-bold tracking-wider">Movies Logged</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-[#FF6B6B] pl-3">
            <div>
              <p className="text-2xl font-extrabold text-[#FFFFFE] font-display">{dbUser.seriesLoggedCount}</p>
              <p className="text-[10px] text-[#94A1B2] uppercase font-bold tracking-wider">TV Series</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-[#FFD93D] pl-3">
            <div>
              <p className="text-2xl font-extrabold text-[#FFFFFE] font-display">{dbUser.gamesLoggedCount}</p>
              <p className="text-[10px] text-[#94A1B2] uppercase font-bold tracking-wider">Games Logged</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-[#6BCB77] pl-3">
            <div>
              <p className="text-2xl font-extrabold text-[#6BCB77] font-display">{completionRate}%</p>
              <p className="text-[10px] text-[#94A1B2] uppercase font-bold tracking-wider">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Recently Logged Media */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2E2B40] pb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF6B6B]" />
              <h2 className="text-xl font-extrabold text-[#FFFFFE] font-display">Recently Logged Titles</h2>
            </div>
            <Link
              href="/library"
              className="text-xs font-bold text-[#4ECDC4] hover:text-[#FF6B6B] transition-colors font-display"
            >
              View Full Library ({totalLogged})
            </Link>
          </div>

          {entries.length === 0 ? (
            <div className="agency-card p-12 text-center space-y-4 bg-[#1A1825] border border-[#2E2B40]">
              <Film className="w-10 h-10 text-[#94A1B2] mx-auto" />
              <h3 className="text-lg font-bold text-[#FFFFFE] font-display">Your library is currently empty</h3>
              <p className="text-xs text-[#94A1B2] font-serif-accent italic max-w-sm mx-auto">
                Search the catalog to start logging your favorite movies, TV series, and games to earn XP!
              </p>
              <Link
                href="/browse"
                className="agency-btn-primary inline-flex items-center gap-2 px-6 py-3 text-xs cursor-pointer"
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
          <div className="flex items-center gap-2 border-b border-[#2E2B40] pb-4">
            <History className="w-5 h-5 text-[#FF6B6B]" />
            <h2 className="text-xl font-extrabold text-[#FFFFFE] font-display">XP Ledger Feed</h2>
          </div>

          <div className="agency-card p-5 bg-[#1A1825] border border-[#2E2B40] space-y-3">
            {scoreEvents.length === 0 ? (
              <p className="text-xs text-[#94A1B2] text-center py-6 font-serif-accent italic">No score events recorded yet</p>
            ) : (
              scoreEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-3.5 bg-[#0F0E17] border border-[#2E2B40]"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#FFFFFE] capitalize font-display">
                      {evt.type.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-[#94A1B2] font-serif-accent italic line-clamp-1">
                      {evt.entry.catalogItem.title}
                    </p>
                  </div>
                  <div className="bg-[#242234] text-[#FF6B6B] px-2.5 py-1 text-xs font-extrabold font-display">
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
