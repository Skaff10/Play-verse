import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { safeParseGenres } from '@/lib/catalog';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const currentUser = await getCurrentUser();

  try {
    // 1. Find item by id or externalId
    let item = await prisma.catalogItem.findFirst({
      where: {
        type,
        OR: [{ id }, { externalId: id }],
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // 2. Fetch all user entries for this item with user details & reviews
    const entries = await prisma.userEntry.findMany({
      where: { catalogItemId: item.id },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            totalScore: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // 3. Separate current user's entry if signed in
    const currentUserEntry = currentUser
      ? entries.find((e) => e.userId === currentUser.id) || null
      : null;

    // 4. Extract written reviews (non-empty reviews)
    const reviews = entries
      .filter((e) => e.review && e.review.trim().length > 0)
      .map((e) => ({
        id: e.id,
        user: e.user,
        rating: e.userRating,
        review: e.review,
        status: e.status,
        loggedAt: e.loggedAt,
      }));

    // 5. Rating breakdown distribution (1 to 10)
    const ratingDistribution: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
    };

    entries.forEach((e) => {
      if (e.userRating) {
        const rounded = Math.round(e.userRating);
        if (ratingDistribution[rounded] !== undefined) {
          ratingDistribution[rounded]++;
        }
      }
    });

    return NextResponse.json({
      item: {
        ...item,
        genres: safeParseGenres(item.genres),
      },
      entriesCount: entries.length,
      currentUserEntry,
      reviews,
      ratingDistribution,
      loggedByUsers: entries.map((e) => ({
        user: e.user,
        status: e.status,
        rating: e.userRating,
      })),
    });
  } catch (error) {
    console.error('Item detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch item details' }, { status: 500 });
  }
}
