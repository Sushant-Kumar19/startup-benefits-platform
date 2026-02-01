'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import type { Deal } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { DealsListSkeleton } from '@/components/Loading';

const categories = Object.entries(CATEGORY_LABELS);
const accessLevels = [
  { value: '', label: 'All' },
  { value: 'unlocked', label: 'Open' },
  { value: 'locked', label: 'Restricted' },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [accessLevel, setAccessLevel] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const { deals: list } = await api.deals.list({
        category: category || undefined,
        accessLevel: accessLevel || undefined,
        search: search || undefined,
      });
      setDeals(list);
    } catch (err) {
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [category, accessLevel, search]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-bold text-[var(--text)] sm:text-3xl">
            Available deals
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Browse and claim exclusive SaaS benefits for startups.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-card">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 min-w-[180px]">
            <input
              type="search"
              placeholder="Search deals..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="ml-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
            >
              Search
            </button>
          </form>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-primary-500 focus:outline-none"
          >
            <option value="">All categories</option>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-primary-500 focus:outline-none"
          >
            {accessLevels.map(({ value, label }) => (
              <option key={value || 'all'} value={value}>
                {label}
              </option>
            ))}
          </select>
          {(category || accessLevel || search) && (
            <button
              type="button"
              onClick={() => {
                setCategory('');
                setAccessLevel('');
                setSearch('');
                setSearchInput('');
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--border)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <DealsListSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            {deals.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-12 text-center"
              >
                <p className="text-sm text-[var(--text-muted)]">
                  No deals match your filters. Try adjusting search or filters.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {deals.map((deal, i) => (
                  <DealCard key={deal._id} deal={deal} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function DealCard({ deal, index }: { deal: Deal; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group"
    >
      <Link href={`/deals/${deal._id}`}>
        <article
          className={`card-hover h-full rounded-lg border border-l-0 border-[var(--border)] bg-[var(--bg-card)] p-5 ${
            deal.isLocked ? 'border-amber-200 dark:border-amber-800/50' : ''
          }`}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
              {CATEGORY_LABELS[deal.category] || deal.category}
            </span>
            {deal.isLocked && (
              <span className="flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                <span aria-hidden>🔒</span> Restricted
              </span>
            )}
          </div>
          <h2 className="mb-1.5 font-semibold text-[var(--text)] line-clamp-1">
            {deal.title}
          </h2>
          <p className="mb-3 line-clamp-2 text-sm text-[var(--text-muted)]">
            {deal.description}
          </p>
          <p className="text-xs font-medium text-[var(--text-muted)]">
            {deal.partnerName}
          </p>
          {deal.discountInfo && (
            <p className="mt-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
              {deal.discountInfo}
            </p>
          )}
        </article>
      </Link>
    </motion.div>
  );
}
