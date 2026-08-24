'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Firebase
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;

      // 2. Sync session with our backend (creates/syncs Prisma user + sets cookie)
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || email.split('@')[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      // Navigate smoothly to homepage with full session reload
      window.location.href = '/';
    } catch (err: any) {
      // Map Firebase error codes to user-friendly messages
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(err.message || 'Sign in failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8 card-aui p-8 bg-eerie border border-stroke-dark rounded-xl">
        <div className="text-center space-y-2">
          <span className="text-aui-eyebrow">[ USER AUTHENTICATION ]</span>
          <h1 className="text-3xl font-extrabold text-mist font-display">Welcome Back</h1>
          <p className="text-xs text-mist/60 font-serif-accent italic">Sign in to your PlayVerse account & sync XP</p>
        </div>

        {error && (
          <div className="p-3.5 bg-fire/15 border border-fire/40 text-fire text-xs font-bold rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-mist uppercase tracking-wider mb-1.5 font-display">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-mist/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-space border border-stroke-dark focus:border-fire pl-10 pr-4 py-3 text-sm text-mist focus:outline-none rounded-md transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-mist uppercase tracking-wider mb-1.5 font-display">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-mist/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-space border border-stroke-dark focus:border-fire pl-10 pr-4 py-3 text-sm text-mist focus:outline-none rounded-md transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-aui-fire text-sm py-3.5 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer rounded-md"
          >
            {isLoading ? (
              'Signing In...'
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-mist/60 font-serif-accent italic">
          Don't have an account?{' '}
          <Link href="/auth/sign-up" className="text-fire hover:underline font-bold font-sans">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
