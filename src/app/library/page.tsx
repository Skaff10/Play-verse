'use client';

import { useState, useEffect } from 'react';
import MediaCard from '@/components/MediaCard';
import { safeParseGenres } from '@/lib/catalog';
import {
  Library as LibraryIcon,
  Filter,
  Search,
  Film,
  Tv,
  Gamepad2,
  CheckCircle2,
  Clock,
  Ban,
  SlidersHorizontal,
  Heart,
} from 'lucide-react';

export default function LibraryPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'rating' | 'title'>('updated');

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/entries?type=${typeFilter}&status=${statusFilter}`
      );
      const data = await res.json();
      if (data.entries) {
        setEntries(data.entries);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [typeFilter, statusFilter]);

  // Client-side filtering & sorting
  const filteredEntries = entries
    .filter((e) =>
      e.catalogItem.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.userRating || 0) - (a.userRating || 0);
      }
      if (sortBy === 'title') {
        return a.catalogItem.title.localeCompare(b.catalogItem.title);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#2E2B40] pb-6">
        <div>
          <span className="agency-badge text-xs font-bold uppercase">[ MY COLLECTION ]</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFE] font-display mt-1">Personal Library</h1>
          <p className="text-xs text-[#94A1B2] font-serif-accent italic mt-1">
            Logged movies, TV series, and video games ({entries.length} items recorded)
          </p>
        </div>

        {/* Search bar inside library */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#94A1B2]" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1825] border border-[#2E2B40] focus:border-[#FF6B6B] pl-10 pr-4 py-2.5 text-xs text-[#FFFFFE] focus:outline-none"
          />
        </div>
      </div>

      {/* FILTER TABS & CONTROLS */}
      <div className="space-y-4">
        {/* Row 1: Category Filter (All, Movies, Series, Games) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2E2B40]">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#1A1825] p-1 border border-[#2E2B40]">
            {[
              { id: 'all', label: 'All Catalog', icon: SlidersHorizontal },
              { id: 'movie', label: 'Movies', icon: Film },
              { id: 'series', label: 'TV Series', icon: Tv },
              { id: 'game', label: 'Games', icon: Gamepad2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6B6B] text-[#FFFFFE]'
                      : 'text-[#94A1B2] hover:text-[#FFFFFE] hover:bg-[#242234]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFFFFE]' : 'text-[#4ECDC4]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-[#94A1B2] font-bold">
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1A1825] border border-[#2E2B40] text-[#FFFFFE] px-3 py-1.5 text-xs focus:outline-none cursor-pointer font-display font-semibold"
            >
              <option value="updated">Recently Updated</option>
              <option value="rating">Highest User Rating</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Status Filter (All, In Progress, Completed, Dropped) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-[#94A1B2] uppercase tracking-wider mr-2 font-display">
            Status:
          </span>
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'wishlist', label: 'Wishlist 💜' },
            { id: 'in_progress', label: 'In Progress ⏳' },
            { id: 'completed', label: 'Completed ✅' },
            { id: 'dropped', label: 'Dropped 🚫' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 text-xs font-bold border transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#FF6B6B] text-[#FFFFFE] border-[#FF6B6B]'
                  : 'bg-[#1A1825] text-[#94A1B2] border-[#2E2B40] hover:border-[#FF6B6B]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* MEDIA GRID */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-[#1A1825] animate-pulse border border-[#2E2B40]"
            />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="agency-card p-16 text-center space-y-4 bg-[#1A1825] border border-[#2E2B40]">
          <Filter className="w-10 h-10 text-[#94A1B2] mx-auto" />
          <h3 className="text-lg font-bold text-[#FFFFFE] font-display">No entries match your filter</h3>
          <p className="text-xs text-[#94A1B2] font-serif-accent italic">
            Try resetting your status or category filters, or search for a title in Browse.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredEntries.map((entry) => (
            <MediaCard
              key={entry.id}
              id={entry.catalogItem.id}
              externalId={entry.catalogItem.externalId}
              type={entry.catalogItem.type}
              title={entry.catalogItem.title}
              coverUrl={entry.catalogItem.coverUrl}
              releaseYear={entry.catalogItem.releaseYear}
              genres={safeParseGenres(entry.catalogItem.genres)}
              userEntry={{
                status: entry.status,
                userRating: entry.userRating,
              }}
              onLogged={fetchEntries}
            />
          ))}
        </div>
      )}
    </div>
  );
}
