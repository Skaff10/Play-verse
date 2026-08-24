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
      <div className="agency-card p-6 bg-[#1A1825] border border-[#2E2B40] space-y-4">
        <div className="flex items-center justify-between border-b border-[#2E2B40] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
            <h3 className="text-base font-extrabold text-[#FFFFFE] font-display">Your Personal Experience</h3>
          </div>
          {existingEntry && (
            <span className="bg-[#0F0E17] text-[#4ECDC4] border border-[#2E2B40] text-xs font-bold px-3 py-1 flex items-center gap-1.5 capitalize font-display">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4ECDC4]" />
              <span>{existingEntry.status.replace('_', ' ')}</span>
            </span>
          )}
        </div>

        {existingEntry ? (
          <div className="space-y-3 bg-[#0F0E17] p-4 border border-[#2E2B40]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A1B2] font-serif-accent italic">Your Rating:</span>
              <span className="font-extrabold text-[#FF6B6B] font-display">
                {existingEntry.userRating ? `★ ${existingEntry.userRating}/10` : 'Not Rated'}
              </span>
            </div>
            {existingEntry.review && (
              <div className="text-xs text-[#FFFFFE] font-serif-accent italic border-t border-[#2E2B40] pt-2">
                "{existingEntry.review}"
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full agency-btn-secondary text-xs py-2.5 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Update Entry & Earn Replay XP</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <p className="text-xs text-[#94A1B2] font-serif-accent italic">
              Have you experienced <strong className="text-[#FFFFFE] font-sans font-bold">{item.title}</strong>? Log it now to earn up to +9 XP!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="agency-btn-primary text-xs px-6 py-3 flex items-center justify-center gap-2 mx-auto active:scale-95 transition-transform cursor-pointer"
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
