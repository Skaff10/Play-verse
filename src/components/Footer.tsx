import Link from 'next/link';
import { ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-28 bg-[#1A1825] text-[#FFFFFE] pt-16 pb-12 border-t border-[#2E2B40]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#FF6B6B] text-[#FFFFFE] flex items-center justify-center font-extrabold text-sm tracking-wider rounded-xs">
                PV
              </div>
              <span className="font-extrabold text-lg tracking-tight font-display text-[#FFFFFE]">PlayVerse</span>
            </div>
            <p className="font-serif-accent italic text-xs text-[#94A1B2] leading-relaxed">
              "Every title experienced is a step recorded." The production-grade media ledger with Bayesian weighted precision.
            </p>
          </div>

          {/* XP Rules */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#FF6B6B]">XP Rewards</h4>
            <ul className="space-y-2 text-xs text-[#94A1B2]">
              <li className="flex items-center justify-between border-b border-[#2E2B40] pb-1">
                <span>In Progress</span>
                <span className="font-extrabold text-[#FF6B6B]">+2 XP</span>
              </li>
              <li className="flex items-center justify-between border-b border-[#2E2B40] pb-1">
                <span>Completed Title</span>
                <span className="font-extrabold text-[#FF6B6B]">+5 XP</span>
              </li>
              <li className="flex items-center justify-between border-b border-[#2E2B40] pb-1">
                <span>Rating & Review</span>
                <span className="font-extrabold text-[#FF6B6B]">+2 XP</span>
              </li>
              <li className="flex items-center justify-between border-b border-[#2E2B40] pb-1">
                <span>Replay / Rewatch</span>
                <span className="font-extrabold text-[#FF6B6B]">+1 XP</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#FF6B6B]">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#94A1B2]">
              <li><Link href="/dashboard" className="hover:text-[#4ECDC4] hover:underline transition-colors">User Dashboard</Link></li>
              <li><Link href="/library" className="hover:text-[#4ECDC4] hover:underline transition-colors">Personal Library</Link></li>
              <li><Link href="/browse" className="hover:text-[#4ECDC4] hover:underline transition-colors">Browse Catalog</Link></li>
              <li><Link href="/leaderboards" className="hover:text-[#4ECDC4] hover:underline transition-colors">Bayesian Leaderboards</Link></li>
            </ul>
          </div>

          {/* Anti-Gaming & Tech */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#FF6B6B]">Audit & Fairness</h4>
            <div className="space-y-2 text-xs text-[#94A1B2]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4ECDC4]" />
                <span>ACID Append-Only Ledger</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#4ECDC4]" />
                <span>Rate Limited & Anti-Spam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2E2B40] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A1B2]">
          <p>© 2026 PlayVerse Agency. Dark Coral Edition.</p>
          <p className="font-serif-accent italic">
            Crafted for enthusiasts with precision & clarity.
          </p>
        </div>
      </div>
    </footer>
  );
}
