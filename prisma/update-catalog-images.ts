import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UPDATED_IMAGES: Record<string, { coverUrl: string; backdropUrl?: string }> = {
  'm-1': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fKSuVftTe.jpg',
  },
  'm-2': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/oYuLEydvwzK8xzFeSSsTJHQZ1o4.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAiol.jpg',
  },
  'm-3': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mAwTZWMGGKGfFsvMAtug5WC.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4nMeeF84fVZnsy5P6z2Su3ZaC2w.jpg',
  },
  'm-4': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/1pdfLPoL6VfqcxyPhYseofio7h.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOM08GoqBfiMSt2wKh2oToGlA2o.jpg',
  },
  'm-5': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGvC2z1n6fU.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6K8OiXeNVFsW222SJPyKGXe2w.jpg',
  },
  's-1': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/abL16VHD3zYSu3hTeKRBd3yZvA0.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/uDGyHFszRdpabmviA2mWyFi09jU.jpg',
  },
  's-2': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/tsRy63MuZvMuGQyUYabhlzFv4v2.jpg',
  },
  's-3': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/4n4W67Z7s9nKz7n0bO88yv9e2yS.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/z9P5qO4mGqJ2vY5e8t2q4A8K9.jpg',
  },
  's-4': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/uDGyHFszRdpabmviA2mWyFi09jU.jpg',
  },
  's-5': {
    coverUrl: 'https://image.tmdb.org/t/p/w500/7O4iVf26YScHaPfPvdT2hOi2A2y.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/j55E9Fz9C36fT37Fq.jpg',
  },
  'g-1': {
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4nij.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc73e7.jpg',
  },
  'g-2': {
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc6gxs.jpg',
  },
  'g-3': {
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc73ds.jpg',
  },
  'g-4': {
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc688f.jpg',
  },
  'g-5': {
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg',
    backdropUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc8vhg.jpg',
  },
};

async function main() {
  console.log('🖼️ Updating Catalog Item Image URLs...');
  let updatedCount = 0;

  for (const [extId, data] of Object.entries(UPDATED_IMAGES)) {
    const result = await prisma.catalogItem.updateMany({
      where: { externalId: extId },
      data: {
        coverUrl: data.coverUrl,
        ...(data.backdropUrl ? { backdropUrl: data.backdropUrl } : {}),
      },
    });
    updatedCount += result.count;
  }

  console.log(`✅ Successfully updated images for ${updatedCount} items!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
