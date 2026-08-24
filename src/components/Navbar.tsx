'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Trophy,
  Library,
  Search,
  Sparkles,
  PlusCircle,
  Flame,
  LogOut,
  User,
} from 'lucide-react';
import LogEntryModal from './LogEntryModal';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface UserSessionData {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  totalScore: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSessionData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Session fetch error:', e);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      // 1. Sign out from Firebase
      await signOut(auth);

      // 2. Clear server-side session cookie
      await fetch('/api/auth/sign-out', { method: 'POST' });

      setUser(null);
      setShowUserMenu(false);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  // Level calculation derived from totalScore (e.g. 40 XP per Level)
  const userXP = user?.totalScore || 0;
  const userLevel = Math.floor(userXP / 40) + 1;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Flame },
    { href: '/library', label: 'My Library', icon: Library },
    { href: '/browse', label: 'Browse', icon: Search },
    { href: '/leaderboards', label: 'Leaderboards', icon: Trophy },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 agency-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b border-[#2E2B40]">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#FF6B6B] text-[#FFFFFE] flex items-center justify-center font-extrabold text-lg tracking-wider group-hover:bg-[#E05555] transition-colors rounded-xs">
                PV
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#FFFFFE] font-display">
                  Play<span className="text-[#FF6B6B]">Verse</span>
                </span>
                
              </div>
            </Link>

            {/* Center Nav Links */}
            <nav className="hidden md:flex items-center gap-1 bg-[#1A1825] p-1 border border-[#2E2B40]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-tight transition-all ${
                      isActive
                        ? 'bg-[#FF6B6B] text-[#FFFFFE]'
                        : 'text-[#94A1B2] hover:text-[#FFFFFE] hover:bg-[#242234]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFFFFE]' : ''}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls & User Widget */}
            <div className="flex items-center gap-3">
              {/* Quick Log Button */}
              {user && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 agency-btn-primary px-4 py-2.5 transition-all active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Log Title</span>
                </button>
              )}

              {user ? (
                <div className="relative">
                  <div
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 bg-[#1A1825] hover:bg-[#242234] border border-[#2E2B40] p-1.5 pr-3 cursor-pointer transition-all"
                  >
                    {/* XP Indicator Pill */}
                    <div className="bg-[#FF6B6B] text-[#FFFFFE] font-extrabold text-xs px-2.5 py-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 fill-white" />
                      <span>{userXP} XP</span>
                    </div>

                    {/* User info */}
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-[#FFFFFE] leading-none">
                        {user.displayName}
                      </span>
                      <span className="text-[10px] font-serif-accent italic text-[#94A1B2] mt-0.5">
                        Lvl {userLevel} Scout
                      </span>
                    </div>
                  </div>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#1A1825] border border-[#2E2B40] shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-[#2E2B40] mb-1">
                        <p className="text-[10px] font-serif-accent italic text-[#94A1B2]">Signed in as</p>
                        <p className="text-sm font-bold text-[#FFFFFE] truncate">{user.displayName}</p>
                        <p className="text-[10px] text-[#94A1B2] truncate">{user.email}</p>
                        <p className="text-xs text-[#FF6B6B] font-extrabold mt-0.5">{user.totalScore} Total XP</p>
                      </div>

                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#FFFFFE] hover:bg-[#242234] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#FF6B6B]" />
                        <span>View Profile</span>
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors border-t border-[#2E2B40] mt-1 pt-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="agency-btn-secondary px-4 py-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation Row */}
          <div className="flex md:hidden items-center justify-around py-2 border-t border-[#2E2B40] bg-[#1A1825]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-bold ${
                    isActive ? 'text-[#FF6B6B]' : 'text-[#94A1B2] hover:text-[#FFFFFE]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Global Quick Log Entry Modal */}
      {isModalOpen && (
        <LogEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchSession();
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
