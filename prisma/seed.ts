import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_CATALOG = [
  // MOVIES
  {
    type: 'movie',
    externalId: 'm-1',
    title: 'Interstellar',
    coverUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fKSuVftTe.jpg',
    releaseYear: 2014,
    genres: JSON.stringify(['Sci-Fi', 'Drama', 'Adventure']),
  },
  {
    type: 'movie',
    externalId: 'm-2',
    title: 'Inception',
    coverUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280',
    releaseYear: 2010,
    genres: JSON.stringify(['Sci-Fi', 'Action', 'Mystery']),
  },
  {
    type: 'movie',
    externalId: 'm-3',
    title: 'Spider-Man: Across the Spider-Verse',
    coverUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1280',
    releaseYear: 2023,
    genres: JSON.stringify(['Animation', 'Action', 'Sci-Fi']),
  },
  {
    type: 'movie',
    externalId: 'm-4',
    title: 'Dune: Part Two',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1280',
    releaseYear: 2024,
    genres: JSON.stringify(['Sci-Fi', 'Adventure', 'Drama']),
  },
  {
    type: 'movie',
    externalId: 'm-5',
    title: 'Oppenheimer',
    coverUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1280',
    releaseYear: 2023,
    genres: JSON.stringify(['Biography', 'Drama', 'History']),
  },

  // TV SERIES
  {
    type: 'series',
    externalId: 's-1',
    title: 'Arcane',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1280',
    releaseYear: 2021,
    genres: JSON.stringify(['Animation', 'Action', 'Sci-Fi']),
  },
  {
    type: 'series',
    externalId: 's-2',
    title: 'Breaking Bad',
    coverUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/tsRy63MuZvMuGQyUYabhlzFv4v2.jpg',
    releaseYear: 2008,
    genres: JSON.stringify(['Crime', 'Drama', 'Thriller']),
  },
  {
    type: 'series',
    externalId: 's-3',
    title: 'Severance',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280',
    releaseYear: 2022,
    genres: JSON.stringify(['Sci-Fi', 'Thriller', 'Mystery']),
  },
  {
    type: 'series',
    externalId: 's-4',
    title: 'The Last of Us',
    coverUrl: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/uDGyHFszRdpabmviA2mWyFi09jU.jpg',
    releaseYear: 2023,
    genres: JSON.stringify(['Action', 'Adventure', 'Drama']),
  },
  {
    type: 'series',
    externalId: 's-5',
    title: 'Shogun',
    coverUrl: 'https://images.unsplash.com/photo-1528164344705-47542687990d?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1528164344705-47542687990d?w=1280',
    releaseYear: 2024,
    genres: JSON.stringify(['Drama', 'History', 'War']),
  },

  // GAMES
  {
    type: 'game',
    externalId: 'g-1',
    title: 'Elden Ring',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4nij.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc73e7.jpg',
    releaseYear: 2022,
    genres: JSON.stringify(['Action RPG', 'Open World', 'Fantasy']),
  },
  {
    type: 'game',
    externalId: 'g-2',
    title: 'Baldur\'s Gate 3',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc6gxs.jpg',
    releaseYear: 2023,
    genres: JSON.stringify(['RPG', 'Turn-Based', 'Strategy']),
  },
  {
    type: 'game',
    externalId: 'g-3',
    title: 'Cyberpunk 2077',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc73ds.jpg',
    releaseYear: 2020,
    genres: JSON.stringify(['Action RPG', 'Cyberpunk', 'Sci-Fi']),
  },
  {
    type: 'game',
    externalId: 'g-4',
    title: 'The Witcher 3: Wild Hunt',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc688f.jpg',
    releaseYear: 2015,
    genres: JSON.stringify(['RPG', 'Open World', 'Fantasy']),
  },
  {
    type: 'game',
    externalId: 'g-5',
    title: 'God of War Ragnarök',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc8vhg.jpg',
    releaseYear: 2022,
    genres: JSON.stringify(['Action', 'Adventure', 'Mythology']),
  },
];

async function main() {
  console.log('🌱 Seeding Play-verse Catalog Items...');

  // Create Catalog Items
  const items = [];
  for (const c of SEED_CATALOG) {
    const item = await prisma.catalogItem.upsert({
      where: {
        type_externalId: { type: c.type, externalId: c.externalId },
      },
      update: {
        coverUrl: c.coverUrl,
        backdropUrl: c.backdropUrl,
      },
      create: {
        type: c.type,
        externalId: c.externalId,
        title: c.title,
        coverUrl: c.coverUrl,
        backdropUrl: c.backdropUrl,
        releaseYear: c.releaseYear,
        genres: c.genres,
        avgRating: 0,
        ratingCount: 0,
        weightedRating: 0,
      },
    });
    items.push(item);
  }
  console.log(`✅ Created/Updated ${items.length} Seed Catalog Items`);
  console.log('🚀 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

