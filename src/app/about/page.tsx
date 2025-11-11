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
            Your go-to source for Oklahoma City business developments, openings, and growth stories.
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
            We bring together stories from across the OKC business landscape and deliver them in one simple feed. 
            No clutter, no noise—just what matters for Oklahoma City.
          </p>
        </div>
      </section>

      {/* Why OKC Needs This */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Oklahoma City?</h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Oklahoma City is growing fast. New businesses are opening, major developments are breaking ground, 
              and investment is pouring into the metro area.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              But keeping up with all that growth? That's the hard part. Business news is scattered across 
              local publications, industry sites, and city channels. It's easy to miss something important.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              DealSprints OKC solves that. One feed. All the OKC business news that matters. Updated regularly.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Who Uses DealSprints OKC</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Real Estate Pros</h4>
              <p className="text-gray-600 text-sm">
                Stay on top of new developments, commercial deals, and market shifts in OKC.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Business Owners</h4>
              <p className="text-gray-600 text-sm">
                Track local trends, see what's opening, and spot opportunities in the OKC market.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">OKC Enthusiasts</h4>
              <p className="text-gray-600 text-sm">
                Anyone who loves Oklahoma City and wants to follow its growth and transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Value Prop */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>1. We curate:</strong> We find the most relevant OKC business news from multiple sources.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>2. You browse:</strong> Read it in one simple feed—no tab-hopping required.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>3. Stay informed:</strong> Keep up with what's happening in Oklahoma City without the hassle.
            </p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/okc/feed"
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              View Feed
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white/20 backdrop-blur-lg border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/30 transition-all"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
