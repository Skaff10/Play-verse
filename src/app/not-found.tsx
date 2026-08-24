import Link from 'next/link';
import { Gamepad2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-eerie border border-stroke-dark text-fire flex items-center justify-center shadow-lg">
        <Gamepad2 className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-mist font-display">404 - Page Not Found</h1>
      <p className="text-xs text-mist/60 max-w-sm font-serif-accent italic">
        The title or page you are looking for does not exist or has been removed from PlayVerse.
      </p>
      <Link
        href="/browse"
        className="btn-aui-fire inline-flex items-center gap-2 px-6 py-3 text-xs font-bold transition-all rounded-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Browse Catalog</span>
      </Link>
    </div>
  );
}
