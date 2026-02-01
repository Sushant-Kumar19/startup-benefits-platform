import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';
import { Nav } from '../components/Nav';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Startup Benefits | Exclusive SaaS Deals for Founders',
  description:
    'Exclusive deals and benefits on SaaS products for startup founders, early-stage teams, and indie hackers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)] antialiased">
        <AuthProvider>
          <Nav />
          <main className="min-h-[50vh] border-t border-[var(--border)]">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
