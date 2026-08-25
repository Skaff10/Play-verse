import { prisma } from './prisma';

export const MIN_REVIEW_LENGTH = 40;
export const MAX_REPLAY_POINTS_PER_ENTRY = 5;
export const RATE_LIMIT_MAX_ENTRIES_PER_HOUR = 20;
export const BAYESIAN_M_THRESHOLD = 3; // minimum ratings threshold for Bayesian formula

/**
 * Recalculate Bayesian Weighted Average for a catalog item
 */
export async function recalculateWeightedRating(catalogItemId: string, itemType: string) {
  // Find all non-null user ratings for this catalog item
  const ratings = await prisma.userEntry.findMany({
    where: {
      catalogItemId,
      userRating: { not: null },
    },
    select: { userRating: true },
  });

  const v = ratings.length;
  if (v === 0) {
    await prisma.catalogItem.update({
      where: { id: catalogItemId },
      data: { avgRating: 0, ratingCount: 0, weightedRating: 0 },
    });
    return;
  }

  const sumRatings = ratings.reduce((acc, curr) => acc + (curr.userRating || 0), 0);
  const R = sumRatings / v;

  // Calculate global average rating C for all items of this type
  const globalRatings = await prisma.userEntry.findMany({
    where: {
      type: itemType,
      userRating: { not: null },
    },
    select: { userRating: true },
  });

  const globalSum = globalRatings.reduce((acc, curr) => acc + (curr.userRating || 0), 0);
  const globalCount = globalRatings.length;
  const C = globalCount > 0 ? globalSum / globalCount : 7.0; // fallback to 7.0 if no ratings exist

  const m = BAYESIAN_M_THRESHOLD;
  const weighted = (v / (v + m)) * R + (m / (v + m)) * C;

  await prisma.catalogItem.update({
    where: { id: catalogItemId },
    data: {
      avgRating: Math.round(R * 10) / 10,
      ratingCount: v,
      weightedRating: Math.round(weighted * 100) / 100,
    },
  });
}

/**
 * Check rate limit for creating new entries
 */
export async function checkEntryRateLimit(userId: string): Promise<boolean> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const rateLimit = await prisma.rateLimit.findUnique({
    where: { userId_actionType: { userId, actionType: 'add_entry' } },
  });

  if (!rateLimit) {
    await prisma.rateLimit.create({
      data: {
        userId,
        actionType: 'add_entry',
        count: 1,
        windowStart: now,
      },
    });
    return true;
  }

  if (rateLimit.windowStart < oneHourAgo) {
    // Reset window
    await prisma.rateLimit.update({
      where: { id: rateLimit.id },
      data: { count: 1, windowStart: now },
    });
    return true;
  }

  if (rateLimit.count >= RATE_LIMIT_MAX_ENTRIES_PER_HOUR) {
    return false;
  }

  await prisma.rateLimit.update({
    where: { id: rateLimit.id },
    data: { count: { increment: 1 } },
  });

  return true;
}

/**
 * Core Entry Upsert Handler with ACID Transaction & Append-Only Score Ledger
 */
