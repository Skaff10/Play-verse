import Link from 'next/link';
import { Gamepad2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-[#1A1825] border border-[#2E2B40] text-[#4ECDC4] flex items-center justify-center">
        <Gamepad2 className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#FFFFFE] font-display">404 - Page Not Found</h1>
      <p className="text-xs text-[#94A1B2] max-w-sm font-serif-accent italic">
        The title or page you are looking for does not exist or has been removed from PlayVerse.
      </p>
      <Link
        href="/browse"
        className="agency-btn-primary inline-flex items-center gap-2 px-6 py-3 text-xs font-bold transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Browse Catalog</span>
      </Link>
    </div>
  );
}
