'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Deal } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { CardSkeleton } from '@/components/Loading';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.deals
      .get(id)
      .then(({ deal: d }) => setDeal(d))
      .catch(() => setDeal(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClaim = async () => {
    if (!user) {
      router.push(`/login?redirect=/deals/${id}`);
      return;
    }
    if (deal?.isLocked && !user.verified) {
      setError('This deal requires a verified account. Contact support to verify your account.');
      return;
    }
    setClaiming(true);
    setError(null);
    try {
      await api.claims.create(id);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim deal');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <CardSkeleton />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-[var(--text-muted)]">Deal not found.</p>
        <Link href="/deals" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Back to deals
        </Link>
      </div>
    );
  }

  const canClaim = !deal.isLocked || (user?.verified ?? false);
  const showLockedMessage = deal.isLocked && !user?.verified;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <Link
          href="/deals"
          className="mb-5 inline-flex items-center text-sm text-[var(--text-muted)] transition hover:text-primary-600 dark:hover:text-primary-400"
        >
          ← Back to deals
        </Link>

        <article className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-card">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
              {CATEGORY_LABELS[deal.category] || deal.category}
            </span>
            {deal.isLocked && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                🔒 Restricted — verification required
              </span>
            )}
          </div>

          <h1 className="mb-1 text-xl font-bold text-[var(--text)] sm:text-2xl">
            {deal.title}
          </h1>
          <p className="mb-5 text-sm text-[var(--text-muted)]">
            Partner: <strong className="text-[var(--text)]">{deal.partnerName}</strong>
          </p>

          <p className="mb-5 text-sm text-[var(--text)]">{deal.description}</p>

          {deal.discountInfo && (
            <div className="mb-5 rounded-lg bg-primary-100 p-3 dark:bg-primary-900/30">
              <p className="text-sm font-semibold text-primary-800 dark:text-primary-200">
                {deal.discountInfo}
              </p>
            </div>
          )}

          <h2 className="mb-1.5 text-sm font-semibold text-[var(--text)]">Benefits</h2>
          <ul className="mb-5 list-disc space-y-0.5 pl-4 text-sm text-[var(--text-muted)]">
            {deal.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          <h2 className="mb-1.5 text-sm font-semibold text-[var(--text)]">Eligibility</h2>
          <p className="mb-6 text-sm text-[var(--text-muted)]">
            {deal.eligibilityConditions}
          </p>

          {showLockedMessage && (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-900/20">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                This deal is restricted. Only verified accounts can claim it. Contact support to verify your startup.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/50 dark:bg-red-900/20">
              <p className="text-xs text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {canClaim && (
              <button
                type="button"
                onClick={handleClaim}
                disabled={claiming}
                className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
              >
                {claiming ? 'Claiming...' : 'Claim this deal'}
              </button>
            )}
            <Link
              href="/deals"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--border)]"
            >
              Back to deals
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
