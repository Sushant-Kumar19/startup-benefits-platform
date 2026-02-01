'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/deals', label: 'Deals' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Nav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-[var(--text)] transition hover:text-[var(--accent)]"
        >
          Startup Benefits
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] dark:hover:bg-[var(--surface)]'
                }`}
              >
                {label}
              </Link>
            );
          })}
          {!loading && (
            <>
              {user ? (
                <div className="ml-2 flex items-center gap-2 border-l border-[var(--border)] pl-2">
                  <span className="hidden text-sm text-[var(--text-muted)] sm:inline">
                    {user.name}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--border)]"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="ml-2 flex gap-1 border-l border-[var(--border)] pl-2">
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
