'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignUpPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Create Firebase account
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;

      // 2. Set display name in Firebase profile
      const finalName = displayName.trim() || email.split('@')[0];
      await updateProfile(firebaseUser, { displayName: finalName });

      // 3. Sync with our backend (create Prisma user + set session cookie)
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: finalName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Navigate smoothly to homepage with full session reload
      window.location.href = '/';
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Sign up failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8 agency-card p-8 bg-[#1A1825] border border-[#2E2B40]">
        <div className="text-center space-y-2">
          <span className="agency-badge text-xs font-bold uppercase">[ USER REGISTRATION ]</span>
          <h1 className="text-3xl font-extrabold text-[#FFFFFE] font-display">Create Account</h1>
          <p className="text-xs text-[#94A1B2] font-serif-accent italic">Join PlayVerse & start logging titles today</p>
        </div>

        {error && (
          <div className="p-3.5 bg-[#FF6B6B]/15 border border-[#FF6B6B]/40 text-[#FF6B6B] text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#FFFFFE] uppercase tracking-wider mb-1.5 font-display">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#94A1B2]" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="GamerTag / ScreenName"
                className="w-full bg-[#0F0E17] border border-[#2E2B40] focus:border-[#FF6B6B] pl-10 pr-4 py-3 text-sm text-[#FFFFFE] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFFFFE] uppercase tracking-wider mb-1.5 font-display">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#94A1B2]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-[#0F0E17] border border-[#2E2B40] focus:border-[#FF6B6B] pl-10 pr-4 py-3 text-sm text-[#FFFFFE] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFFFFE] uppercase tracking-wider mb-1.5 font-display">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#94A1B2]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••  (min. 6 characters)"
                className="w-full bg-[#0F0E17] border border-[#2E2B40] focus:border-[#FF6B6B] pl-10 pr-4 py-3 text-sm text-[#FFFFFE] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full agency-btn-primary text-sm py-3.5 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              'Creating Account...'
            ) : (
              <>
                <span>Create Account & Start Logging</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#94A1B2] font-serif-accent italic">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-[#4ECDC4] hover:underline font-bold font-sans">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
