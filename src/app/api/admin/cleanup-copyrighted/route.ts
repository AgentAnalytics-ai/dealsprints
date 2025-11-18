/**
 * Cleanup Copyrighted Sources
 * Removes all posts from copyrighted news sources (Journal Record, Oklahoman, etc.)
 * 
 * SAFETY: This only deletes posts from copyrighted sources we removed
 * Keeps all legal development/economic development sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Copyrighted sources to remove (these were removed from scraper)
const COPYRIGHTED_SOURCES = [
  'Journal Record',
  'The Oklahoman',
  'OKC Friday',
  'NonDoc',
  'Oklahoma City Business Journal',
  'Oklahoma Gazette',
  // Journal Record category feeds
  'Journal Record - Real Estate',
  'Journal Record - Construction',
  'Journal Record - Finance',
  'Journal Record - Energy',
  'Journal Record - Technology',
  'Journal Record - Healthcare',
  'Journal Record - Retail',
];

// Legal sources to KEEP
const LEGAL_SOURCES = [
  'City of OKC News',
  'Greater OKC Partnership',
  'Downtown OKC Inc',
  'OKC Chamber',
  'i2E - Innovation to Enterprise',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { dryRun = false, confirm = false } = body;

    if (!confirm && !dryRun) {
      return NextResponse.json({
        error: 'Must set confirm: true or dryRun: true',
        message: 'This will delete posts. Set confirm: true to proceed, or dryRun: true to preview.',
      }, { status: 400 });
    }

    console.log('🧹 Starting cleanup of copyrighted sources...');
    console.log(`   Mode: ${dryRun ? 'DRY RUN (preview only)' : 'LIVE (will delete)'}`);

    // First, count what will be deleted
    const { data: postsToDelete, error: countError } = await supabaseAdmin
      .from('scraped_posts')
      .select('id, source_name, scraped_title, status')
      .in('source_name', COPYRIGHTED_SOURCES);

    if (countError) {
      console.error('Error counting posts:', countError);
      return NextResponse.json({
        error: 'Failed to count posts',
        details: countError.message,
      }, { status: 500 });
    }

    const count = postsToDelete?.length || 0;
    const bySource: Record<string, number> = {};
    
    postsToDelete?.forEach(post => {
      bySource[post.source_name] = (bySource[post.source_name] || 0) + 1;
    });

    console.log(`   Found ${count} posts from copyrighted sources to delete`);

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        message: `Would delete ${count} posts from copyrighted sources`,
        stats: {
          totalToDelete: count,
          bySource,
          copyrightedSources: COPYRIGHTED_SOURCES,
          legalSources: LEGAL_SOURCES,
        },
      });
    }

    // Actually delete
    const { error: deleteError, count: deletedCount } = await supabaseAdmin
      .from('scraped_posts')
      .delete()
      .in('source_name', COPYRIGHTED_SOURCES)
      .select('id', { count: 'exact', head: true });

    if (deleteError) {
      console.error('Error deleting posts:', deleteError);
      return NextResponse.json({
        error: 'Failed to delete posts',
        details: deleteError.message,
      }, { status: 500 });
    }

    console.log(`✅ Deleted ${deletedCount || 0} posts from copyrighted sources`);

    // Verify legal sources are still there
    const { data: legalPosts, count: legalCount } = await supabaseAdmin
      .from('scraped_posts')
      .select('id', { count: 'exact', head: true })
      .in('source_name', LEGAL_SOURCES);

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount || 0} posts from copyrighted sources`,
      stats: {
        deleted: deletedCount || 0,
        bySource,
        remainingLegalPosts: legalCount || 0,
        copyrightedSources: COPYRIGHTED_SOURCES,
        legalSources: LEGAL_SOURCES,
      },
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({
      error: 'Cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Also allow GET for easy testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get('dryRun') === 'true';
  const confirm = searchParams.get('confirm') === 'true';

  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ dryRun, confirm }),
  });

  return POST(mockRequest);
}

