'use client';

import { useState } from 'react';

/**
 * AUI-style comparison section.
 * "Spreadsheet tracking" vs "Play Verse" — mirrors AUI's Apollo vs LLM comparison.
 */

const TABS = [
  'Status tracking',
  'Rating system',
  'Progress visibility',
  'Social features',
  'Cross-media',
];

const COMPARISON_DATA: Record<
  string,
  { spreadsheet: string[]; playverse: string[] }
> = {
  'Status tracking': {
    spreadsheet: [
      'Manually update a cell every time',
      'No standard format across users',
      'Easy to forget or lose track',
      'No validation — type whatever you want',
      'Formulas break when you add rows',
    ],
    playverse: [
      'One-click status changes',
      'Structured Watching → Completed flow',
      'Automatic timestamps and history',
      'Built-in status categories',
      'Never lose track of where you stopped',
    ],
  },
  'Rating system': {
    spreadsheet: [
      'Freeform numbers, no consistency',
      'No aggregate scores or averages',
      'Can\'t compare across friends',
      'No weighted ranking system',
      'Your 7/10 means nothing without context',
    ],
    playverse: [
      'Standardized 1–10 scale with reviews',
      'Bayesian-weighted community ratings',
      'Comparable scores across all users',
      'Leaderboards powered by real math',
      'Ratings feed into discovery',
    ],
  },
  'Progress visibility': {
    spreadsheet: [
      'Hidden in a tab nobody checks',
      'No visual overview of habits',
      'Can\'t see completion rates',
      'No sense of achievement',
      'Data entry feels like homework',
    ],
    playverse: [
      'Beautiful dashboard with stats',
      'XP system rewards finishing things',
      'Visual progress across all media',
      'Level up as you watch and play more',
      'Feels like progress, not data entry',
    ],
  },
  'Social features': {
    spreadsheet: [
      'Share a Google Sheets link... really?',
      'No profiles or public pages',
      'Can\'t discover what friends watch',
      'No competitive element',
      'Zero engagement beyond data',
    ],
    playverse: [
      'Public profiles with media history',
      'XP leaderboards among friends',
      'See what others are watching/playing',
      'Community-driven recommendations',
      'Gamified engagement that\'s actually fun',
    ],
  },
  'Cross-media': {
    spreadsheet: [
      'Separate sheets for movies, shows, games',
      'Different formats per media type',
      'No unified search or catalog',
      'Manual data entry for everything',
      'Three sheets that don\'t talk to each other',
    ],
    playverse: [
      'Movies, shows, and games in one place',
      'Unified catalog with auto-fill metadata',
      'Cross-media statistics and insights',
      'One XP system across all media',
      'Search once, track everything',
    ],
  },
};

export default function ComparisonSection() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const data = COMPARISON_DATA[activeTab];

  return (
    <div className="mx-auto w-full max-w-[1192px] px-5 md:px-0">
      {/* Heading */}
      <div className="mx-auto w-full max-w-[585px] text-center">
        <h2 className="text-aui-eyebrow mb-3 inline-flex gap-2 md:mb-4">
          Why not just use a spreadsheet?
        </h2>
        <h3 className="text-aui-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-mist">
          <span className="opacity-50">Can your spreadsheet </span>do this?
        </h3>
        <p className="text-aui-content mt-6">
          We asked ourselves the same question. Then we built something better.
        </p>
      </div>

      {/* Tab selector */}
      <div className="mt-12 md:mt-[72px]">
        <div className="relative flex w-full flex-col flex-wrap items-center gap-5 overflow-hidden rounded-xl border border-stroke-dark pl-4 md:py-3 md:pl-4 md:pr-4 lg:mx-auto lg:max-w-max lg:flex-row lg:justify-center">
          <div className="hide-scrollbars -ml-4 w-full flex-1 overflow-x-auto py-2 md:-ml-0 md:py-0">
            <div className="flex flex-1 items-center gap-2 text-[15px] leading-[0.85] tracking-[-0.04em] lg:justify-center">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative block whitespace-nowrap px-2 py-[10.5px] text-center text-mist md:px-4 cursor-pointer transition-colors ${
                    activeTab === tab ? '' : 'opacity-60 hover:opacity-100'
                  }`}
                  type="button"
                >
                  {activeTab === tab && (
                    <div className="absolute inset-0 z-[5] rounded bg-eerie border border-stroke-dark" />
                  )}
                  <div className="relative z-[10]">{tab}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Labels row (desktop) */}
      <div className="mt-8 hidden items-center justify-center gap-4 uppercase md:flex">
        <div className="text-[11px] font-bold leading-[1.2] tracking-[0.08em] text-fire">
          Play Verse
        </div>
        <div className="flex h-[18px] w-8 items-center overflow-hidden rounded-sm border border-fire bg-fire p-[2px]">
          <div className="h-full w-[13px] rounded-[1.2px] bg-white" />
        </div>
        <div className="text-[11px] font-bold leading-[1.2] tracking-[0.08em] text-mist/60">
          Spreadsheet
        </div>
      </div>

      {/* Comparison cards */}
      <div className="mx-auto mt-8 flex w-full flex-col justify-between gap-5 md:flex-row lg:gap-[30px]">
        {/* Play Verse card */}
        <div className="flex flex-1 flex-col">
          <div className="relative mx-auto w-full overflow-hidden rounded-xl border border-fire/30 bg-fire/5 p-6 md:p-8">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-fire md:hidden">
              Play Verse
            </div>
            <ul className="space-y-4">
              {data.playverse.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fire/20">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 5L4.5 7.5L8 2.5"
                        stroke="#E84A23"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm leading-relaxed text-mist">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Spreadsheet card */}
        <div className="flex flex-1 flex-col">
          <div className="relative mx-auto w-full overflow-hidden rounded-xl border border-stroke-dark p-6 md:p-8">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-mist/50 md:hidden">
              Spreadsheet
            </div>
            <ul className="space-y-4">
              {data.spreadsheet.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mist/5">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5"
                        stroke="rgba(241,240,224,0.3)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm leading-relaxed text-mist/50">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
