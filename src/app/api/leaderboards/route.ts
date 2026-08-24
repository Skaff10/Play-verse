import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { safeParseGenres, formatTMDBPosterUrl } from '@/lib/catalog';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'users'; // "users" | "movie" | "series" | "game"
  const currentUser = await getCurrentUser();

  try {
    if (category === 'users') {
      const users = await prisma.user.findMany({
        orderBy: { totalScore: 'desc' },
        select: {
          id: true,
          displayName: true,
          email: true,
          avatarUrl: true,
          totalScore: true,
          moviesLoggedCount: true,
          seriesLoggedCount: true,
          gamesLoggedCount: true,
          joinedAt: true,
        },
        take: 100,
      });

      const rankedUsers = users.map((u, index) => ({
        rank: index + 1,
        ...u,
      }));

      // Find current user's rank if not in top 100
      let currentUserRankInfo = null;
      if (currentUser) {
        const found = rankedUsers.find((u) => u.id === currentUser.id);
        if (found) {
          currentUserRankInfo = found;
        } else {
          const countAhead = await prisma.user.count({
            where: { totalScore: { gt: currentUser.totalScore } },
          });
          currentUserRankInfo = {
            rank: countAhead + 1,
            ...currentUser,
          };
        }
      }

      return NextResponse.json({
        category,
        items: rankedUsers,
        currentUserRank: currentUserRankInfo,
      });
    } else {
      // Catalog Item Leaderboard (movies, series, games) by Bayesian Weighted Rating
      let items = await prisma.catalogItem.findMany({
        where: {
          type: category,
          ratingCount: { gt: 0 },
        },
        orderBy: [
          { weightedRating: 'desc' },
          { ratingCount: 'desc' },
        ],
        take: 50,
      });


      const rankedItems = items.map((item, index) => ({
        rank: index + 1,
        id: item.id,
        externalId: item.externalId,
        type: item.type,
        title: item.title,
        coverUrl: formatTMDBPosterUrl(item.coverUrl),
        releaseYear: item.releaseYear,
        genres: safeParseGenres(item.genres),
        avgRating: item.avgRating ?? 0,
        ratingCount: item.ratingCount ?? 0,
        weightedRating: item.weightedRating ?? 0,
      }));

      return NextResponse.json({
        category,
        items: rankedItems,
      });
    }
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
