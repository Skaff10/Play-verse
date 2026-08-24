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
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { MIN_REVIEW_LENGTH, MAX_REPLAY_POINTS_PER_ENTRY } from '@/lib/scoring';

export interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: {
    id?: string;
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
  initialShowDeleteConfirm?: boolean;
  onSuccess?: () => void;
}

export default function LogEntryModal({
  isOpen,
  onClose,
  initialItem = null,
  existingEntry = null,
  initialShowDeleteConfirm = false,
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(initialShowDeleteConfirm);
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

  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams();
      if (selectedItem.id) params.set('catalogItemId', selectedItem.id);
      if (selectedItem.externalId) params.set('externalId', selectedItem.externalId);

      const res = await fetch(`/api/entries?${params.toString()}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete entry');
      }

      setToastMessage('Entry removed from your library');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-eerie border border-stroke-dark shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stroke-dark bg-space">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-fire text-mist flex items-center justify-center font-bold text-xs rounded-xs">
              PV
            </div>
            <h2 className="text-base font-extrabold text-mist font-display">
              {existingEntry ? 'Edit Media Entry' : 'Log Experience & Earn XP'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-mist/60 hover:text-mist hover:bg-space transition-colors cursor-pointer rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Toast Banner */}
          {toastMessage && (
            <div className="p-4 bg-space text-mist font-bold text-center flex items-center justify-center gap-2 border-l-4 border-fire">
              <Award className="w-5 h-5 text-fire" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-fire/15 border border-fire/40 text-fire text-xs font-bold rounded">
              {errorMessage}
            </div>
          )}

          {/* Item Selector / Search */}
          {!selectedItem ? (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-mist/60">
                Search Title to Log
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-mist/50" />
                <input
                  type="text"
                  placeholder="Search movies, TV series, video games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-space border border-stroke-dark focus:border-fire pl-10 pr-4 py-3 text-sm text-mist focus:outline-none rounded"
                  autoFocus
                />
              </div>

              {/* Autocomplete Search Results */}
              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto bg-space border border-stroke-dark p-2 space-y-1 shadow-lg rounded">
                  {searchResults.map((res) => (
                    <div
                      key={res.externalId}
                      onClick={() => {
                        setSelectedItem(res);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-eerie cursor-pointer transition-colors border-b border-stroke-dark last:border-none rounded"
                    >
                      <div className="relative w-10 h-14 bg-eerie flex-shrink-0">
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
                        <span className="text-sm font-bold text-mist font-display">{res.title}</span>
                        <span className="text-xs text-mist/60 font-serif-accent italic capitalize">
                          {res.type} • {res.releaseYear}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 p-3 bg-space border border-stroke-dark rounded">
              <div className="relative w-14 h-20 bg-eerie flex-shrink-0">
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
                <h3 className="text-base font-extrabold text-mist font-display">{selectedItem.title}</h3>
                <p className="text-xs text-mist/60 font-serif-accent italic capitalize">
                  {selectedItem.type} • {selectedItem.releaseYear}
                </p>
              </div>
              {!initialItem && (
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-fire font-bold hover:underline px-2 py-1 cursor-pointer"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-mist/60 mb-2">
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
                        className={`flex flex-col items-center justify-center p-3 border text-xs font-bold transition-all cursor-pointer rounded ${
                          isSelected
                            ? 'bg-fire text-mist border-fire'
                            : 'bg-space text-mist/70 border-stroke-dark hover:border-mist/30 hover:text-mist'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-mist' : 'text-fire'}`} />
                          <span>{s.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 font-extrabold rounded-xs ${isSelected ? 'bg-space text-fire' : 'bg-eerie text-mist/60'}`}>
                          {s.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating Slider */}
              <div className="bg-space p-4 border border-stroke-dark rounded">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-fire fill-fire" />
                    <label className="text-xs font-bold uppercase tracking-wider text-mist">
                      Your Rating (1 - 10)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-fire/15 text-fire font-bold px-2 py-0.5 border border-fire/30 rounded">
                      +2 XP Bonus
                    </span>
                    <input
                      type="checkbox"
                      id="hasRating"
                      checked={hasRating}
                      onChange={(e) => setHasRating(e.target.checked)}
                      className="accent-fire w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                {hasRating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-mist font-extrabold text-lg font-display">
                      <span>{rating} / 10</span>
                      <span className="text-xs font-serif-accent italic text-mist/60">
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
                      className="w-full h-2 bg-eerie appearance-none cursor-pointer accent-fire rounded"
                    />
                  </div>
                )}
              </div>

              {/* Review Textarea with 40 char threshold */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-mist flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-fire" />
                    <span>Write Review (Optional)</span>
                  </label>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 border rounded ${
                      isReviewEligible
                        ? 'bg-fire text-mist border-fire'
                        : 'bg-space text-mist/60 border-stroke-dark'
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
                  className="w-full bg-space border border-stroke-dark focus:border-fire p-3 text-xs text-mist focus:outline-none resize-none rounded"
                />
              </div>

              {/* Rewatch / Replay option if already existing */}
              {existingEntry && (
                <div className="flex items-center justify-between p-3 bg-space border border-stroke-dark rounded">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-fire" />
                    <div>
                      <p className="text-xs font-bold text-mist">Logged Replay / Rewatch</p>
                      <p className="text-[10px] text-mist/60 font-serif-accent italic">
                        Times completed: {existingEntry.timesCompleted || 1}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReplay(!isReplay)}
                    className={`px-3 py-1.5 text-xs font-bold border transition-colors cursor-pointer rounded ${
                      isReplay
                        ? 'bg-fire text-mist border-fire'
                        : 'bg-eerie text-mist border-stroke-dark hover:border-fire hover:text-fire'
                    }`}
                  >
                    {isReplay ? '+1 XP Active' : '+1 XP Replay'}
                  </button>
                </div>
              )}

              {/* Delete confirmation prompt */}
              {showDeleteConfirm ? (
                <div className="p-4 bg-fire/15 border border-fire/40 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-fire text-xs font-bold font-display">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Delete Entry Confirmation</span>
                  </div>
                  <p className="text-xs text-mist/80">
                    Are you sure you want to remove this entry from your library? Associated XP points will be deducted.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleDelete}
                      className="flex-1 bg-fire text-mist text-xs font-bold py-2.5 px-4 rounded hover:bg-fire/80 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-space border border-stroke-dark text-mist text-xs font-bold py-2.5 px-4 rounded hover:bg-eerie transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Submit & Delete CTA buttons */
                <div className="flex items-center gap-3">
                  {existingEntry && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-space border border-fire/40 text-fire hover:bg-fire hover:text-mist text-xs font-bold py-3.5 px-4 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-aui-fire text-sm py-3.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer text-center"
                  >
                    {isSubmitting ? 'Recording Ledger Transaction...' : 'Save & Claim XP'}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
