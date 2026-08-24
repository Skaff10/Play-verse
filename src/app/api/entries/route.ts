import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { upsertUserEntry, deleteUserEntry } from '@/lib/scoring';
import { getOrCreateCatalogItem, formatTMDBPosterUrl } from '@/lib/catalog';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type');
  const status = searchParams.get('status');

  const currentUser = await getCurrentUser();
  const targetUserId = userId || currentUser?.id;

  if (!targetUserId) {
    return NextResponse.json({ entries: [] });
  }

  try {
    const entries = await prisma.userEntry.findMany({
      where: {
        userId: targetUserId,
        ...(type && type !== 'all' ? { type } : {}),
        ...(status && status !== 'all' ? { status } : {}),
      },
      include: {
        catalogItem: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const sanitizedEntries = entries.map((e) => ({
      ...e,
      catalogItem: {
        ...e.catalogItem,
        coverUrl: formatTMDBPosterUrl(e.catalogItem.coverUrl),
      },
    }));

    return NextResponse.json({ entries: sanitizedEntries });
  } catch (error) {
    console.error('Fetch entries error:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { item, status, userRating, review, isReplay } = body;

    if (!item || !status) {
      return NextResponse.json(
        { error: 'Missing required item or status fields' },
        { status: 400 }
      );
    }

    // 1. Ensure CatalogItem is stored in database
    const catalogItem = await getOrCreateCatalogItem(item);

    // 2. Perform score calculation, audit transaction, & Bayesian rating update
    const { entry, pointsEarned } = await upsertUserEntry({
      userId: user.id,
      catalogItemId: catalogItem.id,
      status,
      userRating: userRating !== undefined ? Number(userRating) : undefined,
      review: review !== undefined ? String(review) : undefined,
      isReplay: Boolean(isReplay),
    });

    return NextResponse.json({
      success: true,
      entry,
      pointsEarned,
      message: pointsEarned > 0 ? `+${pointsEarned} XP Earned!` : 'Entry updated',
    });
  } catch (error: any) {
    console.error('Upsert entry error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save entry' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const catalogItemId = searchParams.get('catalogItemId');
    const externalId = searchParams.get('externalId');

    if (!id && !catalogItemId && !externalId) {
      return NextResponse.json(
        { error: 'Missing required id, catalogItemId, or externalId parameter' },
        { status: 400 }
      );
    }

    await deleteUserEntry({
      userId: user.id,
      entryId: id || undefined,
      catalogItemId: catalogItemId || undefined,
      externalId: externalId || undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Entry deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete entry error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete entry' },
      { status: 400 }
    );
  }
}
