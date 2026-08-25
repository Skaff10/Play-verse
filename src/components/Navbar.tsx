'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Trophy,
  Library,
  Search,
  Sparkles,
  PlusCircle,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';
import LogEntryModal from './LogEntryModal';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshSession, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowUserMenu(false);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  const userXP = user?.totalScore || 0;
  const userLevel = Math.floor(userXP / 40) + 1;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/library', label: 'Library' },
    { href: '/browse', label: 'Browse' },
    { href: '/leaderboards', label: 'Leaderboards' },
  ];

  // Check if we're on the landing page (show transparent nav)
  const isLanding = pathname === '/';

  return (
    <>
      <header
        className={`sticky top-0 z-[50] mx-auto w-full px-5 md:px-12 ${
          isLanding ? 'mt-[41px] md:mt-[47px]' : ''
        } nav-aui`}
      >
        <div className="mx-auto h-full w-full">
          <div className="flex h-16 w-full items-center justify-between gap-6 lg:h-20">
            {/* Logo */}
            <div className="flex flex-1 items-center gap-2">
              <Link href="/" className="flex items-center gap-2 group" aria-label="Back to Home">
                <div className="flex h-[33px] w-[33px] items-center justify-center rounded border border-mist/20 bg-space text-mist transition-colors group-hover:border-mist/40">
                  <span className="text-sm font-extrabold tracking-wider">PV</span>
                </div>
                <span className="hidden text-[15px] font-bold tracking-tight text-mist sm:inline">
                  Play<span className="text-fire">Verse</span>
                </span>
              </Link>

              {/* Desktop nav links */}
              <nav className="ml-2 hidden flex-auto gap-2 md:flex">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-label={link.label}
                      className="relative block"
                    >
                      <div
                        className={`whitespace-nowrap border select-none inline-block rounded text-[15px] px-4 leading-[1] pt-[8px] pb-[9px] transition-colors duration-[400ms] ${
                          isActive
                            ? 'bg-fire text-mist border-fire'
                            : 'bg-eerie text-mist border-stroke-dark hover:bg-mist hover:text-space hover:border-space/10'
                        }`}
                      >
                        {link.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Controls */}
            <div className="hidden flex-1 justify-end md:flex items-center gap-2">
              {/* Quick Log Button */}
              {user && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-aui-fire cursor-pointer !py-[8px] !text-[14px]"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Log Title
                </button>
              )}

              {user ? (
                <div className="relative">
                  <div
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 rounded border border-stroke-dark bg-eerie p-1.5 pr-3 cursor-pointer transition-all hover:border-mist/20"
                  >
                    {/* XP pill */}
                    <div className="rounded bg-fire text-mist font-bold text-xs px-2.5 py-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 fill-mist/80" />
                      <span>{userXP} XP</span>
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-mist leading-none">
                        {user.displayName}
                      </span>
                      <span className="text-[10px] font-serif-accent italic text-mist/50 mt-0.5">
                        Lvl {userLevel}
                      </span>
                    </div>
                  </div>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-stroke-dark bg-eerie p-2 shadow-2xl z-50">
                      <div className="px-3 py-2 border-b border-stroke-dark mb-1">
                        <p className="text-[10px] font-serif-accent italic text-mist/50">Signed in as</p>
                        <p className="text-sm font-bold text-mist truncate">{user.displayName}</p>
                        <p className="text-[10px] text-mist/40 truncate">{user.email}</p>
                        <p className="text-xs text-fire font-bold mt-0.5">{user.totalScore} Total XP</p>
                      </div>

                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-mist rounded hover:bg-mist/5 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-fire" />
                        <span>View Profile</span>
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-fire rounded hover:bg-fire/10 transition-colors border-t border-stroke-dark mt-1 pt-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/sign-in" className="btn-aui-secondary !py-[8px] !text-[14px]">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <div
              className="flex h-[36px] w-[36px] items-center justify-center rounded border border-stroke-dark bg-eerie md:hidden cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4 text-mist" /> : <Menu className="w-4 h-4 text-mist" />}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="flex flex-col gap-2 border-t border-stroke-dark bg-space py-4 md:hidden">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded transition-colors ${
                    isActive
                      ? 'bg-fire text-mist'
                      : 'text-mist/70 hover:text-mist hover:bg-eerie'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-fire cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Log Title
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-mist/50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-fire"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Global Quick Log Entry Modal */}
      {isModalOpen && (
        <LogEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            refreshSession();
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
