'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getMemberProfile, signOut, type Member } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Mail, Crown, CheckCircle, LogOut, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
      try {
        const { session } = await getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        const memberData = await getMemberProfile(session.user.id);
        
        if (!memberData) {
          console.error('No member profile found');
          return;
        }

        setMember(memberData);
      } catch (error) {
        console.error('Error loading member:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMember();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your profile.</p>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Sign Out
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const isPro = member.plan === 'member';

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your subscription and view your access level</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Subscription Status Card */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isPro ? 'Pro Member' : 'Free Preview'}
                  </h2>
                  {isPro && <Crown className="w-6 h-6 text-yellow-500" />}
                </div>
                <p className="text-gray-600">
                  {isPro 
                    ? 'You have unlimited access to all OKC development news'
                    : 'You can view up to 5 posts. Upgrade for unlimited access.'
                  }
                </p>
              </div>
            </div>

            {/* Current Plan Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-900">
                  {isPro ? 'Pro - $9/month' : 'Free - $0/month'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Access Level</span>
                <span className="font-semibold text-gray-900">
                  {isPro ? 'Unlimited Posts' : '5 Posts Only'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900">
                  {new Date(member.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Status</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">Active</span>
                </div>
              </div>
            </div>

            {/* Upgrade CTA (if free) */}
            {!isPro && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Upgrade to Pro</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Get unlimited access to all OKC business development news, full archive, and regular updates.
                </p>
                <button
                  onClick={async () => {
                    // Go straight to Stripe checkout
                    try {
                      const { session } = await getSession();
                      if (!session) return;

                      const response = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          priceId: 'price_1SRHGN2fq8sWUTjaxi9dnPsT',
                          memberEmail: session.user.email,
                          memberId: member?.id,
                          userId: session.user.id,
                        }),
                      });

                      const data = await response.json();
                      if (data.url) {
                        window.location.href = data.url;
                      }
                    } catch (error) {
                      console.error('Upgrade error:', error);
                    }
                  }}
                  className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  Upgrade Now - $9/month
                </button>
              </div>
            )}

            {/* View Feed Button */}
            <Link
              href="/okc/feed"
              className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Browse Feed
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-600">Email</p>
                </div>
                <p className="text-sm font-medium text-gray-900 break-words">
                  {member.email}
                </p>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              
              <div className="space-y-2">
                <Link
                  href="/okc/feed"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  View Feed
                </Link>
                <Link
                  href="/pricing"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
