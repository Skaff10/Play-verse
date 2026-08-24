import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting cleanup of fake demo users...');

  // Identify fake demo users (e.g. @playverse.io or specific names)
  const fakeUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: '@playverse.io' } },
        { displayName: { in: ['Alex Mercer', 'Elena Rostova', 'Marcus Vance', 'Sophia Chen', 'David Kim'] } },
      ],
    },
  });

  console.log(`Found ${fakeUsers.length} fake demo user(s) to delete:`);
  fakeUsers.forEach((u) => console.log(` - ${u.displayName} (${u.email})`));

  const fakeUserIds = fakeUsers.map((u) => u.id);

  if (fakeUserIds.length > 0) {
    // Delete score events, user entries, rate limits associated with fake users
    const deletedEvents = await prisma.scoreEvent.deleteMany({
      where: { userId: { in: fakeUserIds } },
    });
    console.log(`Deleted ${deletedEvents.count} fake score events`);

    const deletedEntries = await prisma.userEntry.deleteMany({
      where: { userId: { in: fakeUserIds } },
    });
    console.log(`Deleted ${deletedEntries.count} fake user entries`);

    const deletedLimits = await prisma.rateLimit.deleteMany({
      where: { userId: { in: fakeUserIds } },
    });
    console.log(`Deleted ${deletedLimits.count} fake rate limit records`);

    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: fakeUserIds } },
    });
    console.log(`Deleted ${deletedUsers.count} fake users`);
  }

  // Recalculate ratings for ALL catalog items based ONLY on remaining real user entries
  console.log('🔄 Recalculating catalog item ratings...');

  const allItems = await prisma.catalogItem.findMany();

  for (const item of allItems) {
    const realRatings = await prisma.userEntry.findMany({
      where: { catalogItemId: item.id, userRating: { not: null } },
      select: { userRating: true },
    });

    const v = realRatings.length;
    if (v === 0) {
      await prisma.catalogItem.update({
        where: { id: item.id },
        data: { avgRating: 0, ratingCount: 0, weightedRating: 0 },
      });
    } else {
      const sum = realRatings.reduce((acc, curr) => acc + (curr.userRating || 0), 0);
      const R = sum / v;
      const m = 3;
      const C = 7.0; // Catalog mean default
      const W = (v / (v + m)) * R + (m / (v + m)) * C;

      await prisma.catalogItem.update({
        where: { id: item.id },
        data: {
          avgRating: Math.round(R * 10) / 10,
          ratingCount: v,
          weightedRating: Math.round(W * 100) / 100,
        },
      });
    }
  }

  console.log('✅ Catalog item ratings updated.');

  // Print remaining users in DB
  const remainingUsers = await prisma.user.findMany();
  console.log('👥 Remaining Real Users in Database:');
  console.log(remainingUsers);

  // Print remaining catalog items with ratings > 0
  const ratedItems = await prisma.catalogItem.findMany({
    where: { ratingCount: { gt: 0 } },
  });
  console.log(`⭐ Catalog Items with Real Ratings (${ratedItems.length}):`);
  console.log(ratedItems.map((i) => ({ title: i.title, type: i.type, avgRating: i.avgRating, ratingCount: i.ratingCount, weightedRating: i.weightedRating })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
