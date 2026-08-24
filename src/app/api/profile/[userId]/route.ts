import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        totalScore: true,
        joinedAt: true,
        moviesLoggedCount: true,
        seriesLoggedCount: true,
        gamesLoggedCount: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate user global rank
    const usersAhead = await prisma.user.count({
      where: { totalScore: { gt: user.totalScore } },
    });
    const rank = usersAhead + 1;

    // Fetch user recent entries
    const entries = await prisma.userEntry.findMany({
      where: { userId },
      include: {
        catalogItem: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    // Fetch user recent score events (audit ledger)
    const scoreEvents = await prisma.scoreEvent.findMany({
      where: { userId },
      include: {
        entry: {
          include: {
            catalogItem: {
              select: { title: true, type: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    return NextResponse.json({
      user: {
        ...user,
        rank,
      },
      entries,
      scoreEvents,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
