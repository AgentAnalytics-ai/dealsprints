import { Metadata } from 'next';
import { MOCK_MEMBERS, getStats, getVerifiedMembers } from '@/lib/data/mockFeed';
import { MemberGrid } from '@/components/members/MemberGrid';
import { Users, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'OKC Network Members - Connect with Local Business Owners | DealSprints',
  description: 'Browse Oklahoma City\'s verified business owner directory. Connect with entrepreneurs, shop local, and grow your network.',
  alternates: {
    canonical: 'https://dealsprints.com/okc/members',
  },
  openGraph: {
    title: 'DealSprints OKC Network Members',
    description: 'Oklahoma City\'s directory of verified local business owners and entrepreneurs.',
    url: 'https://dealsprints.com/okc/members',
    siteName: 'DealSprints OKC',
    locale: 'en_US',
    type: 'website',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default function OKCMembersPage() {
  const stats = getStats();
  const verifiedMembers = getVerifiedMembers();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-6 h-6 text-brand" />
                <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-sm font-semibold rounded-full">
                  {stats.totalMembers} Members
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                DealSprints OKC Network
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Connect with Oklahoma City's most active business owners, entrepreneurs, 
                and local service providers. Get verified, get featured, get connected.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Members</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalMembers}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Verified Members</p>
                  <p className="text-2xl font-bold text-green-900">{stats.verifiedMembers}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Pulse Updates</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.totalPosts}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Directory */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <MemberGrid members={MOCK_MEMBERS} showFilters={true} />
      </div>

      {/* Join CTA */}
      <div className="bg-gradient-to-br from-brand to-purple-600">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Limited spots this month
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the OKC Network
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get verified, featured in the pulse feed, and connect with Oklahoma City's 
              most active entrepreneurs and business owners.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Free</h3>
                <p className="text-white/80 text-sm mb-3">Basic directory listing</p>
                <p className="text-3xl font-bold text-white">$0</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-left shadow-xl border-4 border-white/30">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Verified</h3>
                  <CheckCircle className="w-5 h-5 text-brand" />
                </div>
                <p className="text-gray-600 text-sm mb-3">Badge + enhanced profile</p>
                <p className="text-3xl font-bold text-gray-900">
                  $9<span className="text-base font-normal text-gray-600">/mo</span>
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
                <p className="text-white/80 text-sm mb-3">Featured in digest + events</p>
                <p className="text-3xl font-bold text-white">
                  $29<span className="text-base font-normal text-white/80">/mo</span>
                </p>
              </div>
            </div>

            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl"
            >
              Join the Waitlist
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

