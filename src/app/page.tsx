import { MOCK_POSTS, getRecentPosts, getStats, getVerifiedMembers } from '@/lib/data/mockFeed';
import { FeedCard } from '@/components/feed/FeedCard';
import { MemberCard } from '@/components/members/MemberCard';
import { Footer } from '@/components/Footer';
import { Rss, Users, TrendingUp, Sparkles, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const recentPosts = getRecentPosts(6);
  const verifiedMembers = getVerifiedMembers().slice(0, 6);
  const stats = getStats();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand via-purple-600 to-brand">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4" />
              Oklahoma City's Pulse on Growth
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              OKC Pulse
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              The city's fast, visual feed of exciting developments, new business openings, 
              and a verified network of local entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/okc/feed"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl"
              >
                <Rss className="w-5 h-5" />
                Browse the Feed
              </Link>
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Join the Network
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Band */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand mb-2">{stats.totalPosts}</div>
              <div className="text-sm text-gray-600 font-medium">Pulse Updates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand mb-2">{stats.thisWeekPosts}</div>
              <div className="text-sm text-gray-600 font-medium">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand mb-2">{stats.totalMembers}</div>
              <div className="text-sm text-gray-600 font-medium">Network Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand mb-2">{stats.verifiedMembers}</div>
              <div className="text-sm text-gray-600 font-medium">Verified Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feed */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Rss className="w-6 h-6 text-brand" />
                <span className="text-sm font-semibold text-brand">LATEST UPDATES</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                OKC Pulse Feed
              </h2>
              <p className="text-xl text-gray-600 mt-2">
                Stay updated on Oklahoma City's latest developments and openings
              </p>
            </div>
            <Link
              href="/okc/feed"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors"
            >
              View All Updates
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Network Members Preview */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-6 h-6 text-brand" />
                <span className="text-sm font-semibold text-brand">VERIFIED MEMBERS</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                OKC Network
              </h2>
              <p className="text-xl text-gray-600 mt-2">
                Connect with Oklahoma City's verified business owners
              </p>
            </div>
            <Link
              href="/okc/members"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors"
            >
              View Directory
              <ArrowRight className="w-4 h-4" />
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors"
            >
              View All Members
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Join OKC Pulse?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed, get connected, and grow your business with Oklahoma City's most engaged network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Stay Ahead
              </h3>
              <p className="text-gray-600">
                Get real-time updates on developments, openings, and expansions before they hit mainstream news.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Get Connected
              </h3>
              <p className="text-gray-600">
                Join a verified network of local business owners, entrepreneurs, and decision-makers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Get Featured
              </h3>
              <p className="text-gray-600">
                Verified and Pro members get featured in the weekly digest reaching 1,000+ local business leaders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-brand to-purple-600">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to join OKC's most connected network?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Get verified, get featured, and grow your business with Oklahoma City's pulse on growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl"
              >
                Join the Waitlist
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/okc/feed"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                <Rss className="w-5 h-5" />
                Browse Feed
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">Weekly Digest</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">Verified Badge</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">Member Directory</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
