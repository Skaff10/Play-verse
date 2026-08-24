import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { safeParseGenres } from '@/lib/catalog';
import MediaCard from '@/components/MediaCard';
import { Sparkles, Trophy, Film, Tv, Gamepad2, History, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    notFound();
  }

  // Count rank
  const countAhead = await prisma.user.count({
    where: { totalScore: { gt: user.totalScore } },
  });
  const rank = countAhead + 1;

  // Fetch entries
  const entries = await prisma.userEntry.findMany({
    where: { userId },
    include: { catalogItem: true },
    orderBy: { updatedAt: 'desc' },
  });

  // Fetch score audit ledger
  const scoreEvents = await prisma.scoreEvent.findMany({
    where: { userId },
    include: {
      entry: {
        include: { catalogItem: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Profile Header */}
      <div className="agency-card p-8 bg-[#1A1825] border border-[#2E2B40] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0F0E17] border border-[#FF6B6B] text-[#FFFFFE] font-extrabold text-2xl flex items-center justify-center font-display rounded-xs">
              {user.displayName.charAt(0)}
            </div>
            <div>
              <span className="agency-badge text-xs font-bold uppercase">[ PUBLIC PROFILE ]</span>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-3xl font-extrabold text-[#FFFFFE] font-display">{user.displayName}</h1>
                <span className={`text-xs font-extrabold px-3 py-1 font-display flex items-center gap-1 ${
                  rank === 1 ? 'bg-[#FFD93D] text-[#0F0E17]' : 'bg-[#FF6B6B] text-[#FFFFFE]'
                }`}>
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Rank #{rank}</span>
                </span>
              </div>
              <p className="text-xs text-[#94A1B2] font-serif-accent italic mt-1">
                Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="bg-[#0F0E17] border border-[#2E2B40] p-4 text-right">
            <span className="text-2xl font-extrabold text-[#FF6B6B] font-display">{user.totalScore} XP</span>
            <span className="text-[10px] text-[#94A1B2] uppercase font-bold block">Total Audited Points</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#2E2B40] text-center">
          <div className="border-l-2 border-[#4ECDC4] pl-3 text-left">
            <p className="text-2xl font-extrabold text-[#FFFFFE] font-display">{user.moviesLoggedCount}</p>
            <p className="text-[10px] text-[#94A1B2] uppercase font-bold tracking-wider">Movies</p>
          </div>
          <div className="border-l-2 border-[#FF6B6B] pl-3 text-left">
            <p className="text-2xl font-extrabold text-[#FFFFFE] font-display">{user.seriesLoggedCount}</p>
            <p className="text-[10px] text-[#94A1B2] uppercase font-bold tracking-wider">Series</p>
          </div>
          <div className="border-l-2 border-[#FFD93D] pl-3 text-left">
            <p className="text-2xl font-extrabold text-[#FFFFFE] font-display">{user.gamesLoggedCount}</p>
            <p className="text-[10px] text-[#94A1B2] uppercase font-bold tracking-wider">Games</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-extrabold text-[#FFFFFE] border-b border-[#2E2B40] pb-3 font-display">
            Public Library Showcase ({entries.length})
          </h2>
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
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-[#FFFFFE] border-b border-[#2E2B40] pb-3 font-display">
            Recent Score Events
          </h2>
          <div className="agency-card p-5 bg-[#1A1825] border border-[#2E2B40] space-y-3">
            {scoreEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-center justify-between p-3 bg-[#0F0E17] border border-[#2E2B40] text-xs"
              >
                <div>
                  <p className="font-extrabold text-[#FFFFFE] capitalize font-display">{evt.type.replace('_', ' ')}</p>
                  <p className="text-[10px] text-[#94A1B2] font-serif-accent italic">{evt.entry.catalogItem.title}</p>
                </div>
                <span className="font-extrabold text-[#FF6B6B] font-display">+{evt.points} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
