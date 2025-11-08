import { supabase } from '@/lib/supabase';
import { MOCK_MEMBERS, getVerifiedMembers, getStats as getMockStats } from '@/lib/data/mockFeed';
import { Post } from '@/lib/data/mockFeed';
import { FeedCard } from '@/components/feed/FeedCard';
import { MemberCard } from '@/components/members/MemberCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Rss, Users, TrendingUp, Sparkles, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  // Fetch recent published posts from Supabase
  const { data: scrapedPosts } = await supabase
    .from('scraped_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);

  // Transform to Post format
  const recentPosts: Post[] = (scrapedPosts || []).map(p => ({
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

  const verifiedMembers = getVerifiedMembers().slice(0, 6);
  
  // Get stats (mix of real posts + mock members for now)
  const mockStats = getMockStats();
  const { count: publishedCount } = await supabase
    .from('scraped_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  
  const stats = {
    ...mockStats,
    totalPosts: publishedCount || mockStats.totalPosts,
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Premium Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#4338ca] via-[#7c3aed] to-[#2563eb]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
            backgroundSize: '48px 48px',
          }} />
          
          {/* Gradient orbs */}
          <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="text-center max-w-5xl mx-auto">
            {/* Extra Large Centered Logo */}
            <div className="mb-16 animate-fade-in">
              <img 
                src="/logo.png" 
                alt="DealSprints" 
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-full text-white text-sm font-semibold mb-10 shadow-2xl">
              <Sparkles className="w-5 h-5" />
              Oklahoma City's Business Growth Network
            </div>
            
            {/* Main heading with better spacing */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
              DealSprints OKC
            </h1>
            
            {/* Subheading with better readability */}
            <p className="text-2xl md:text-3xl text-white/95 mb-16 leading-relaxed font-light max-w-4xl mx-auto">
              Your pulse on Oklahoma City's latest developments, business openings, 
              and verified network of local entrepreneurs.
            </p>

            {/* Premium CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
              <Link
                href="/okc/feed"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl hover:shadow-3xl"
              >
                <Rss className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Browse the Feed
              </Link>
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/15 backdrop-blur-lg border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/25 transition-all shadow-2xl"
              >
                Join the Network
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Weekly updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Verified network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Premium Stats Band */}
      <div className="bg-white border-y border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {stats.totalPosts}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-semibold">Pulse Updates</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {stats.thisWeekPosts}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-semibold">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                {stats.totalMembers}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-semibold">Members</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
                {stats.verifiedMembers}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-semibold">Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feed */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs font-bold mb-4 shadow-lg">
                <Rss className="w-4 h-4" />
                LATEST UPDATES
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
                OKC Pulse Feed
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                Stay updated on Oklahoma City's latest developments and openings
              </p>
            </div>
            <Link
              href="/okc/feed"
              className="hidden md:inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {recentPosts.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>

          <div className="text-center md:hidden">
            <Link
              href="/okc/feed"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              View All Updates
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Network Members Preview */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-xs font-bold mb-4 shadow-lg">
                <Users className="w-4 h-4" />
                VERIFIED MEMBERS
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
                OKC Network
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                Connect with Oklahoma City's verified business owners
              </p>
            </div>
            <Link
              href="/okc/members"
              className="hidden md:inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              View Directory
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {verifiedMembers.map((member) => (
              <MemberCard key={member.slug} member={member} />
            ))}
          </div>

          <div className="text-center md:hidden">
            <Link
              href="/okc/members"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              View All Members
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative bg-gray-50 py-24 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Join DealSprints OKC?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto">
              Stay informed, get connected, and grow your business with Oklahoma City's most engaged network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Ahead
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Get real-time updates on developments, openings, and expansions before they hit mainstream news.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Connected
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Join a verified network of local business owners, entrepreneurs, and decision-makers.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Featured
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Verified and Pro members get featured in the weekly digest reaching 1,000+ local business leaders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Final CTA */}
      <div className="relative bg-gradient-to-br from-[#4338ca] via-[#7c3aed] to-[#2563eb] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
            backgroundSize: '48px 48px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Ready to join OKC's most connected network?
            </h2>
            <p className="text-2xl md:text-3xl text-white/95 mb-14 font-light">
              Get verified, get featured, and grow your business with Oklahoma City's pulse on growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl"
              >
                Join the Waitlist
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                href="/okc/feed"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/15 backdrop-blur-lg border-2 border-white/30 text-white rounded-2xl font-bold text-xl hover:bg-white/25 transition-all shadow-2xl"
              >
                <Rss className="w-6 h-6" />
                Browse Feed
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                <CheckCircle className="w-8 h-8 text-white mx-auto mb-3" />
                <p className="text-white text-base font-semibold">Weekly Digest</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                <CheckCircle className="w-8 h-8 text-white mx-auto mb-3" />
                <p className="text-white text-base font-semibold">Verified Badge</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                <CheckCircle className="w-8 h-8 text-white mx-auto mb-3" />
                <p className="text-white text-base font-semibold">Member Directory</p>
              </div>
            </div>
          </div>
        </div>
          </div>
      
      <Footer />
    </main>
  );
}
