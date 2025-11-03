import { Metadata } from 'next';
import { MOCK_POSTS } from '@/lib/data/mockFeed';
import { FeedList } from '@/components/feed/FeedList';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Rss, Send } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Feed - Latest OKC Developments & Openings | DealSprints OKC',
  description: 'Stay updated on Oklahoma City\'s latest business developments, grand openings, expansions, and market insights. Your pulse on OKC growth.',
  alternates: {
    canonical: 'https://dealsprints.com/okc/feed',
  },
  openGraph: {
    title: 'DealSprints OKC Feed - Latest Business News',
    description: 'Oklahoma City\'s latest developments, openings, and business wins.',
    url: 'https://dealsprints.com/okc/feed',
    siteName: 'DealSprints OKC',
    locale: 'en_US',
    type: 'website',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default function OKCFeedPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Rss className="w-6 h-6 text-brand" />
                <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-sm font-semibold rounded-full">
                  Live Feed
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                DealSprints OKC Feed
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Your source for Oklahoma City developments, new business openings, 
                expansions, and market insights. Updated weekly.
              </p>
            </div>
          </div>

          {/* CTA Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              Submit a Tip
            </Link>
            <Link
              href="/okc/members"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-brand hover:text-brand transition-colors"
            >
              View Member Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <FeedList posts={MOCK_POSTS} showFilters={true} />
      </div>

      {/* Bottom CTA */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Know about a development or opening?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Help us keep OKC Pulse accurate and complete. Submit tips on new projects, 
            business openings, expansions, or market data.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            Submit a Tip
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}

