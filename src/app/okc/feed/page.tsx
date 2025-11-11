import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Post } from '@/lib/data/mockFeed';
import { FeedWithPaywall } from '@/components/feed/FeedWithPaywall';
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

export default async function OKCFeedPage() {
  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Fetch published posts from Supabase (last 30 days only)
  const { data: scrapedPosts } = await supabase
    .from('scraped_posts')
    .select('*')
    .eq('status', 'published')
    .gte('published_at', thirtyDaysAgo.toISOString())
    .order('published_at', { ascending: false })
    .limit(100);

  // Transform to match Post interface
  const posts: Post[] = (scrapedPosts || []).map(p => ({
    id: p.id,
    kind: (p.ai_category || 'opening') as Post['kind'],
    title: p.scraped_title,
    location: p.ai_location || 'Oklahoma City, OK',
    date: p.published_at || p.scraped_date,
    summary: p.ai_summary,
    source: p.source_name,
    sourceUrl: p.source_url,
    tags: p.ai_tags || [],
    imageUrl: p.photo_url || undefined,
  }));

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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              <Send className="w-5 h-5" />
              Submit a Tip
            </Link>
            <Link
              href="/okc/members"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:border-indigo-500 hover:scale-105 transition-all"
            >
              View Member Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <FeedWithPaywall allPosts={posts} freeLimit={5} />
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
          >
            <Send className="w-5 h-5" />
            Submit a Tip
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}

