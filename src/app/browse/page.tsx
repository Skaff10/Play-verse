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
      <div className="card-aui p-8 md:p-10 bg-eerie border border-stroke-dark space-y-6 text-center max-w-4xl mx-auto rounded-xl">
        <div className="space-y-3">
          <span className="text-aui-eyebrow">[ OUR CATALOG ]</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-mist font-display">
            Browse & Search Catalog
          </h1>
          <p className="text-xs text-mist/60 font-serif-accent italic max-w-xl mx-auto">
            Search movies, TV series, and video games. Click any title to log it and earn XP points.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-mist/50" />
          <input
            type="text"
            placeholder="Search by title (e.g. Interstellar, Severance, Elden Ring)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-space border border-stroke-dark focus:border-fire pl-11 pr-4 py-3.5 text-sm text-mist focus:outline-none rounded-md transition-colors"
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
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all cursor-pointer rounded-md border ${
                  isActive
                    ? 'btn-aui-fire'
                    : 'bg-space text-mist/70 border-stroke-dark hover:bg-mist hover:text-space hover:border-space/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-mist' : 'text-fire'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-8 border-b border-stroke-dark pb-4">
          <h2 className="text-xl font-extrabold text-mist flex items-center gap-2 font-display">
            <Sparkles className="w-4 h-4 text-fire" />
            <span>{query ? `Search Results for "${query}"` : 'Popular Catalog Titles'}</span>
          </h2>
          <span className="text-xs text-mist/60 font-serif-accent italic">
            {results.length} titles found
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-eerie animate-pulse border border-stroke-dark rounded-xl"
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="card-aui p-16 text-center space-y-4 bg-eerie border border-stroke-dark rounded-xl">
            <Search className="w-10 h-10 text-mist/40 mx-auto" />
            <h3 className="text-lg font-bold text-mist font-display">No catalog items found</h3>
            <p className="text-xs text-mist/60 font-serif-accent italic">
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
