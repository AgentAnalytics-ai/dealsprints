import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Rss, Clock, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About DealSprints OKC | Oklahoma City Business News",
  description: "Learn about DealSprints OKC - your daily source for curated Oklahoma City business developments, openings, and market intelligence.",
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
            Oklahoma City's most comprehensive source for business development news—everything you need to stay ahead, delivered daily.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            DealSprints OKC was created to solve a simple but critical problem: staying informed about Oklahoma City's 
            business landscape shouldn't require checking 18 different sources every morning.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Business developments, grand openings, real estate deals, and market shifts are scattered across local news sites, 
            industry publications, and government channels. Missing even one story could mean missing a major opportunity.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We monitor all the sources that matter, curate only the most relevant OKC business news, and deliver it to you 
            every morning at 6am. One feed. Complete coverage. Zero hassle.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Monitor */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Rss className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Monitor 18 Sources</h3>
              <p className="text-gray-600 leading-relaxed">
                Every day, our team tracks Oklahoma City Business Journal, Journal Record, NonDoc, city government channels, 
                real estate news, and 13 other premium sources.
              </p>
            </div>

            {/* Curate */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Filter the Noise</h3>
              <p className="text-gray-600 leading-relaxed">
                Not every article is relevant. We curate only stories about OKC business developments, openings, 
                expansions, deals, and market trends that actually matter.
              </p>
            </div>

            {/* Deliver */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You Get It at 6am</h3>
              <p className="text-gray-600 leading-relaxed">
                Start your day informed. Fresh updates delivered every morning before the market opens. 
                Read at your pace, on any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Sources */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Sources</h2>
          <p className="text-center text-gray-600 mb-12">
            We monitor the most trusted Oklahoma City business and development sources:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">Premium Business News</h4>
              <ul className="mt-2 text-gray-600 text-sm space-y-1">
                <li>• The Journal Record (Real Estate, Finance, Energy, Construction, Tech, Healthcare, Retail)</li>
                <li>• Oklahoma City Business Journal</li>
                <li>• NonDoc</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">Innovation & Government</h4>
              <ul className="mt-2 text-gray-600 text-sm space-y-1">
                <li>• i2E (Oklahoma Innovation & Entrepreneurship)</li>
                <li>• City of OKC Official News</li>
                <li>• INCOG (Indian Nations Council of Governments)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">Development & Growth</h4>
              <ul className="mt-2 text-gray-600 text-sm space-y-1">
                <li>• OKC Economic Development</li>
                <li>• Metro Commercial Real Estate</li>
                <li>• Local construction & planning news</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">Community & Trends</h4>
              <ul className="mt-2 text-gray-600 text-sm space-y-1">
                <li>• Local business openings</li>
                <li>• Market trend analysis</li>
                <li>• Industry-specific updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Built This</h2>
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-purple-600">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>The founder of DealSprints OKC</strong> spent years as a real estate agent and business consultant 
              in Oklahoma City. Every morning started the same way: coffee in hand, opening 15+ browser tabs to check 
              Journal Record, OCBJ, city news, and a dozen other sites.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              It took 30-45 minutes just to <em>find</em> the news—before even reading it. That's <strong>15+ hours per month</strong> 
              of pure browsing time. Time that could've been spent calling clients, viewing properties, or closing deals.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              DealSprints OKC exists because <strong>your time is worth more than browsing tabs</strong>. We do the monitoring, 
              you get the intel. Simple as that.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Who Uses DealSprints OKC</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Real Estate Professionals</h4>
                <p className="text-gray-600 text-sm">
                  Agents, brokers, and investors who need to know about new developments, commercial deals, 
                  and market shifts before their competitors.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Business Owners</h4>
                <p className="text-gray-600 text-sm">
                  Entrepreneurs and operators tracking local market trends, competitor moves, 
                  and new business opportunities in OKC.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Economic Developers</h4>
                <p className="text-gray-600 text-sm">
                  Officials and consultants monitoring OKC's growth, tracking investments, 
                  and identifying development patterns.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Rss className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Investors & Analysts</h4>
                <p className="text-gray-600 text-sm">
                  Anyone making decisions based on Oklahoma City market intelligence who can't afford 
                  to miss critical development news.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Stay Informed?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join Oklahoma City professionals who start their day with DealSprints OKC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/okc/feed"
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Browse Feed
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
