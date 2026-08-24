'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] w-full bg-gradient-to-r from-eerie via-[#000] to-fire/80">
      <div className="relative mx-auto flex w-full items-center justify-center px-5 py-2.5 md:px-12 md:py-3">
        <div className="mr-3 flex items-center gap-2 text-[13px] leading-[1.4] text-mist md:mr-6">
          {/* Star decoration */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M7 0L7.9 4.9L12.8 5.8L7.9 6.7L7 11.6L6.1 6.7L1.2 5.8L6.1 4.9L7 0Z"
              fill="currentColor"
            />
          </svg>
          <span>
            Track every movie, show, and game 
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M7 0L7.9 4.9L12.8 5.8L7.9 6.7L7 11.6L6.1 6.7L1.2 5.8L6.1 4.9L7 0Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="flex items-center gap-6">
          
          <button
            onClick={() => setDismissed(true)}
            className="text-mist/60 hover:text-mist transition-colors cursor-pointer ml-2"
            aria-label="Dismiss announcement"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
