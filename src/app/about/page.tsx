import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About DealSprints OKC | Oklahoma City Business News",
  description: "Your source for curated Oklahoma City business developments, openings, and market insights.",
  alternates: { 
    canonical: "https://dealsprints.com/about" 
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">About DealSprints OKC</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Your daily source for Oklahoma City business developments, openings, and growth stories.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is DealSprints OKC?</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            DealSprints OKC is a curated feed of Oklahoma City's most important business news—new developments, 
            grand openings, real estate deals, expansions, and market trends.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We monitor the Oklahoma City business landscape daily and deliver the most relevant stories in one simple feed. 
            No clutter, no noise—just what matters for OKC.
          </p>
        </div>
      </section>

      {/* Why OKC */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Oklahoma City Matters</h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Oklahoma City is experiencing tremendous growth. New businesses are opening, major developments are 
              breaking ground, and investment is transforming the metro area.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              But keeping up with all that activity? That's the challenge. Important news comes from multiple 
              publications, industry channels, and government sources. It's easy to miss something big.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              DealSprints OKC solves that. One feed. All the OKC business news that matters. Simple.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Who Reads DealSprints OKC</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Real Estate Professionals</h4>
              <p className="text-gray-600 text-sm">
                Track new developments, commercial deals, and market shifts across OKC.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Business Owners & Investors</h4>
              <p className="text-gray-600 text-sm">
                Monitor local trends, spot opportunities, and stay ahead of the OKC market.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">OKC Enthusiasts</h4>
              <p className="text-gray-600 text-sm">
                Anyone who loves Oklahoma City and wants to follow its growth story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Browse Free</h4>
                  <p className="text-gray-600">Browse free preview. See if you like it.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Unlock Everything</h4>
                  <p className="text-gray-600">Upgrade to Pro for $9/month. Get unlimited access instantly.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Stay Informed</h4>
                  <p className="text-gray-600">Check daily for new OKC developments. Cancel anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Browsing</h2>
          <p className="text-xl text-white/90 mb-8">
            See what's happening in Oklahoma City right now
          </p>
          <Link
            href="/okc/feed"
            className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg text-lg"
          >
            View Feed
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
