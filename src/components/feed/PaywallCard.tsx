'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Lock, Sparkles, CheckCircle, TrendingUp, Eye, ArrowRight, Zap } from 'lucide-react';

interface PaywallCardProps {
  lockedPostCount?: number;
  totalPosts?: number;
}

export function PaywallCard({ lockedPostCount = 0, totalPosts = 0 }: PaywallCardProps) {
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

  // Calculate locked posts (if not provided)
  const lockedCount = lockedPostCount > 0 ? lockedPostCount : Math.max(0, (totalPosts || 0) - 5);

  return (
    <div className="relative my-12">
      {/* Fade gradient overlay above paywall */}
      <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50 pointer-events-none z-0" />
      
      {/* Main Paywall Card */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-500/30">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative p-8 md:p-12 text-center text-white">
          {/* Lock Icon with pulse animation */}
          <div className="relative w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Lock className="w-10 h-10 text-white" />
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
          </div>

          {/* SCARCITY HEADLINE - Show what they're missing */}
          {lockedCount > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-300/30 mb-4">
                <Eye className="w-5 h-5 text-red-200" />
                <span className="text-lg font-bold text-red-100">
                  {lockedCount} More Posts Locked
                </span>
              </div>
              <p className="text-xl text-white/90 font-medium">
                You're missing out on <strong className="text-white">{lockedCount} OKC development stories</strong>
              </p>
            </div>
          )}

          {/* Main Headline - FOMO */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Don't Miss the Next Big Deal
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-2 max-w-3xl mx-auto font-medium">
            Unlock unlimited access to every OKC development story
          </p>
          
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Stay ahead of the competition. Know about openings, expansions, and deals before your competitors.
          </p>

          {/* Psychological Value Props */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-bold mb-2 text-lg">First-Mover Advantage</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Be first to know about new openings, expansions, and development deals
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-bold mb-2 text-lg">Premium Sources</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Curated news from trusted OKC business sources—all in one place
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all">
              <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-bold mb-2 text-lg">Daily Updates</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Fresh posts added daily. Never miss an opportunity again
              </p>
            </div>
          </div>

          {/* Social Proof Teaser */}
          <div className="mb-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 max-w-2xl mx-auto">
            <p className="text-sm text-white/80">
              <strong className="text-white">Smart OKC professionals</strong> use DealSprints to stay informed and find opportunities before anyone else.
            </p>
          </div>

          {/* Pricing - Loss Aversion */}
          <div className="mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-6xl md:text-7xl font-bold">$9</span>
              <span className="text-2xl text-white/80">/month</span>
            </div>
            <div className="text-lg text-white/90 mb-2 font-medium">
              Less than a coffee per week
            </div>
            <div className="text-sm text-white/70">
              Cancel anytime • No contracts • Instant access
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-300/30 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-red-100">{error}</p>
            </div>
          )}

          {/* CTA Button - Urgency */}
          <button
            onClick={handleUnlock}
            disabled={isLoading}
            className="group relative px-10 py-5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 hover:scale-105 transition-all shadow-2xl text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative flex items-center gap-3 justify-center">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Unlock All Posts Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>

          {/* Trust Signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Secure payment via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Instant access</span>
            </div>
          </div>

          {/* Bottom Teaser - What They're Missing */}
          {lockedCount > 0 && (
            <div className="mt-8 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 max-w-2xl mx-auto">
              <p className="text-sm text-white/80">
                <strong className="text-white">Right now, you're missing:</strong> {lockedCount} breaking news stories, business openings, and development updates that could change your game.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
