'use client';

import { useState, useEffect } from 'react';
import MediaCard from '@/components/MediaCard';
import { Search, Film, Tv, Gamepad2, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function BrowsePage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [results, setResults] = useState<any[]>([]);
  const [userEntriesMap, setUserEntriesMap] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserEntries = async () => {
    try {
      const res = await fetch('/api/entries');
      const data = await res.json();
      if (data.entries) {
        const map: Record<string, any> = {};
        data.entries.forEach((e: any) => {
          map[e.catalogItem.externalId] = {
            status: e.status,
            userRating: e.userRating,
          };
        });
        setUserEntriesMap(map);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const executeSearch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/catalog/search?q=${encodeURIComponent(query)}&type=${typeFilter}`
      );
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEntries();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      executeSearch();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, typeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Search Header Banner */}
      <div className="agency-card p-10 bg-[#1A1825] border border-[#2E2B40] space-y-6 text-center max-w-4xl mx-auto">
        <div className="space-y-3">
          <span className="agency-badge text-xs font-bold uppercase">[ OUR CATALOG ]</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFE] font-display">
            Browse & Search Catalog
          </h1>
          <p className="text-xs text-[#94A1B2] font-serif-accent italic max-w-xl mx-auto">
            Search movies, TV series, and video games. Click any title to log it and earn XP points.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#94A1B2]" />
          <input
            type="text"
            placeholder="Search by title (e.g. Interstellar, Severance, Elden Ring)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0F0E17] border border-[#2E2B40] focus:border-[#FF6B6B] pl-11 pr-4 py-3.5 text-sm text-[#FFFFFE] focus:outline-none"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF6B6B] text-[#FFFFFE]'
                    : 'bg-[#0F0E17] text-[#94A1B2] border border-[#2E2B40] hover:bg-[#242234] hover:text-[#FFFFFE]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFFFFE]' : 'text-[#4ECDC4]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-8 border-b border-[#2E2B40] pb-4">
          <h2 className="text-xl font-extrabold text-[#FFFFFE] flex items-center gap-2 font-display">
            <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
            <span>{query ? `Search Results for "${query}"` : 'Popular Catalog Titles'}</span>
          </h2>
          <span className="text-xs text-[#94A1B2] font-serif-accent italic">
            {results.length} titles found
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-[#1A1825] animate-pulse border border-[#2E2B40]"
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="agency-card p-16 text-center space-y-4 bg-[#1A1825] border border-[#2E2B40]">
            <Search className="w-10 h-10 text-[#94A1B2] mx-auto" />
            <h3 className="text-lg font-bold text-[#FFFFFE] font-display">No catalog items found</h3>
            <p className="text-xs text-[#94A1B2] font-serif-accent italic">
              Try searching for another keyword or change your category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((item) => (
              <MediaCard
                key={item.externalId}
                externalId={item.externalId}
                type={item.type}
                title={item.title}
                coverUrl={item.coverUrl}
                releaseYear={item.releaseYear}
                genres={item.genres}
                userEntry={userEntriesMap[item.externalId] || null}
                onLogged={fetchUserEntries}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
