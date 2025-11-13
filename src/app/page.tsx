import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GetStartedButton } from '@/components/home/GetStartedButton';
import { TrendingUp, Clock, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Get total count for stats
  const { count: publishedCount } = await supabase
    .from('scraped_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .gte('published_at', thirtyDaysAgo.toISOString());

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Premium Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#4338ca] via-[#7c3aed] to-[#2563eb]">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
            backgroundSize: '48px 48px',
          }} />
          
          <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo */}
            <div className="mb-16 animate-fade-in">
              <img 
                src="/logo.png" 
                alt="DealSprints" 
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto object-contain drop-shadow-2xl"
              />
            </div>
            
            {/* Main Headline - Benefit-Focused */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
              Never Miss an OKC Deal
            </h1>
            
            {/* Subheading - Clear Promise */}
            <p className="text-2xl md:text-3xl text-white/95 mb-10 leading-relaxed font-light max-w-4xl mx-auto">
              Every new development, opening, and opportunity in Oklahoma City—delivered in one simple feed.
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-3 text-white/90 text-lg mb-12">
              <CheckCircle className="w-6 h-6" />
              <span><strong>{publishedCount || 0}+ stories</strong> in the past month</span>
            </div>

            {/* Value Props - Benefit-Focused */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Clock className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold text-lg mb-2">Save Hours Weekly</h3>
                <p className="text-white/80 text-sm">Stop checking multiple sites</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Zap className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold text-lg mb-2">Spot Opportunities</h3>
                <p className="text-white/80 text-sm">See deals before others</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <TrendingUp className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold text-lg mb-2">Stay Ahead</h3>
                <p className="text-white/80 text-sm">Know OKC like an insider</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-8">
              <Link
                href="/okc/feed"
                className="group px-10 py-5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-2xl text-lg w-full sm:w-auto flex items-center justify-center gap-3"
              >
                Browse Feed Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Signal */}
            <p className="text-white/70 text-sm">
              Browse free • No signup required • Upgrade anytime for $9/month
            </p>
          </div>
        </div>
      </div>

      {/* Trust Signals Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Trusted by OKC Professionals
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Real estate agents, investors, and business owners rely on DealSprints to stay informed about Oklahoma City's growth.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">{publishedCount || 0}+</div>
              <p className="text-gray-600">Stories this month</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">2 min</div>
              <p className="text-gray-600">Daily reading time</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">100%</div>
              <p className="text-gray-600">OKC-focused</p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/okc/feed"
            className="inline-flex items-center gap-2 px-10 py-5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg text-lg"
          >
            View Feed
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>


      <Footer />
    </main>
  );
}
