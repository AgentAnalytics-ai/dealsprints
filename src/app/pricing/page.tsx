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
            <p className="text-sm text-gray-600">We monitor 18 sources daily so you don't have to</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <Clock className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Stay Ahead</h3>
            <p className="text-sm text-gray-600">Get development news before your competitors</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Make Better Decisions</h3>
            <p className="text-sm text-gray-600">Access complete market intelligence in one place</p>
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
                <span><strong>Unlimited posts</strong> — never hit a limit</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Full 30-day archive</strong> — catch up on what you missed</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Daily updates at 6am</strong> — start your day informed</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>18 premium sources</strong> — Journal Record, OCBJ & more</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Searchable content</strong> — find specific developments</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span><strong>Cancel anytime</strong> — no long-term commitment</span>
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

        {/* ROI Calculator */}
        <div className="max-w-3xl mx-auto mb-16 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Is $9/month worth it?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Time saved per month:</p>
              <p className="text-3xl font-bold text-purple-600">15 hours</p>
              <p className="text-xs text-gray-500 mt-1">30 min/day × 30 days checking 18 sources</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Cost per day:</p>
              <p className="text-3xl font-bold text-purple-600">$0.30</p>
              <p className="text-xs text-gray-500 mt-1">Less than a cup of coffee</p>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-6">
            If even <strong>one deal opportunity</strong> comes from our intel, you've made your money back 100x.
          </p>
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
              <h3 className="font-semibold text-gray-900 mb-2">How do you get the news?</h3>
              <p className="text-gray-600">
                We monitor 18 premium Oklahoma City news sources daily, including Journal Record, Oklahoma City Business Journal, 
                NonDoc, i2E, and official city channels. Our team curates only the most relevant business development stories 
                for you, saving you hours of browsing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely! Cancel from your dashboard at any time. Your access continues until the end of your billing period, 
                then automatically reverts to the Free tier (5 posts). No contracts, no commitments, no hassle.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) via Stripe, 
                a trusted payment processor used by millions of businesses. Your payment info is never stored on our servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Why will my statement show "Agent Analytics LLC"?</h3>
              <p className="text-gray-600">
                Agent Analytics LLC is our parent company that handles all billing and payment processing for legal and 
                accounting purposes. This is standard practice and ensures secure, professional payment handling.
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
