'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  Film,
  Tv,
  Gamepad2,
  Users,
  Star,
  Sparkles,
  Award,
  Info,
  ArrowUp,
  Flame,
} from 'lucide-react';

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'movie' | 'series' | 'game'>('users');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/leaderboards?category=${activeTab}`);
      const data = await res.json();
      if (data.items) {
        setLeaderboardData(data.items);
      }
      if (data.currentUserRank) {
        setCurrentUserRank(data.currentUserRank);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-32">
      {/* Header Banner */}
      <div className="card-aui p-8 md:p-10 bg-eerie border border-stroke-dark text-center max-w-4xl mx-auto space-y-4 rounded-xl">
        <span className="text-aui-eyebrow">[ GLOBAL COMPETITION ]</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-mist font-display">PlayVerse Leaderboards</h1>
        <p className="text-xs text-mist/60 font-serif-accent italic max-w-xl mx-auto">
          Ranked by total XP earned for users, and IMDb Bayesian weighted average ($W$) for media items.
        </p>
      </div>

      {/* Bayesian Formula Explanation Box */}
      {activeTab !== 'users' && (
        <div className="p-5 bg-eerie border border-stroke-dark text-xs text-mist space-y-1.5 max-w-4xl mx-auto rounded-lg">
          <div className="flex items-center gap-2 font-bold text-fire font-display">
            <Info className="w-4 h-4 text-fire" />
            <span>Bayesian Weighted Average Formula ($W$)</span>
          </div>
          <p className="text-xs text-mist/60 font-serif-accent italic">
            Weighted Rating $W = (v / (v + m)) \cdot R + (m / (v + m)) \cdot C$ where $R$ is average item rating, $v$ is rating count, $m = 3$ minimum threshold, and $C$ is catalog mean. Prevents single-rating titles from skewing the rank!
          </p>
        </div>
      )}

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'users', label: 'Top Users (XP)', icon: Users },
          { id: 'movie', label: 'Top Movies', icon: Film },
          { id: 'series', label: 'Top TV Series', icon: Tv },
          { id: 'game', label: 'Top Games', icon: Gamepad2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-medium transition-all cursor-pointer rounded-md border ${
                isActive
                  ? 'btn-aui-fire font-bold'
                  : 'bg-eerie text-mist/70 border-stroke-dark hover:bg-mist hover:text-space hover:border-space/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-mist' : 'text-fire'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* LEADERBOARD LIST TABLE */}
      <div className="card-aui bg-eerie border border-stroke-dark overflow-hidden rounded-xl">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-space animate-pulse border border-stroke-dark rounded" />
            ))}
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-extrabold text-mist font-display">No ranked items in this category yet</p>
            <p className="text-xs text-mist/60 font-serif-accent italic">Be the first to rate a {activeTab}!</p>
          </div>
        ) : activeTab === 'users' ? (
          /* Users XP Leaderboard */
          <div className="divide-y divide-stroke-dark">
            {leaderboardData.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-space/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 flex items-center justify-center font-extrabold text-sm font-display rounded-sm ${
                      u.rank === 1
                        ? 'bg-fire text-mist'
                        : u.rank === 2
                        ? 'bg-mist text-space'
                        : u.rank === 3
                        ? 'bg-space text-mist border border-stroke-dark'
                        : 'bg-space/60 text-mist/60 border border-stroke-dark'
                    }`}
                  >
                    0{u.rank}
                  </div>
                  <div className="w-10 h-10 bg-space text-mist border border-stroke-dark font-extrabold flex items-center justify-center font-display rounded-sm">
                    {u.displayName.charAt(0)}
                  </div>
                  <div>
                    <Link
                      href={`/profile/${u.id}`}
                      className="font-extrabold text-mist text-sm hover:text-fire transition-colors font-display"
                    >
                      {u.displayName}
                    </Link>
                    <p className="text-xs text-mist/60 font-serif-accent italic">
                      {u.moviesLoggedCount} Movies • {u.seriesLoggedCount} Series • {u.gamesLoggedCount} Games
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-extrabold text-fire text-lg font-display">{u.totalScore}</span>
                    <span className="text-[10px] text-mist/50 font-bold uppercase block -mt-1">Total XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Media Item Bayesian Rating Leaderboard */
          <div className="divide-y divide-stroke-dark">
            {leaderboardData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-space/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-space text-mist/70 border border-stroke-dark font-extrabold text-xs flex items-center justify-center font-display rounded-sm">
                    #{item.rank}
                  </div>
                  <div className="relative w-12 h-16 bg-space shrink-0 border border-stroke-dark rounded overflow-hidden">
                    <Image
                      src={item.coverUrl}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';
                      }}
                    />
                  </div>
                  <div>
                    <Link
                      href={`/item/${item.type}/${item.id}`}
                      className="font-extrabold text-mist text-sm hover:text-fire transition-colors line-clamp-1 font-display"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-mist/60 font-serif-accent italic">
                      {item.releaseYear} • {(Array.isArray(item.genres) ? item.genres : []).slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-space border border-stroke-dark px-3 py-1 text-sm font-display rounded">
                    <Star className="w-4 h-4 fill-fire text-fire" />
                    <span className="text-mist font-extrabold">{(item.weightedRating ?? 0).toFixed(1)}</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-mist/60 block font-serif-accent italic">{(item.avgRating ?? 0).toFixed(1)} Raw</span>
                    <span className="text-[10px] text-mist/40 block">{item.ratingCount ?? 0} Ratings</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STICKY USER RANK BANNER AT BOTTOM */}
      {currentUserRank && activeTab === 'users' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] bg-eerie border border-fire p-4 shadow-2xl flex items-center justify-between rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-fire text-mist font-extrabold text-sm flex items-center justify-center font-display rounded-sm">
              #{currentUserRank.rank}
            </div>
            <div>
              <p className="text-xs font-bold text-mist font-display">Your Leaderboard Rank</p>
              <p className="text-[10px] text-mist/60 font-serif-accent italic">{currentUserRank.displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-space text-fire border border-fire px-3 py-1.5 font-extrabold text-sm font-display rounded-md">
            <Sparkles className="w-4 h-4 text-fire" />
            <span>{currentUserRank.totalScore} XP</span>
          </div>
        </div>
      )}
    </div>
  );
}
