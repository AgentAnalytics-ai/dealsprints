/**
 * System Diagnostic: Check cron status and recent posts
 * Helps verify if the new legal-only system is working
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Legal sources (what should be active)
    const legalSources = [
      'City of OKC News',
      'Greater OKC Partnership',
      'Downtown OKC Inc',
      'OKC Chamber',
      'i2E - Innovation to Enterprise',
      'Greater Oklahoma City',
    ];

    // Copyrighted sources (what should be removed)
    const copyrightedSources = [
      'Journal Record',
      'Oklahoman',
      'OKC Friday',
      'NonDoc',
      'Business Journal',
      'Gazette',
    ];

    // Get last 30 days of posts
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentPosts, error } = await supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({
        error: 'Failed to fetch posts',
        details: error.message,
      }, { status: 500 });
    }

    // Analyze posts
    const bySource: Record<string, any[]> = {};
    recentPosts?.forEach(post => {
      if (!bySource[post.source_name]) {
        bySource[post.source_name] = [];
      }
      bySource[post.source_name].push(post);
    });

    // Categorize sources
    const legalPosts: any[] = [];
    const copyrightedPosts: any[] = [];
    const unknownPosts: any[] = [];

    recentPosts?.forEach(post => {
      const isLegal = legalSources.some(l => post.source_name.includes(l));
      const isCopyrighted = copyrightedSources.some(c => post.source_name.includes(c));
      
      if (isLegal) {
        legalPosts.push(post);
      } else if (isCopyrighted) {
        copyrightedPosts.push(post);
      } else {
        unknownPosts.push(post);
      }
    });

    // Get most recent post from each category
    const mostRecentLegal = legalPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const mostRecentCopyrighted = copyrightedPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    // Check last 7 days specifically
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7DaysLegal = legalPosts.filter(p => 
      new Date(p.created_at) >= sevenDaysAgo
    );
    const last7DaysCopyrighted = copyrightedPosts.filter(p => 
      new Date(p.created_at) >= sevenDaysAgo
    );

    return NextResponse.json({
      success: true,
      diagnostic: {
        period: 'Last 30 days',
        totalPosts: recentPosts?.length || 0,
        legalPosts: {
          count: legalPosts.length,
          last7Days: last7DaysLegal.length,
          mostRecent: mostRecentLegal ? {
            source: mostRecentLegal.source_name,
            title: mostRecentLegal.scraped_title,
            date: mostRecentLegal.created_at,
          } : null,
        },
        copyrightedPosts: {
          count: copyrightedPosts.length,
          last7Days: last7DaysCopyrighted.length,
          mostRecent: mostRecentCopyrighted ? {
            source: mostRecentCopyrighted.source_name,
            title: mostRecentCopyrighted.scraped_title,
            date: mostRecentCopyrighted.created_at,
          } : null,
        },
        unknownPosts: {
          count: unknownPosts.length,
          sources: Array.from(new Set(unknownPosts.map(p => p.source_name))),
        },
      },
      bySource: Object.keys(bySource).map(source => ({
        source,
        count: bySource[source].length,
        isLegal: legalSources.some(l => source.includes(l)),
        isCopyrighted: copyrightedSources.some(c => source.includes(c)),
        mostRecent: bySource[source][0]?.created_at,
      })),
      recommendations: [
        ...(copyrightedPosts.length > 0 ? [
          `⚠️ Found ${copyrightedPosts.length} copyrighted posts. Use /admin/cleanup to remove them.`
        ] : []),
        ...(last7DaysLegal.length === 0 ? [
          '⚠️ No legal posts in last 7 days. Check if cron is running or if legal sources have new content.'
        ] : [
          `✅ Found ${last7DaysLegal.length} legal posts in last 7 days. System appears to be working.`
        ]),
        ...(last7DaysCopyrighted.length > 0 ? [
          '🚨 Copyrighted posts still being created! Check cron configuration - Journal Record should be removed.'
        ] : []),
      ],
    });

  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({
      error: 'Diagnostic failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

