'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Exclusive deals for founders
          </p>
          <h1 className="mb-5 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
            Premium SaaS tools.
            <br />
            <span className="text-primary-600 dark:text-primary-400">Startup prices.</span>
          </h1>
          <p className="mb-8 text-[var(--text-muted)] sm:text-lg">
            Early-stage startups often can&apos;t afford premium tools. We partner with top SaaS
            providers to bring you exclusive deals on cloud, marketing, analytics, and
            productivity.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/deals"
              className="inline-block rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
            >
              Explore deals
            </Link>
            <Link
              href="/register"
              className="inline-block rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-xl font-bold text-[var(--text)] sm:text-2xl">
            Why use Startup Benefits?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Curated deals', desc: 'Vetted SaaS partners. Deals that matter for early-stage teams.', icon: '✨' },
              { title: 'Public & restricted', desc: 'Open deals for all; some require verification for partner trust.', icon: '🔒' },
              { title: 'One dashboard', desc: 'Claim deals and track status. Pending, approved, or rejected.', icon: '📊' },
            ].map((block, i) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card-hover rounded-lg border border-[var(--border)] border-l-0 bg-[var(--bg-card)] p-5"
              >
                <span className="mb-2 block text-xl" aria-hidden>{block.icon}</span>
                <h3 className="mb-1.5 font-semibold text-[var(--text)]">{block.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{block.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-primary-600 px-6 py-10 text-center dark:bg-primary-700">
          <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
            Ready to unlock deals?
          </h2>
          <p className="mb-6 text-primary-100 text-sm">
            Sign up, browse deals, and claim the ones you&apos;re eligible for.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
          >
            Get started free
          </Link>
        </div>
      </section>
    </div>
  );
}
