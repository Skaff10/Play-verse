'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Star,
  CheckCircle2,
  Clock,
  Ban,
  Sparkles,
  Search,
  RotateCcw,
  MessageSquare,
  Award,
  Heart,
} from 'lucide-react';
import { MIN_REVIEW_LENGTH, MAX_REPLAY_POINTS_PER_ENTRY } from '@/lib/scoring';

export interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: {
    externalId: string;
    type: 'movie' | 'series' | 'game';
    title: string;
    coverUrl: string;
    releaseYear: number;
    genres: string[];
  } | null;
  existingEntry?: {
    status: string;
    userRating?: number | null;
    review?: string | null;
    timesCompleted?: number;
  } | null;
  onSuccess?: () => void;
}

export default function LogEntryModal({
  isOpen,
  onClose,
  initialItem = null,
  existingEntry = null,
  onSuccess,
}: LogEntryModalProps) {
  const [selectedItem, setSelectedItem] = useState(initialItem);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [status, setStatus] = useState<'in_progress' | 'completed' | 'dropped' | 'wishlist'>(
    (existingEntry?.status as any) || 'completed'
  );
  const [rating, setRating] = useState<number>(existingEntry?.userRating || 8);
  const [hasRating, setHasRating] = useState<boolean>(
    existingEntry?.userRating !== undefined && existingEntry?.userRating !== null
  );
  const [review, setReview] = useState<string>(existingEntry?.review || '');
  const [isReplay, setIsReplay] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search autocomplete handler
  useEffect(() => {
    if (!initialItem && searchQuery.trim().length > 0) {
      const delayDebounce = setTimeout(async () => {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/catalog/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          if (data.results) {
            setSearchResults(data.results);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, initialItem]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      setErrorMessage('Please select a movie, series, or game first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: selectedItem,
          status,
          userRating: hasRating ? rating : null,
          review: review.trim() || null,
          isReplay,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save entry');
      }

      setToastMessage(data.message || 'Saved successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewLength = review.trim().length;
  const isReviewEligible = reviewLength >= MIN_REVIEW_LENGTH;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0E17]/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#1A1825] border border-[#2E2B40] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E2B40] bg-[#1A1825]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6B6B] text-[#FFFFFE] flex items-center justify-center font-bold text-xs rounded-xs">
              PV
            </div>
            <h2 className="text-base font-extrabold text-[#FFFFFE] font-display">
              {existingEntry ? 'Edit Media Entry' : 'Log Experience & Earn XP'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#94A1B2] hover:text-[#FFFFFE] hover:bg-[#242234] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Toast Banner */}
          {toastMessage && (
            <div className="p-4 bg-[#0F0E17] text-[#FFFFFE] font-bold text-center flex items-center justify-center gap-2 border-l-4 border-[#6BCB77]">
              <Award className="w-5 h-5 text-[#FFD93D]" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-[#FF6B6B]/15 border border-[#FF6B6B]/40 text-[#FF6B6B] text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {/* Item Selector / Search */}
          {!selectedItem ? (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A1B2]">
                Search Title to Log
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#94A1B2]" />
                <input
                  type="text"
                  placeholder="Search movies, TV series, video games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0F0E17] border border-[#2E2B40] focus:border-[#FF6B6B] pl-10 pr-4 py-3 text-sm text-[#FFFFFE] focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Autocomplete Search Results */}
              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto bg-[#1A1825] border border-[#2E2B40] p-2 space-y-1 shadow-lg">
                  {searchResults.map((res) => (
                    <div
                      key={res.externalId}
                      onClick={() => {
                        setSelectedItem(res);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-[#242234] cursor-pointer transition-colors border-b border-[#2E2B40] last:border-none"
                    >
                      <div className="relative w-10 h-14 bg-[#0F0E17] flex-shrink-0">
                        <Image
                          src={res.coverUrl}
                          alt={res.title}
                          fill
                          unoptimized
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#FFFFFE] font-display">{res.title}</span>
                        <span className="text-xs text-[#94A1B2] font-serif-accent italic capitalize">
                          {res.type} • {res.releaseYear}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 p-3 bg-[#0F0E17] border border-[#2E2B40]">
              <div className="relative w-14 h-20 bg-[#1A1825] flex-shrink-0">
                <Image
                  src={selectedItem.coverUrl}
                  alt={selectedItem.title}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';
                  }}
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-extrabold text-[#FFFFFE] font-display">{selectedItem.title}</h3>
                <p className="text-xs text-[#94A1B2] font-serif-accent italic capitalize">
                  {selectedItem.type} • {selectedItem.releaseYear}
                </p>
              </div>
              {!initialItem && (
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-[#4ECDC4] font-bold hover:underline px-2 py-1 cursor-pointer"
                >
                  Change
                </button>
              )}
            </div>
          )}

          {selectedItem && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A1B2] mb-2">
                  Status & Point Rewards
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      id: 'wishlist',
                      label: 'Wishlist',
                      icon: Heart,
                      badge: '+0 XP',
                    },
                    {
                      id: 'in_progress',
                      label: 'In Progress',
                      icon: Clock,
                      badge: existingEntry ? (existingEntry.status === 'wishlist' ? '+2 XP' : '+0 XP') : '+2 XP',
                    },
                    {
                      id: 'completed',
                      label: 'Completed',
                      icon: CheckCircle2,
                      badge: existingEntry?.status === 'in_progress' ? '+3 XP' : existingEntry?.status === 'wishlist' ? '+5 XP' : existingEntry ? '+0 XP' : '+5 XP',
                    },
                    {
                      id: 'dropped',
                      label: 'Dropped',
                      icon: Ban,
                      badge: '+0 XP',
                    },
                  ].map((s) => {
                    const Icon = s.icon;
                    const isSelected = status === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStatus(s.id as any)}
                        className={`flex flex-col items-center justify-center p-3 border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? s.id === 'wishlist' ? 'bg-[#4ECDC4] text-[#0F0E17] border-[#4ECDC4]' : 'bg-[#FF6B6B] text-[#FFFFFE] border-[#FF6B6B]'
                            : 'bg-[#0F0E17] text-[#94A1B2] border-[#2E2B40] hover:border-[#FF6B6B]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? (s.id === 'wishlist' ? 'text-[#0F0E17]' : 'text-[#FFFFFE]') : ''}`} />
                          <span>{s.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 font-extrabold ${isSelected ? (s.id === 'wishlist' ? 'bg-[#0F0E17] text-[#4ECDC4]' : 'bg-[#0F0E17] text-[#FF6B6B]') : 'bg-[#242234] text-[#94A1B2]'}`}>
                          {s.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating Slider */}
              <div className="bg-[#0F0E17] p-4 border border-[#2E2B40]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FFD93D] fill-[#FFD93D]" />
                    <label className="text-xs font-bold uppercase tracking-wider text-[#FFFFFE]">
                      Your Rating (1 - 10)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#FF6B6B]/15 text-[#FF6B6B] font-bold px-2 py-0.5 border border-[#FF6B6B]/30">
                      +2 XP Bonus
                    </span>
                    <input
                      type="checkbox"
                      id="hasRating"
                      checked={hasRating}
                      onChange={(e) => setHasRating(e.target.checked)}
                      className="accent-[#FF6B6B] w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                {hasRating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[#FFFFFE] font-extrabold text-lg font-display">
                      <span>{rating} / 10</span>
                      <span className="text-xs font-serif-accent italic text-[#94A1B2]">
                        {rating >= 9
                          ? '🔥 Masterpiece'
                          : rating >= 7
                          ? '👍 Great'
                          : rating >= 5
                          ? '👌 Average'
                          : '👎 Poor'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full h-2 bg-[#2E2B40] appearance-none cursor-pointer accent-[#FF6B6B]"
                    />
                  </div>
                )}
              </div>

              {/* Review Textarea with 40 char threshold */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#FFFFFE] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#FF6B6B]" />
                    <span>Write Review (Optional)</span>
                  </label>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 border ${
                      isReviewEligible
                        ? 'bg-[#FF6B6B] text-[#FFFFFE] border-[#FF6B6B]'
                        : 'bg-[#242234] text-[#94A1B2] border-[#2E2B40]'
                    }`}
                  >
                    {isReviewEligible ? '+2 XP Unlocked!' : `${reviewLength} / ${MIN_REVIEW_LENGTH} chars for +2 XP`}
                  </span>
                </div>

                <textarea
                  rows={3}
                  placeholder="Share your thoughts on the plot, mechanics, or direction... (min. 40 characters for +2 XP bonus)"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full bg-[#0F0E17] border border-[#2E2B40] focus:border-[#FF6B6B] p-3 text-xs text-[#FFFFFE] focus:outline-none resize-none"
                />
              </div>

              {/* Rewatch / Replay option if already existing */}
              {existingEntry && (
                <div className="flex items-center justify-between p-3 bg-[#0F0E17] border border-[#2E2B40]">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#FF6B6B]" />
                    <div>
                      <p className="text-xs font-bold text-[#FFFFFE]">Logged Replay / Rewatch</p>
                      <p className="text-[10px] text-[#94A1B2] font-serif-accent italic">
                        Times completed: {existingEntry.timesCompleted || 1}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReplay(!isReplay)}
                    className={`px-3 py-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                      isReplay
                        ? 'bg-[#FF6B6B] text-[#FFFFFE] border-[#FF6B6B]'
                        : 'bg-[#1A1825] text-[#4ECDC4] border-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-[#0F0E17]'
                    }`}
                  >
                    {isReplay ? '+1 XP Active' : '+1 XP Replay'}
                  </button>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full agency-btn-primary text-sm py-3.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Recording Ledger Transaction...' : 'Save & Claim XP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
