'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Lock, Sparkles, CheckCircle } from 'lucide-react';

export function PaywallCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Check if user is logged in
      const { session } = await getSession();
      
      if (session) {
        // Logged in → Create checkout with user info
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: 'price_1SRHGN2fq8sWUTjaxi9dnPsT',
            memberEmail: session.user.email,
            userId: session.user.id,
          }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      } else {
        // Not logged in → Create checkout without user (Stripe collects email)
        const response = await fetch('/api/stripe/checkout-anonymous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: 'price_1SRHGN2fq8sWUTjaxi9dnPsT',
          }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
      
      throw new Error('No checkout URL returned');
    } catch (err: any) {
      console.error('Unlock error:', err);
      setError('Unable to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-12 text-center text-white">
          {/* Lock Icon */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-bold mb-4">
            Unlock Unlimited OKC Development News
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get unlimited access to every OKC development story for just $9/month
          </p>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">18 Premium Sources</h3>
              <p className="text-sm text-white/80">Journal Record, OCBJ, NonDoc & more</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Regular Updates</h3>
              <p className="text-sm text-white/80">Fresh posts added daily</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Full Archive</h3>
              <p className="text-sm text-white/80">Browse past 30 days</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <div className="text-6xl font-bold mb-2">$9</div>
            <div className="text-xl text-white/80">per month</div>
            <div className="text-sm text-white/60 mt-2">Cancel anytime</div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleUnlock}
            disabled={isLoading}
            className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              'Unlock Unlimited Access - $9/month'
            )}
          </button>
          
          <p className="text-sm text-white/70 mt-4">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
