import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { Post } from '@/lib/data/mockFeed';
import { FeedWithPaywall } from '@/components/feed/FeedWithPaywall';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Rss } from 'lucide-react';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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
  // SECURITY: Check user auth server-side to determine post limit
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if user has Pro plan
  let isPro = false;
  if (session) {
    const { data: member } = await supabaseAdmin
      .from('members')
      .select('plan')
      .eq('user_id', session.user.id)
      .single();
    
    isPro = member?.plan === 'member';
  }

  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // SECURITY: Limit posts based on user plan (server-side enforcement)
  // Free users get configurable limit (default 5), Pro users get unlimited
  const FREE_POST_LIMIT = parseInt(process.env.FREE_POST_LIMIT || '5', 10);
  const postLimit = isPro ? 100 : FREE_POST_LIMIT; // Pro users get 100, free users get configurable limit
  
  // Fetch published posts from Supabase
  const { data: scrapedPosts } = await supabaseAdmin
    .from('scraped_posts')
    .select('*')
    .eq('status', 'published')
    .gte('published_at', thirtyDaysAgo.toISOString())
    .order('published_at', { ascending: false })
    .limit(postLimit); // SERVER-SIDE LIMIT: Free users can't get more than 5 posts

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

        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <FeedWithPaywall allPosts={posts} freeLimit={FREE_POST_LIMIT} />
      </div>

      <Footer />
    </main>
  );
}
