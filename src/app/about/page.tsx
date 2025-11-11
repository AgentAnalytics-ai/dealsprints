import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Rss, Users, MapPin, BadgeCheck, TrendingUp, Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About DealSprints OKC | Oklahoma City's Business Network",
  description: "Learn about DealSprints OKC - your source for Oklahoma City developments, business openings, and a verified network of local entrepreneurs.",
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
            Your pulse on Oklahoma City's business community—stay informed, get discovered, and connect with local entrepreneurs.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            DealSprints OKC was created to solve a simple problem: it's hard to stay on top of what's happening 
            in Oklahoma City's business community. New developments, grand openings, expansions—they're scattered 
            across multiple sources and easy to miss.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We aggregate, curate, and deliver Oklahoma City's most important business news in one place, 
            while building a verified network of local business owners who want to connect, collaborate, and grow together.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What We Offer</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feed */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Rss className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Curated News Feed</h3>
              <p className="text-gray-600 leading-relaxed">
                Daily updates on Oklahoma City developments, business openings, expansions, and market insights. 
                AI-summarized for quick reading.
              </p>
            </div>

            {/* Directory */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Business Directory</h3>
              <p className="text-gray-600 leading-relaxed">
                Verified profiles of Oklahoma City business owners. Connect directly with peers, 
                discover partners, and build your local network.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local Focus</h3>
              <p className="text-gray-600 leading-relaxed">
                Hyper-focused on the OKC metro: Bricktown, Midtown, Plaza District, Edmond, Norman, 
                and everywhere in between. By locals, for locals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">We Aggregate</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our system monitors news sources, press releases, and public records for Oklahoma City 
                  business developments. AI helps us identify and summarize the most relevant stories.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">We Curate</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every post is reviewed by our team. We add professional photos, verify details, and ensure 
                  quality before publishing. No spam, no fluff—just valuable local intel.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">You Connect</h3>
                <p className="text-gray-600 leading-relaxed">
                  Members get verified profiles in our directory. Connect with other local business owners, 
                  find partners, and grow your network in Oklahoma City's tight-knit business community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Serve</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            DealSprints OKC is built for Oklahoma City business owners, commercial real estate professionals, 
            developers, investors, and anyone who needs to stay informed about local business activity.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-2">Business Owners</h3>
              <p className="text-gray-600">
                Stay ahead of market trends, discover partnership opportunities, and network with peers.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-2">Real Estate Professionals</h3>
              <p className="text-gray-600">
                Track new developments, identify opportunities, and connect with expanding businesses.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-2">Investors & Developers</h3>
              <p className="text-gray-600">
                Monitor market activity, spot trends early, and network with the local business community.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-2">Service Providers</h3>
              <p className="text-gray-600">
                Get discovered by businesses who need your services. Build credibility with a verified profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why DealSprints */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why DealSprints OKC</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <BadgeCheck className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Community</h3>
                <p className="text-gray-600">
                  All member profiles are verified. No spam, no fake accounts—just real Oklahoma City business owners.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <TrendingUp className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Current</h3>
                <p className="text-gray-600">
                  Our feed is updated daily with the latest OKC business news. Posts auto-archive after 30 days 
                  to keep content fresh and relevant.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Built by Locals</h3>
                <p className="text-gray-600">
                  We're Oklahoma City natives who care about our community. DealSprints OKC is operated by 
                  Agent Analytics LLC, a local technology company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-xl text-white/90 mb-8">
            Get verified, connect with Oklahoma City's business community, and stay ahead of the market.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/30 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
