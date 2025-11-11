import { supabase } from '@/lib/supabase';
import { Post } from '@/lib/data/mockFeed';
import { FeedCard } from '@/components/feed/FeedCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Rss, CheckCircle, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Fetch recent published posts from Supabase (last 30 days, limit to 3 for preview)
  const { data: scrapedPosts } = await supabase
    .from('scraped_posts')
    .select('*')
    .eq('status', 'published')
    .gte('published_at', thirtyDaysAgo.toISOString())
    .order('published_at', { ascending: false })
    .limit(3);

  // Transform to Post format
  const recentPosts: Post[] = (scrapedPosts || []).map(p => ({
    id: p.id,
    kind: (p.ai_category || 'opening') as Post['kind'],
    title: p.scraped_title,
    location: p.ai_location || 'Oklahoma City, OK',
    date: p.published_at || p.scraped_date,
    summary: p.ai_summary,
    source: p.source_name,
    sourceUrl: p.source_url,
    tags: p.ai_tags || [],
    imageUrl: p.photo_url || undefined,
  }));
  
  // Get stats
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
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
            backgroundSize: '48px 48px',
          }} />
          
          {/* Gradient orbs */}
          <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="text-center max-w-5xl mx-auto">
            {/* Extra Large Centered Logo */}
            <div className="mb-16 animate-fade-in">
              <img 
                src="/logo.png" 
                alt="DealSprints" 
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto object-contain drop-shadow-2xl"
              />
            </div>
            
            {/* Main heading */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
              OKC Development News
            </h1>
            
            {/* Subheading */}
            <p className="text-2xl md:text-3xl text-white/95 mb-10 leading-relaxed font-light max-w-4xl mx-auto">
              Stay ahead with curated business news from 18 premium Oklahoma City sources.
            </p>

            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Rss className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold text-lg mb-2">18 Premium Sources</h3>
                <p className="text-white/80 text-sm">Journal Record, OCBJ, NonDoc, i2E & more</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Zap className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold text-lg mb-2">Daily at 6am</h3>
                <p className="text-white/80 text-sm">Fresh development news every morning</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <TrendingUp className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold text-lg mb-2">AI-Curated</h3>
                <p className="text-white/80 text-sm">Only the most relevant OKC updates</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
              <Link
                href="/okc/feed"
                className="group px-10 py-5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-2xl text-lg w-full sm:w-auto flex items-center justify-center gap-3"
              >
                Browse Feed
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="px-10 py-5 bg-white/15 backdrop-blur-lg border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/25 transition-all shadow-2xl text-lg w-full sm:w-auto"
              >
                See Pricing
              </Link>
            </div>

            {/* Social Proof */}
            <div className="text-white/80 text-sm">
              <p className="mb-2">Join OKC professionals staying ahead</p>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{publishedCount || 0} posts in the last 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Preview */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest Updates
            </h2>
            <p className="text-xl text-gray-600">
              Here's what's happening in OKC right now
            </p>
          </div>

          {/* Show 3 recent posts */}
          <div className="space-y-8">
            {recentPosts.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>

          {/* CTA to view more */}
          <div className="text-center mt-12">
            <Link
              href="/okc/feed"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg text-lg"
            >
              View All Posts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Simple Pricing Teaser */}
      <div className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-12 md:p-16 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Unlock Unlimited Access
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Free users get 5 posts. Pro members get unlimited access to every OKC development story.
              </p>

              {/* Simple Pricing */}
              <div className="mb-8">
                <div className="text-7xl font-bold mb-2">$9</div>
                <div className="text-2xl text-white/80">per month</div>
                <div className="text-sm text-white/60 mt-2">Cancel anytime</div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span>Unlimited posts</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span>Full archive access</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span>Daily updates</span>
                </div>
              </div>

              <Link
                href="/pricing"
                className="inline-block px-10 py-5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg text-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
