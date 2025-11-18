/**
 * Quick Test: November Posts
 * Simple endpoint to see all November posts and verify system is working
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get November 2025 posts
    const startDate = new Date(2025, 10, 1); // November 1, 2025
    const endDate = new Date(2025, 10, 30, 23, 59, 59); // November 30, 2025

    console.log('🔍 Fetching November posts...');

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

    // Group by source
    const bySource: Record<string, any[]> = {};
    posts?.forEach(post => {
      if (!bySource[post.source_name]) {
        bySource[post.source_name] = [];
      }
      bySource[post.source_name].push(post);
    });

    // Check for copyrighted sources
    const copyrightedSources = ['Journal Record', 'Oklahoman', 'OKC Friday', 'NonDoc', 'Business Journal', 'Gazette'];
    const hasCopyrighted = posts?.some(p => copyrightedSources.some(c => p.source_name.includes(c)));

    // Sample posts
    const recentPosts = posts?.slice(0, 10) || [];

    return NextResponse.json({
      success: true,
      period: {
        month: 'November 2025',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary: {
        totalPosts: posts?.length || 0,
        sources: Object.keys(bySource).length,
        hasCopyrightedSources: hasCopyrighted,
      },
      bySource: Object.keys(bySource).map(source => ({
        source,
        count: bySource[source].length,
        isLegal: !copyrightedSources.some(c => source.includes(c)),
      })),
      recentPosts: recentPosts.map(p => ({
        id: p.id,
        title: p.scraped_title,
        source: p.source_name,
        summary: p.ai_summary,
        category: p.ai_category,
        location: p.ai_location,
        tags: p.ai_tags,
        date: p.created_at,
        isLegal: !copyrightedSources.some(c => p.source_name.includes(c)),
      })),
      allPosts: posts,
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

