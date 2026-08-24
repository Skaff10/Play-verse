import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { safeParseGenres } from '@/lib/catalog';
import {
  Star,
  Film,
  Tv,
  Gamepad2,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  ChevronLeft,
} from 'lucide-react';
import ItemLoggerWidget from './ItemLoggerWidget';

export const revalidate = 0;

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const currentUser = await getCurrentUser();

  // Find item by ID or externalId
  const item = await prisma.catalogItem.findFirst({
    where: {
      type,
      OR: [{ id }, { externalId: id }],
    },
  });

  if (!item) {
    notFound();
  }

  // Fetch entries for this item
  const entries = await prisma.userEntry.findMany({
    where: { catalogItemId: item.id },
    include: {
      user: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const currentUserEntry = currentUser
    ? entries.find((e) => e.userId === currentUser.id) || null
    : null;

  const reviews = entries.filter((e) => e.review && e.review.trim().length > 0);

  const TypeIcon = item.type === 'movie' ? Film : item.type === 'series' ? Tv : Gamepad2;
  const genresList: string[] = safeParseGenres(item.genres);

  return (
    <div className="space-y-12 pb-20">
      {/* HERO BACKDROP BANNER */}
      <div className="relative w-full h-[380px] sm:h-[460px] bg-space overflow-hidden border-b border-stroke-dark">
        {item.backdropUrl ? (
          <Image
            src={item.backdropUrl}
            alt={item.title}
            fill
            unoptimized
            priority
            className="object-cover opacity-20 blur-sm scale-105"
          />
        ) : (
          <Image
            src={item.coverUrl}
            alt={item.title}
            fill
            unoptimized
            priority
            className="object-cover opacity-15 blur-md"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-space via-space/80 to-transparent" />

        {/* Back Link */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 bg-eerie hover:bg-mist hover:text-space text-mist border border-stroke-dark px-3.5 py-1.5 text-xs font-medium transition-colors rounded-md"
          >
            <ChevronLeft className="w-4 h-4 text-fire" />
            <span>Back to Browse</span>
          </Link>
        </div>

        {/* Poster & Header Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col sm:flex-row items-end gap-6">
          {/* Cover Poster Card */}
          <div className="relative w-36 sm:w-52 aspect-[2/3] overflow-hidden border border-stroke-dark shadow-2xl flex-shrink-0 bg-eerie rounded-xl">
            <Image src={item.coverUrl} alt={item.title} fill unoptimized className="object-cover" />
          </div>

          {/* Details Metadata */}
          <div className="flex-grow space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-fire text-mist px-3 py-0.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-display rounded-xs">
                <TypeIcon className="w-3.5 h-3.5 text-mist" />
                <span>{item.type}</span>
              </span>
              <span className="text-xs text-mist/60 font-serif-accent italic font-bold">{item.releaseYear}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-mist leading-tight font-display">
              {item.title}
            </h1>

            {/* Genre Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {genresList.map((g) => (
                <span
                  key={g}
                  className="badge-aui !py-0.5 !px-2.5 !text-xs"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Bayesian Rating Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-eerie text-mist px-4 py-2 border border-stroke-dark rounded-md">
                <Star className="w-5 h-5 fill-fire text-fire" />
                <div>
                  <span className="text-xl font-extrabold font-display">{(item.weightedRating ?? 0).toFixed(1)}</span>
                  <span className="text-[10px] text-mist/60 font-bold block uppercase -mt-1">
                    Bayesian Score ($W$)
                  </span>
                </div>
              </div>

              <div className="text-xs text-mist/60 font-serif-accent italic space-y-0.5">
                <p>
                  <strong className="text-mist font-sans font-bold">{(item.avgRating ?? 0).toFixed(1)}</strong> / 10 Raw Average
                </p>
                <p>
                  <strong className="text-mist font-sans font-bold">{item.ratingCount ?? 0}</strong> Community Ratings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BODY CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Interactive User Logger Widget & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Logger Widget */}
          <ItemLoggerWidget
            item={{
              externalId: item.externalId,
              type: item.type as any,
              title: item.title,
              coverUrl: item.coverUrl,
              releaseYear: item.releaseYear,
              genres: genresList,
            }}
            existingEntry={
              currentUserEntry
                ? {
                    status: currentUserEntry.status,
                    userRating: currentUserEntry.userRating,
                    review: currentUserEntry.review,
                    timesCompleted: currentUserEntry.timesCompleted,
                  }
                : null
            }
          />

          {/* Community Reviews Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stroke-dark pb-3">
              <MessageSquare className="w-5 h-5 text-fire" />
              <h2 className="text-xl font-extrabold text-mist font-display">
                Community Reviews ({reviews.length})
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="card-aui p-8 text-center text-xs text-mist/60 font-serif-accent italic bg-eerie border border-stroke-dark rounded-xl">
                No reviews written for {item.title} yet. Be the first to write a review (40+ chars) and earn +2 XP!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="card-aui p-5 bg-eerie border border-stroke-dark space-y-3 rounded-xl"
                  >
                    <div className="flex items-center justify-between border-b border-stroke-dark pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-space border border-stroke-dark text-mist font-extrabold flex items-center justify-center text-xs font-display rounded-sm">
                          {rev.user.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-mist font-display">{rev.user.displayName}</p>
                          <p className="text-[10px] text-mist/60 font-serif-accent italic">
                            {new Date(rev.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {rev.userRating && (
                        <div className="flex items-center gap-1 bg-space border border-stroke-dark text-fire font-extrabold px-2.5 py-1 text-xs font-display rounded">
                          <Star className="w-3.5 h-3.5 fill-fire text-fire" />
                          <span>{rev.userRating} / 10</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-mist font-serif-accent italic leading-relaxed">
                      "{rev.review}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Community Logged Showcase */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-stroke-dark pb-3">
            <Users className="w-5 h-5 text-fire" />
            <h2 className="text-xl font-extrabold text-mist font-display">
              Logged By Users ({entries.length})
            </h2>
          </div>

          <div className="card-aui p-5 bg-eerie border border-stroke-dark space-y-3 rounded-xl">
            {entries.length === 0 ? (
              <p className="text-xs text-mist/60 font-serif-accent italic text-center py-4">No users have logged this title yet.</p>
            ) : (
              entries.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 bg-space border border-stroke-dark rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-eerie text-mist font-bold flex items-center justify-center text-xs font-display rounded-sm">
                      {e.user.displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-mist font-display">{e.user.displayName}</p>
                      <p className="text-[10px] text-mist/60 font-serif-accent italic capitalize">
                        {e.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {e.userRating && (
                    <span className="text-xs font-extrabold text-fire font-display">
                      ★ {e.userRating}/10
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
