import { prisma } from './prisma';

export interface CatalogSearchItem {
  externalId: string;
  type: 'movie' | 'series' | 'game';
  title: string;
  coverUrl: string;
  backdropUrl?: string;
  releaseYear: number;
  genres: string[];
}

export function safeParseGenres(genres: any): string[] {
  if (!genres) return [];
  if (Array.isArray(genres)) return genres;
  if (typeof genres === 'string') {
    try {
      const parsed = JSON.parse(genres);
      if (Array.isArray(parsed)) return parsed;
      return [genres];
    } catch {
      return genres.split(',').map((g) => g.trim()).filter(Boolean);
    }
  }
  return [];
}

export function formatTMDBPosterUrl(posterPath: string | null | undefined): string {
  if (!posterPath) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';
  if (posterPath.includes('8Vt6mAwTZWMGGKGfFsvMAtug5WC')) {
    return 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500';
  }
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
}

/**
 * Fetch trending movies/series from TMDB
 */
async function fetchTMDBTrending(type: 'movie' | 'tv'): Promise<CatalogSearchItem[]> {
  const tmdbKey = process.env.TMDB_API_KEY;
  if (!tmdbKey) return [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/${type}/week?api_key=${tmdbKey}`,
      { next: { revalidate: 3600 } } // cache for 1 hour
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.results || []).slice(0, 12).map((item: any) => ({
      externalId: `tmdb-${item.id}`,
      type: type === 'tv' ? 'series' : 'movie',
      title: item.title || item.name || 'Untitled',
      coverUrl: formatTMDBPosterUrl(item.poster_path),
      backdropUrl: item.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
        : undefined,
      releaseYear: parseInt(
        (item.release_date || item.first_air_date || '2024').substring(0, 4),
        10
      ),
      genres: (item.genre_ids || []).length > 0 ? ['Popular'] : ['Popular'],
    })) as CatalogSearchItem[];
  } catch (e) {
    console.warn('TMDB trending fetch error:', e);
    return [];
  }
}

/**
 * Fetch popular games from RAWG
 */
async function fetchRAWGPopular(): Promise<CatalogSearchItem[]> {
  const rawgKey = process.env.RAWG_API_KEY;
  if (!rawgKey) return [];

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${rawgKey}&ordering=-rating&page_size=12`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.results || []).map((game: any) => ({
      externalId: `rawg-${game.id}`,
      type: 'game' as const,
      title: game.name || 'Untitled',
      coverUrl: game.background_image || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      releaseYear: game.released ? parseInt(game.released.substring(0, 4), 10) : 2024,
      genres: (game.genres || []).slice(0, 3).map((g: any) => g.name),
    })) as CatalogSearchItem[];
  } catch (e) {
    console.warn('RAWG popular fetch error:', e);
    return [];
  }
}

/**
 * Search RAWG API for games
 */
