'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession, getMemberProfile, type Member } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Check, X, Crown, AlertCircle, Building, Zap, Clock, TrendingUp } from 'lucide-react';

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
          priceId: 'price_1SRHGN2fq8sWUTjaxi9dnPsT',
          memberEmail: session.user.email,
          memberId: member?.id,
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      console.log('Checkout API response:', { status: response.status, data });

      if (!response.ok) {
        const errorMsg = data.details || data.error || 'Failed to create checkout';
        console.error('Checkout error:', errorMsg);
        throw new Error(errorMsg);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        console.log('Redirecting to Stripe:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (err: any) {
      console.error('Upgrade error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
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
            Simple Pricing
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Access Level
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed about Oklahoma City's latest business developments, openings, and market insights
          </p>
        </div>

        {/* Value Props - Why Pay? */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <Zap className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Save Time</h3>
            <p className="text-sm text-gray-600">All OKC business news in one place</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <Clock className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Stay Informed</h3>
            <p className="text-sm text-gray-600">Never miss important OKC developments</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Unlimited Access</h3>
            <p className="text-sm text-gray-600">Read as much as you want, whenever you want</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Preview</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Try before you commit</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Access to 5 most recent posts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">See latest OKC developments</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Limited to 5 posts only</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">No access to full archive</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Miss older opportunities</span>
              </li>
            </ul>

            <button
              onClick={() => router.push('/signup')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl border-2 border-purple-400 p-8 text-white relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              BEST VALUE
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro Access</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">$9</span>
                <span className="text-white/80">/month</span>
              </div>
              <p className="text-white/90">Complete market intelligence</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Unlimited posts</strong> — read everything</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Full archive</strong> — browse past 30 days</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Regular updates</strong> — fresh OKC news</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Multiple sources</strong> — comprehensive coverage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Cancel anytime</strong> — no commitment</span>
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
                <Check className="w-5 h-5" />
                Active Subscription
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
                    {member ? 'Upgrade to Pro' : 'Get Started'}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Billing Notice */}
        <div className="max-w-3xl mx-auto mb-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Building className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Billing Information</h3>
            <p className="text-sm text-blue-800">
              Subscriptions are processed by <strong>Agent Analytics LLC</strong> (our parent company). 
              Your statement will show "Agent Analytics LLC" for billing purposes. 
              Questions? Contact <a href="mailto:billing@agentanalyticsai.com" className="underline">billing@agentanalyticsai.com</a>
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">What do I get with Pro?</h3>
              <p className="text-gray-600">
                Pro members get unlimited access to all OKC business development posts—no limits. Free users can read 5 posts, 
                then hit a paywall. Pro unlocks everything, including the full 30-day archive.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! Cancel from your dashboard whenever you want. Your access continues until the end of your billing period, 
                then reverts to the Free tier. No contracts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards via Stripe. Your payment info is never stored on our servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Why does my statement show "Agent Analytics LLC"?</h3>
              <p className="text-gray-600">
                Agent Analytics LLC is the parent company that processes billing for DealSprints OKC. 
                This is standard practice for secure payment handling.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Questions? <Link href="/contact" className="text-purple-600 hover:text-purple-700 font-semibold">Contact Support</Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
