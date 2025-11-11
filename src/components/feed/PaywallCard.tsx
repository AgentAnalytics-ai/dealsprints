'use client';

import Link from 'next/link';
import { Lock, Sparkles, CheckCircle } from 'lucide-react';

export function PaywallCard() {
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
            You've reached the free preview limit. Upgrade to Pro for unlimited access to every OKC development story.
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
              <h3 className="font-semibold mb-1">Daily Updates</h3>
              <p className="text-sm text-white/80">New posts every morning at 6am</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Full Archive</h3>
              <p className="text-sm text-white/80">Search & browse all past posts</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <div className="text-6xl font-bold mb-2">$9</div>
            <div className="text-xl text-white/80">per month</div>
            <div className="text-sm text-white/60 mt-2">Less than your daily coffee</div>
          </div>

          {/* CTA */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg text-lg"
            >
              Upgrade to Pro
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

