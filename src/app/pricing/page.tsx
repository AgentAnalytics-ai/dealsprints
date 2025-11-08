'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getMemberProfile, type Member } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Check, X, Sparkles, BadgeCheck, Crown, AlertCircle, Building } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMember() {
      const { session } = await getSession();
      if (session) {
        const memberData = await getMemberProfile(session.user.id);
        setMember(memberData);
      }
    }
    loadMember();
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if logged in
      const { session } = await getSession();
      
      if (!session) {
        router.push('/signup');
        return;
      }

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          memberEmail: session.user.email,
          memberId: member?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }

    } catch (err) {
      console.error('Upgrade error:', err);
      setError('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold mb-4">
            <Sparkles className="w-5 h-5" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Join DealSprints OKC
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get verified, connect with Oklahoma City's business community, and grow your network
          </p>
        </div>

        {/* Billing Notice */}
        <div className="max-w-3xl mx-auto mb-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Building className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">About Billing</h3>
            <p className="text-sm text-blue-800">
              DealSprints OKC is operated by <strong>Agent Analytics LLC</strong>. 
              Your credit card statement will show <strong>"Agent Analytics LLC"</strong> — 
              this is our parent company that processes all billing for DealSprints. 
              Questions? Email us at <a href="mailto:billing@agentanalyticsai.com" className="underline">billing@agentanalyticsai.com</a>
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Browse and stay informed</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Read all feed posts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Browse member directory</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">No profile or listing</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Can't see member contact info</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">No verified badge</span>
              </li>
            </ul>

            <button
              onClick={() => router.push('/signup')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Sign Up Free
            </button>
          </div>

          {/* Member Tier */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl border-2 border-purple-400 p-8 text-white relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              POPULAR
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Member</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">$9</span>
                <span className="text-white/80">/month</span>
              </div>
              <p className="text-white/90">Get discovered and connect</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span>Everything in Free +</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Profile in directory</strong> (your digital business card)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Verified badge</strong> (builds trust & credibility)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>See contact info</strong> of all members</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Get discovered</strong> by local businesses</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span>Weekly email digest</span>
              </li>
            </ul>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {member?.plan === 'member' ? (
              <div className="w-full bg-white/20 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                Current Plan
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-6 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5" />
                    {member ? 'Upgrade Now' : 'Get Started'}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* FAQ / Additional Info */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Why will I see "Agent Analytics LLC" on my statement?</h3>
              <p className="text-gray-600">
                Agent Analytics LLC is the parent company that operates DealSprints OKC. 
                All billing and payment processing is handled through Agent Analytics LLC for legal and accounting purposes.
                This is normal and ensures secure, professional payment processing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! Cancel anytime from your dashboard. Your membership continues until the end of your billing period, 
                then automatically reverts to Free tier. No contracts, no hassle.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure 
                payment processor, Stripe. Your payment information is never stored on our servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">What's included in the verified badge?</h3>
              <p className="text-gray-600">
                The verified badge appears on your profile and in the member directory, signaling to other members 
                and visitors that you're a committed, active member of the OKC business community. It builds trust 
                and credibility for your business.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Questions? Email us at <a href="mailto:billing@agentanalyticsai.com" className="text-purple-600 hover:text-purple-700 font-semibold">billing@agentanalyticsai.com</a></p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

