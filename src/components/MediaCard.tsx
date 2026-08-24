'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Film, Tv, Gamepad2, Plus, Edit2, CheckCircle2, Clock, Heart } from 'lucide-react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    externalId,
    type,
    title,
    coverUrl,
    releaseYear,
    genres: genresList,
  };

  return (
    <>
      <div className="group relative agency-card flex flex-col transition-all duration-300">
        {/* Cover Poster Image Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#1A1825]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E17]/90 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

          {/* Top Category Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#0F0E17]/90 text-[#FFFFFE] border border-[#2E2B40] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
            <TypeIcon className="w-3 h-3 text-[#4ECDC4]" />
            <span>{type}</span>
          </div>

          {/* Top Right User Logged Status Pill */}
          {userEntry && (
            <div
              className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 border backdrop-blur-xs ${
                userEntry.status === 'completed'
                  ? 'bg-[#6BCB77] text-[#0F0E17] border-[#6BCB77]'
                  : userEntry.status === 'in_progress'
                  ? 'bg-[#FF6B6B] text-[#FFFFFE] border-[#FF6B6B]'
                  : userEntry.status === 'wishlist'
                  ? 'bg-[#4ECDC4] text-[#0F0E17] border-[#4ECDC4]'
                  : 'bg-[#2E2B40] text-[#94A1B2] border-[#2E2B40]'
              }`}
            >
              {userEntry.status === 'completed' ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : userEntry.status === 'wishlist' ? (
                <Heart className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              <span className="capitalize">{userEntry.status.replace('_', ' ')}</span>
            </div>
          )}

          {/* Quick Action Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0F0E17]/70 backdrop-blur-[2px]">
            <button
              onClick={() => setIsModalOpen(true)}
              className="agency-btn-primary font-bold text-xs px-4 py-2.5 flex items-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer"
            >
              {userEntry ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{userEntry ? 'Edit Entry' : 'Log Title'}</span>
            </button>
          </div>

          {/* Bottom Poster Rating Badge */}
          {displayRating !== null && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-[#0F0E17]/90 text-[#FFFFFE] border border-[#2E2B40] px-2 py-0.5 text-xs font-extrabold backdrop-blur-xs">
              <Star className="w-3 h-3 fill-[#FFD93D] text-[#FFD93D]" />
              <span>{displayRating.toFixed(1)}</span>
              {ratingCount !== undefined && ratingCount > 0 && (
                <span className="text-[9px] text-[#94A1B2] font-normal">({ratingCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Card Metadata Footer */}
        <div className="p-3.5 flex flex-col flex-grow justify-between bg-[#1A1825] border-t border-[#2E2B40]">
          <div>
            <Link
              href={`/item/${type}/${id || externalId}`}
              className="font-bold text-sm text-[#FFFFFE] line-clamp-1 hover:text-[#FF6B6B] transition-colors font-display"
              title={title}
            >
              {title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-[#94A1B2] mt-1 font-serif-accent italic">
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
          onClose={() => setIsModalOpen(false)}
          initialItem={itemData}
          existingEntry={userEntry ? { ...userEntry } : null}
          onSuccess={() => {
            setIsModalOpen(false);
            if (onLogged) onLogged();
          }}
        />
      )}
    </>
  );
}
