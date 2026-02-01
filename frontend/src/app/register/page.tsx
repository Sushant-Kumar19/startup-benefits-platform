'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    router.push('/deals');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      router.push('/deals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold text-[var(--text)]">Create account</h1>
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          Sign up to browse and claim exclusive startup deals.
        </p>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-2.5 text-sm text-red-800 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}
          <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">
            Password (min 6 characters)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="mb-5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