async function searchRAWG(query: string): Promise<CatalogSearchItem[]> {
  const rawgKey = process.env.RAWG_API_KEY;
  if (!rawgKey) return [];

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${rawgKey}&search=${encodeURIComponent(query)}&page_size=10`
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.results || []).map((game: any) => ({
      externalId: `rawg-${game.id}`,
      type: 'game' as const,
      title: game.name || 'Untitled',
      coverUrl: game.background_image || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      releaseYear: game.released ? parseInt(game.released.substring(0, 4), 10) : 2024,
      genres: (game.genres || []).slice(0, 3).map((g: any) => g.name),
    })) as CatalogSearchItem[];
  } catch (e) {
    console.warn('RAWG search error:', e);
    return [];
  }
}

/**
 * Search local catalog database or query external API if available
 */
export async function searchCatalog(query: string, typeFilter?: string): Promise<CatalogSearchItem[]> {
  if (!query || query.trim().length === 0) {
    // Return trending/popular items from live APIs when query is empty
    const results: CatalogSearchItem[] = [];

    if (!typeFilter || typeFilter === 'all' || typeFilter === 'movie') {
      const trendingMovies = await fetchTMDBTrending('movie');
      results.push(...trendingMovies);
    }

    if (!typeFilter || typeFilter === 'all' || typeFilter === 'series') {
      const trendingSeries = await fetchTMDBTrending('tv');
      results.push(...trendingSeries);
    }

    if (!typeFilter || typeFilter === 'all' || typeFilter === 'game') {
      const popularGames = await fetchRAWGPopular();
      results.push(...popularGames);
    }

    // If APIs returned nothing, fall back to DB catalog
    if (results.length === 0) {
      const items = await prisma.catalogItem.findMany({
        where: typeFilter && typeFilter !== 'all' ? { type: typeFilter } : {},
        orderBy: { weightedRating: 'desc' },
        take: 24,
      });

      return items.map((item) => ({
        externalId: item.externalId,
        type: item.type as 'movie' | 'series' | 'game',
        title: item.title,
        coverUrl: formatTMDBPosterUrl(item.coverUrl),
        backdropUrl: item.backdropUrl || undefined,
        releaseYear: item.releaseYear,
        genres: safeParseGenres(item.genres),
      }));
    }

    return results;
  }

  const results: CatalogSearchItem[] = [];

  // Search TMDB for movies/series
  const tmdbKey = process.env.TMDB_API_KEY;
  if (tmdbKey && (!typeFilter || typeFilter === 'movie' || typeFilter === 'series' || typeFilter === 'all')) {
    try {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(query)}&page=1`
      );
      if (tmdbRes.ok) {
        const data = await tmdbRes.json();
        for (const item of data.results || []) {
          if (item.media_type === 'movie' || item.media_type === 'tv') {
            const mediaType = item.media_type === 'tv' ? 'series' : 'movie';

            // Apply type filter
            if (typeFilter && typeFilter !== 'all' && typeFilter !== mediaType) continue;

            const externalId = `tmdb-${item.id}`;

            if (!results.some((r) => r.externalId === externalId)) {
              results.push({
                externalId,
                type: mediaType,
                title: item.title || item.name || 'Untitled',
                coverUrl: formatTMDBPosterUrl(item.poster_path),
                backdropUrl: item.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
                  : undefined,
                releaseYear: parseInt(
                  (item.release_date || item.first_air_date || '2024').substring(0, 4),
                  10
                ),
                genres: ['Popular'],
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('TMDB API fetch error fallback:', e);
    }
  }

  // Search RAWG for games
  if (!typeFilter || typeFilter === 'game' || typeFilter === 'all') {
    const rawgResults = await searchRAWG(query);
    for (const game of rawgResults) {
      if (!results.some((r) => r.externalId === game.externalId)) {
        results.push(game);
      }
    }
  }

  // Also check local DB for any cached items that match
  const cleanQuery = query.toLowerCase().trim();
  const dbItems = await prisma.catalogItem.findMany({
    where: {
      title: { contains: cleanQuery },
      ...(typeFilter && typeFilter !== 'all' ? { type: typeFilter } : {}),
    },
    take: 10,
  });

  for (const item of dbItems) {
    if (!results.some((r) => r.externalId === item.externalId)) {
      results.push({
        externalId: item.externalId,
        type: item.type as 'movie' | 'series' | 'game',
        title: item.title,
        coverUrl: formatTMDBPosterUrl(item.coverUrl),
        backdropUrl: item.backdropUrl || undefined,
        releaseYear: item.releaseYear,
        genres: safeParseGenres(item.genres),
      });
    }
  }

  return results;
}

/**
 * Ensure item exists in DB catalog, or create it from search metadata
 */
export async function getOrCreateCatalogItem(item: CatalogSearchItem) {
  const existing = await prisma.catalogItem.findUnique({
    where: {
      type_externalId: {
        type: item.type,
        externalId: item.externalId,
      },
    },
  });

  if (existing) return existing;

  return await prisma.catalogItem.create({
    data: {
      type: item.type,
      externalId: item.externalId,
      title: item.title,
      coverUrl: formatTMDBPosterUrl(item.coverUrl),
      backdropUrl: item.backdropUrl || null,
      releaseYear: item.releaseYear,
      genres: JSON.stringify(item.genres),
      avgRating: 0,
      ratingCount: 0,
      weightedRating: 0,
    },
  });
}
