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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-stroke-dark pb-6">
        <div>
          <span className="text-aui-eyebrow">[ MY COLLECTION ]</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-mist font-display mt-1">Personal Library</h1>
          <p className="text-xs text-mist/60 font-serif-accent italic mt-1">
            Logged movies, TV series, and video games ({entries.length} items recorded)
          </p>
        </div>

        {/* Search bar inside library */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-mist/50" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-eerie border border-stroke-dark focus:border-fire pl-10 pr-4 py-2.5 text-xs text-mist focus:outline-none rounded-md transition-colors"
          />
        </div>
      </div>

      {/* FILTER TABS & CONTROLS */}
      <div className="space-y-4">
        {/* Row 1: Category Filter (All, Movies, Series, Games) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stroke-dark">
          <div className="flex flex-wrap items-center gap-1.5 bg-eerie p-1 border border-stroke-dark rounded-md">
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
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer rounded-sm ${
                    isActive
                      ? 'bg-fire text-mist font-bold'
                      : 'text-mist/70 hover:text-mist hover:bg-space'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-mist' : 'text-fire'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-mist/70 font-medium">
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-eerie border border-stroke-dark text-mist px-3 py-1.5 text-xs focus:outline-none cursor-pointer font-display font-semibold rounded-md"
            >
              <option value="updated">Recently Updated</option>
              <option value="rating">Highest User Rating</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Status Filter (All, In Progress, Completed, Dropped) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-mist/60 uppercase tracking-wider mr-2 font-display">
            Status:
          </span>
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'wishlist', label: 'Wishlist' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'dropped', label: 'Dropped' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer rounded-md ${
                statusFilter === st.id
                  ? 'bg-fire text-mist border-fire font-bold'
                  : 'bg-eerie text-mist/70 border-stroke-dark hover:border-fire hover:text-mist'
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
              className="aspect-[2/3] bg-eerie animate-pulse border border-stroke-dark rounded-xl"
            />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="card-aui p-16 text-center space-y-4 bg-eerie border border-stroke-dark rounded-xl">
          <Filter className="w-10 h-10 text-mist/40 mx-auto" />
          <h3 className="text-lg font-bold text-mist font-display">No entries match your filter</h3>
          <p className="text-xs text-mist/60 font-serif-accent italic">
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
