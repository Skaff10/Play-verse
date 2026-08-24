'use client';

import { useState } from 'react';
import LogEntryModal from '@/components/LogEntryModal';
import { PlusCircle, Edit2, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export interface ItemLoggerWidgetProps {
  item: {
    externalId: string;
    type: 'movie' | 'series' | 'game';
    title: string;
    coverUrl: string;
    releaseYear: number;
    genres: string[];
  };
  existingEntry?: {
    status: string;
    userRating?: number | null;
    review?: string | null;
    timesCompleted?: number;
  } | null;
}

export default function ItemLoggerWidget({
  item,
  existingEntry = null,
}: ItemLoggerWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="card-aui p-6 bg-eerie border border-stroke-dark space-y-4 rounded-xl">
        <div className="flex items-center justify-between border-b border-stroke-dark pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-fire" />
            <h3 className="text-base font-extrabold text-mist font-display">Your Personal Experience</h3>
          </div>
          {existingEntry && (
            <span className="bg-space text-fire border border-stroke-dark text-xs font-bold px-3 py-1 flex items-center gap-1.5 capitalize font-display rounded-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-fire" />
              <span>{existingEntry.status.replace('_', ' ')}</span>
            </span>
          )}
        </div>

        {existingEntry ? (
          <div className="space-y-3 bg-space p-4 border border-stroke-dark rounded-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-mist/60 font-serif-accent italic">Your Rating:</span>
              <span className="font-extrabold text-fire font-display">
                {existingEntry.userRating ? `★ ${existingEntry.userRating}/10` : 'Not Rated'}
              </span>
            </div>
            {existingEntry.review && (
              <div className="text-xs text-mist font-serif-accent italic border-t border-stroke-dark pt-2">
                "{existingEntry.review}"
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full btn-aui-secondary text-xs py-2.5 flex items-center justify-center gap-2 mt-2 cursor-pointer rounded-md"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Update Entry & Earn Replay XP</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <p className="text-xs text-mist/60 font-serif-accent italic">
              Have you experienced <strong className="text-mist font-sans font-bold">{item.title}</strong>? Log it now to earn up to +9 XP!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-aui-fire text-xs px-6 py-3 flex items-center justify-center gap-2 mx-auto active:scale-95 transition-transform cursor-pointer rounded-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Title & Claim XP</span>
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <LogEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialItem={item}
          existingEntry={existingEntry}
          onSuccess={() => {
            setIsModalOpen(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