export async function upsertUserEntry({
  userId,
  catalogItemId,
  status,
  userRating,
  review,
  isReplay = false,
}: {
  userId: string;
  catalogItemId: string;
  status: 'in_progress' | 'completed' | 'dropped' | 'wishlist';
  userRating?: number | null;
  review?: string | null;
  isReplay?: boolean;
}) {
  // Fetch item details
  const catalogItem = await prisma.catalogItem.findUnique({
    where: { id: catalogItemId },
  });
  if (!catalogItem) throw new Error('Catalog item not found');

  const existingEntry = await prisma.userEntry.findUnique({
    where: {
      userId_catalogItemId: { userId, catalogItemId },
    },
    include: {
      scoreEvents: true,
    },
  });

  if (!existingEntry) {
    // Check rate limit before creation
    const allowed = await checkEntryRateLimit(userId);
    if (!allowed) {
      throw new Error(`Rate limit exceeded: Max ${RATE_LIMIT_MAX_ENTRIES_PER_HOUR} new entries per hour.`);
    }
  }

  let totalNewPoints = 0;
  const eventsToCreate: { type: string; points: number }[] = [];

  if (!existingEntry) {
    // Scenario 1: Brand new entry
    if (status === 'wishlist') {
      // Wishlist entries earn 0 XP
    } else {
      const entryPoints = status === 'completed' ? 5 : 2;
      eventsToCreate.push({
        type: 'add_entry',
        points: entryPoints,
      });
      totalNewPoints += entryPoints;

      // Rating points (+2)
      if (userRating !== undefined && userRating !== null && userRating >= 0 && userRating <= 10) {
        eventsToCreate.push({ type: 'rating', points: 2 });
        totalNewPoints += 2;
      }

      // Review points (+2)
      if (review && review.trim().length >= MIN_REVIEW_LENGTH) {
        eventsToCreate.push({ type: 'review', points: 2 });
        totalNewPoints += 2;
      }
    }
  } else {
    // Scenario 2: Existing entry update
    // Check for status transition: in_progress -> completed (+3 points)
    if (existingEntry.status === 'in_progress' && status === 'completed') {
      const alreadyAwardedCompletion = existingEntry.scoreEvents.some(
        (e) => e.type === 'mark_completed'
      );
      if (!alreadyAwardedCompletion) {
        eventsToCreate.push({ type: 'mark_completed', points: 3 });
        totalNewPoints += 3;
      }
    }

    // Check for status transition: wishlist -> completed (+5 points) or wishlist -> in_progress (+2 points)
    if (existingEntry.status === 'wishlist' && status !== 'wishlist') {
      const alreadyAwarded = existingEntry.scoreEvents.some((e) => e.type === 'add_entry');
      if (!alreadyAwarded) {
        const entryPoints = status === 'completed' ? 5 : 2;
        eventsToCreate.push({ type: 'add_entry', points: entryPoints });
        totalNewPoints += entryPoints;
      }
    }

    // Rating points (+2) - check if user already earned rating points on this entry
    const alreadyRated = existingEntry.scoreEvents.some((e) => e.type === 'rating');
    if (!alreadyRated && userRating !== undefined && userRating !== null && userRating >= 0 && userRating <= 10) {
      eventsToCreate.push({ type: 'rating', points: 2 });
      totalNewPoints += 2;
    }

    // Review points (+2) - check if user already earned review points
    const alreadyReviewed = existingEntry.scoreEvents.some((e) => e.type === 'review');
    if (!alreadyReviewed && review && review.trim().length >= MIN_REVIEW_LENGTH) {
      eventsToCreate.push({ type: 'review', points: 2 });
      totalNewPoints += 2;
    }

    // Replay / Rewatch (+1 point with diminishing returns cap)
    if (isReplay) {
      const replayEventsCount = existingEntry.scoreEvents.filter(
        (e) => e.type === 'replay'
      ).length;
      if (replayEventsCount < MAX_REPLAY_POINTS_PER_ENTRY) {
        eventsToCreate.push({ type: 'replay', points: 1 });
        totalNewPoints += 1;
      }
    }
  }

  // Execute database transaction
  const result = await prisma.$transaction(async (tx) => {
    let entry;
    if (!existingEntry) {
      entry = await tx.userEntry.create({
        data: {
          userId,
          catalogItemId,
          type: catalogItem.type,
          status,
          userRating: userRating ?? null,
          review: review?.trim() || null,
          pointsAwarded: totalNewPoints,
          timesCompleted: status === 'completed' ? 1 : 0,
        },
      });

      // Update user category counts (wishlist items don't count as logged)
      const countField =
        catalogItem.type === 'movie'
          ? 'moviesLoggedCount'
          : catalogItem.type === 'series'
          ? 'seriesLoggedCount'
          : 'gamesLoggedCount';

      await tx.user.update({
        where: { id: userId },
        data: {
          totalScore: { increment: totalNewPoints },
          ...(status !== 'wishlist' ? { [countField]: { increment: 1 } } : {}),
        },
      });
    } else {
      const newTimesCompleted = isReplay
        ? existingEntry.timesCompleted + 1
        : status === 'completed' && existingEntry.status !== 'completed' && existingEntry.timesCompleted === 0
        ? 1
        : existingEntry.timesCompleted;

      entry = await tx.userEntry.update({
        where: { id: existingEntry.id },
        data: {
          status,
          userRating: userRating !== undefined ? userRating : existingEntry.userRating,
          review: review !== undefined ? review?.trim() : existingEntry.review,
          timesCompleted: newTimesCompleted,
          pointsAwarded: { increment: totalNewPoints },
        },
      });

      if (totalNewPoints > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            totalScore: { increment: totalNewPoints },
          },
        });
      }
    }

    // Write score events to append-only ledger
    for (const evt of eventsToCreate) {
      await tx.scoreEvent.create({
        data: {
          userId,
          entryId: entry.id,
          type: evt.type,
          points: evt.points,
        },
      });
    }

    return { entry, pointsEarned: totalNewPoints };
  });

  // Recalculate Bayesian rating for the catalog item
  await recalculateWeightedRating(catalogItemId, catalogItem.type);

  return result;
}

/**
 * Delete a user entry and adjust user scores, counts, & catalog weighted ratings
 */
export async function deleteUserEntry({
  userId,
  entryId,
  catalogItemId,
  externalId,
}: {
  userId: string;
  entryId?: string;
  catalogItemId?: string;
  externalId?: string;
}) {
  const possibleExternalId = externalId || catalogItemId;

  const entry = await prisma.userEntry.findFirst({
    where: {
      userId,
      ...(entryId ? { id: entryId } : {}),
      ...(entryId
        ? {}
        : {
            OR: [
              ...(catalogItemId ? [{ catalogItemId }] : []),
              ...(possibleExternalId ? [{ catalogItem: { externalId: possibleExternalId } }] : []),
            ],
          }),
    },
    include: {
      catalogItem: true,
    },
  });

  if (!entry) {
    throw new Error('Entry not found or unauthorized');
  }

  const pointsAwarded = entry.pointsAwarded;
  const itemType = entry.type;
  const status = entry.status;
  const targetCatalogItemId = entry.catalogItemId;

  await prisma.$transaction(async (tx) => {
    // Delete entry (Cascades to scoreEvents due to schema onDelete: Cascade)
    await tx.userEntry.delete({
      where: { id: entry.id },
    });

    // Determine category count field to update
    const countField =
      itemType === 'movie'
        ? 'moviesLoggedCount'
        : itemType === 'series'
        ? 'seriesLoggedCount'
        : 'gamesLoggedCount';

    const currentUser = await tx.user.findUnique({
      where: { id: userId },
      select: { totalScore: true, moviesLoggedCount: true, seriesLoggedCount: true, gamesLoggedCount: true },
    });

    if (currentUser) {
      const currentCount = (currentUser as any)[countField] || 0;
      const newScore = Math.max(0, currentUser.totalScore - pointsAwarded);
      const newCount = status !== 'wishlist' ? Math.max(0, currentCount - 1) : currentCount;

      await tx.user.update({
        where: { id: userId },
        data: {
          totalScore: newScore,
          [countField]: newCount,
        },
      });
    }
  });

  // Recalculate Bayesian weighted rating for the catalog item
  await recalculateWeightedRating(targetCatalogItemId, itemType);

  return { success: true };
}
