/**
 * Content Quality Testing Tool
 * Reviews recent posts from November to verify:
 * - System is working correctly
 * - AI insights are high quality
 * - Sources are legal
 * - Content is original (not rewrites)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface PostQuality {
  id: string;
  source_name: string;
  scraped_title: string;
  ai_summary: string;
  ai_category: string;
  ai_location: string;
  ai_tags: string[];
  scraped_date: string;
  created_at: string;
  data_type?: string;
  quality_score?: number;
  issues?: string[];
}

/**
 * Analyze post quality
 */
function analyzePostQuality(post: any): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  // Check for original insight (not just a rewrite)
  if (post.ai_summary && post.ai_summary.length < 50) {
    issues.push('Summary too short');
    score -= 20;
  }

  if (post.ai_summary && (
    post.ai_summary.toLowerCase().includes('rewrite') ||
    post.ai_summary.toLowerCase().includes('according to')
  )) {
    issues.push('May be a rewrite, not original insight');
    score -= 30;
  }

  // Check for OKC-specific details
  if (!post.ai_location || post.ai_location === 'Oklahoma City, OK') {
    issues.push('Generic location - could be more specific');
    score -= 10;
  }

  // Check for business implications
  if (post.ai_summary && !post.ai_summary.toLowerCase().includes('opportunity') &&
      !post.ai_summary.toLowerCase().includes('business') &&
      !post.ai_summary.toLowerCase().includes('development')) {
    issues.push('Missing business/opportunity context');
    score -= 10;
  }

  // Check for copyrighted sources
  const copyrightedSources = [
    'Journal Record',
    'The Oklahoman',
    'OKC Friday',
    'NonDoc',
    'Business Journal',
    'Oklahoma Gazette'
  ];
  
  if (copyrightedSources.some(s => post.source_name.includes(s))) {
    issues.push('⚠️ COPYRIGHTED SOURCE - Should be removed');
    score -= 50;
  }

  // Check data completeness
  if (!post.ai_summary) {
    issues.push('Missing AI summary');
    score -= 30;
  }

  if (!post.ai_category) {
    issues.push('Missing category');
    score -= 10;
  }

  return { score: Math.max(0, score), issues };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || '11'; // November
    const year = searchParams.get('year') || '2025';

    console.log(`🔍 Analyzing content quality for ${month}/${year}...`);

    // Calculate date range
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    // Fetch all posts from November
    const { data: posts, error } = await supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        error: 'Failed to fetch posts',
        details: error.message,
      }, { status: 500 });
    }

    // Analyze quality
    const analyzedPosts: PostQuality[] = (posts || []).map(post => {
      const quality = analyzePostQuality(post);
      return {
        id: post.id,
        source_name: post.source_name,
        scraped_title: post.scraped_title,
        ai_summary: post.ai_summary,
        ai_category: post.ai_category,
        ai_location: post.ai_location,
        ai_tags: post.ai_tags || [],
        scraped_date: post.scraped_date,
        created_at: post.created_at,
        data_type: post.data_type,
        quality_score: quality.score,
        issues: quality.issues,
      };
    });

    // Group by source
    const bySource: Record<string, { count: number; avgScore: number; posts: PostQuality[] }> = {};
    analyzedPosts.forEach(post => {
      if (!bySource[post.source_name]) {
        bySource[post.source_name] = { count: 0, avgScore: 0, posts: [] };
      }
      bySource[post.source_name].count++;
      bySource[post.source_name].avgScore += post.quality_score || 0;
      bySource[post.source_name].posts.push(post);
    });

    // Calculate averages
    Object.keys(bySource).forEach(source => {
      bySource[source].avgScore = Math.round(
        bySource[source].avgScore / bySource[source].count
      );
    });

    // Overall stats
    const totalPosts = analyzedPosts.length;
    const avgQualityScore = totalPosts > 0
      ? Math.round(analyzedPosts.reduce((sum, p) => sum + (p.quality_score || 0), 0) / totalPosts)
      : 0;

    const legalSources = analyzedPosts.filter(p => {
      const copyrighted = ['Journal Record', 'Oklahoman', 'OKC Friday', 'NonDoc', 'Business Journal', 'Gazette'];
      return !copyrighted.some(c => p.source_name.includes(c));
    });

    const copyrightedPosts = analyzedPosts.filter(p => {
      const copyrighted = ['Journal Record', 'Oklahoman', 'OKC Friday', 'NonDoc', 'Business Journal', 'Gazette'];
      return copyrighted.some(c => p.source_name.includes(c));
    });

    // Sample high-quality posts
    const highQualityPosts = analyzedPosts
      .filter(p => (p.quality_score || 0) >= 80)
      .slice(0, 5);

    // Sample posts with issues
    const postsWithIssues = analyzedPosts
      .filter(p => (p.issues?.length || 0) > 0)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      period: {
        month: parseInt(month),
        year: parseInt(year),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary: {
        totalPosts,
        avgQualityScore,
        legalPosts: legalSources.length,
        copyrightedPosts: copyrightedPosts.length,
        highQualityCount: analyzedPosts.filter(p => (p.quality_score || 0) >= 80).length,
        issuesCount: analyzedPosts.filter(p => (p.issues?.length || 0) > 0).length,
      },
      bySource,
      samples: {
        highQuality: highQualityPosts,
        withIssues: postsWithIssues,
      },
      allPosts: analyzedPosts,
    });

  } catch (error) {
    console.error('Quality test error:', error);
    return NextResponse.json({
      error: 'Quality test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

