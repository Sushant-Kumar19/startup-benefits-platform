'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Claim } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Skeleton } from '@/components/Loading';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    if (!user) return;
    api.claims
      .list()
      .then(({ claims: list }) => setClaims(list))
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="mb-8 h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-bold text-[var(--text)]">Your dashboard</h1>
          <p className="text-sm text-[var(--text-muted)]">Profile and claimed deals.</p>
        </div>

        {/* Profile */}
        <section className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">Profile</h2>
          <dl className="grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Name</dt>
              <dd className="font-medium text-[var(--text)]">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Email</dt>
              <dd className="font-medium text-[var(--text)]">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Verification</dt>
              <dd>
                <span
                  className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                    user.verified
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-[var(--surface)] text-[var(--text-muted)]'
                  }`}
                >
                  {user.verified ? 'Verified' : 'Not verified'}
                </span>
              </dd>
            </div>
          </dl>
          {!user.verified && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Restricted deals require a verified account. Contact support to verify your startup.
            </p>
          )}
        </section>

        {/* Claimed deals */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">Claimed deals</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center shadow-card">
              <p className="mb-3 text-sm text-[var(--text-muted)]">
                You haven&apos;t claimed any deals yet.
              </p>
              <Link
                href="/deals"
                className="inline-block rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
              >
                Browse deals
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {claims.map((claim) => (
                <li key={claim._id}>
                  <Link href={`/deals/${claim.deal._id}`}>
                    <article className="card-hover flex flex-wrap items-center justify-between gap-3 rounded-lg border border-l-0 border-[var(--border)] bg-[var(--bg-card)] p-3">
                      <div>
                        <h3 className="font-semibold text-[var(--text)] text-sm">
                          {claim.deal.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)]">
                          {claim.deal.partnerName} · {CATEGORY_LABELS[claim.deal.category] || claim.deal.category}
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyles[claim.status] || 'bg-[var(--surface)] text-[var(--text-muted)]'}`}
                      >
                        {claim.status}
                      </span>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
