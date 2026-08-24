'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Film, Tv, Gamepad2, Plus, Edit2, CheckCircle2, Clock, Heart, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import LogEntryModal from './LogEntryModal';

export interface MediaCardProps {
  id?: string;
  externalId: string;
  type: 'movie' | 'series' | 'game';
  title: string;
  coverUrl: string;
  releaseYear: number;
  genres: string[];
  avgRating?: number;
  ratingCount?: number;
  weightedRating?: number;
  userEntry?: {
    status: 'in_progress' | 'completed' | 'dropped' | 'wishlist';
    userRating?: number | null;
  } | null;
  onLogged?: () => void;
}

export default function MediaCard({
  id,
  externalId,
  type,
  title,
  coverUrl,
  releaseYear,
  genres,
  avgRating,
  ratingCount,
  weightedRating,
  userEntry,
  onLogged,
}: MediaCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const cleanCover = coverUrl?.includes('8Vt6mAwTZWMGGKGfFsvMAtug5WC')
    ? 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500'
    : coverUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';

  const [imgSrc, setImgSrc] = useState(cleanCover);

  useEffect(() => {
    setImgSrc(cleanCover);
  }, [coverUrl]);

  const displayRating = weightedRating !== undefined && weightedRating > 0
    ? weightedRating
    : avgRating !== undefined && avgRating > 0
    ? avgRating
    : null;

  const TypeIcon = type === 'movie' ? Film : type === 'series' ? Tv : Gamepad2;

  const genresList = Array.isArray(genres) ? genres : typeof genres === 'string' ? [genres] : [];

  const itemData = {
    id,
    externalId,
    type,
    title,
    coverUrl,
    releaseYear,
    genres: genresList,
  };

  const handleLoggedSuccess = () => {
    setIsModalOpen(false);
    setShowDeleteModal(false);
    if (onLogged) {
      onLogged();
    }
    router.refresh();
  };

  return (
    <>
      <div className="group relative card-aui overflow-hidden border border-stroke-dark bg-eerie flex flex-col transition-all duration-300">
        {/* Cover Poster Image Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-space">
          <Image
            src={imgSrc}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgSrc('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space/90 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

          {/* Top Category Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-space/90 text-mist border border-stroke-dark px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
            <TypeIcon className="w-3 h-3 text-fire" />
            <span>{type}</span>
          </div>

          {/* Top Right User Logged Status Pill */}
          {userEntry && (
            <div
              className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 border backdrop-blur-xs ${
                userEntry.status === 'completed'
                  ? 'bg-fire text-mist border-fire'
                  : userEntry.status === 'in_progress'
                  ? 'bg-space text-mist border-stroke-dark'
                  : userEntry.status === 'wishlist'
                  ? 'bg-mist text-space border-mist'
                  : 'bg-space/80 text-mist/60 border-stroke-dark'
              }`}
            >
              {userEntry.status === 'completed' ? (
                <CheckCircle2 className="w-3 h-3 text-mist" />
              ) : userEntry.status === 'wishlist' ? (
                <Heart className="w-3 h-3 text-space fill-space" />
              ) : (
                <Clock className="w-3 h-3 text-fire" />
              )}
              <span className="capitalize">{userEntry.status.replace('_', ' ')}</span>
            </div>
          )}

          {/* Quick Action Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-space/80 backdrop-blur-[2px]">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setIsModalOpen(true);
              }}
              className="btn-aui-fire font-bold text-xs px-3.5 py-2.5 flex items-center gap-1.5 transition-transform active:scale-95 shadow-md cursor-pointer"
            >
              {userEntry ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{userEntry ? 'Edit' : 'Log Title'}</span>
            </button>

            {userEntry && (
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setIsModalOpen(true);
                }}
                className="bg-space border border-fire/40 text-fire hover:bg-fire hover:text-mist p-2.5 transition-all active:scale-95 shadow-md cursor-pointer rounded-md"
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom Poster Rating Badge */}
          {displayRating !== null && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-space/90 text-mist border border-stroke-dark px-2 py-0.5 text-xs font-extrabold backdrop-blur-xs">
              <Star className="w-3 h-3 fill-fire text-fire" />
              <span>{displayRating.toFixed(1)}</span>
              {ratingCount !== undefined && ratingCount > 0 && (
                <span className="text-[9px] text-mist/50 font-normal">({ratingCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Card Metadata Footer */}
        <div className="p-3.5 flex flex-col flex-grow justify-between bg-eerie border-t border-stroke-dark">
          <div>
            <Link
              href={`/item/${type}/${id || externalId}`}
              className="font-bold text-sm text-mist line-clamp-1 hover:text-fire transition-colors font-display"
              title={title}
            >
              {title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-mist/60 mt-1 font-serif-accent italic">
              <span>{releaseYear}</span>
              {genresList.length > 0 && (
                <>
                  <span>•</span>
                  <span className="truncate">{genresList.slice(0, 2).join(', ')}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log / Edit Entry Modal */}
      {isModalOpen && (
        <LogEntryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setShowDeleteModal(false);
          }}
          initialItem={itemData}
          existingEntry={userEntry ? { ...userEntry } : null}
          initialShowDeleteConfirm={showDeleteModal}
          onSuccess={handleLoggedSuccess}
        />
      )}
    </>
  );
}
