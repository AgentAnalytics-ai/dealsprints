import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Re-run categorization and tagging logic
function categorizeArticle(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  
  // Real estate development FIRST (before events, since "design" could match both)
  if (text.includes('arena') || text.includes('stadium') || text.includes('facility') || 
      text.includes('project') || text.includes('design') || text.includes('develop') || 
      text.includes('construction') || text.includes('build') || text.includes('building')) {
    return 'development';
  }
  
  // Events/Programs
  if (text.includes('event') || text.includes('festival') || text.includes('conference')) {
    return 'event';
  }
  if (text.includes('program') || text.includes('launch') || text.includes('initiative') || text.includes('drive')) {
    return 'event';
  }
  
  // Business openings
  if (text.includes('opening') || text.includes('opens') || text.includes('now open') || text.includes('grand opening')) {
    return 'opening';
  }
  
  // Business expansions
  if (text.includes('expan') || text.includes('adds') || text.includes('grow')) {
    return 'expansion';
  }
  
  // Data/reports
  if (text.includes('data') || text.includes('report') || text.includes('statistic')) {
    return 'data-insight';
  }
  
  return 'event';
}

function extractTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
  // Always add OKC tag if it's Oklahoma City related
  if (text.includes('okc') || text.includes('oklahoma city') || 
      text.includes('downtown okc') || text.includes('downtown oklahoma city')) {
    tags.push('okc');
  }
  
  // Industry tags
  if (text.includes('retail') || text.includes('shop') || text.includes('store')) tags.push('retail');
  if (text.includes('restaurant') || text.includes('food') || text.includes('dining')) tags.push('food-beverage');
  if (text.includes('tech') || text.includes('software') || text.includes('startup')) tags.push('tech');
  if (text.includes('health') || text.includes('medical') || text.includes('wellness')) tags.push('healthcare');
  if (text.includes('real estate') || text.includes('apartment') || text.includes('housing')) tags.push('real-estate');
  if (text.includes('hotel') || text.includes('hospitality')) tags.push('hospitality');
  
  // Location tags
  if (text.includes('downtown')) tags.push('downtown');
  if (text.includes('edmond')) tags.push('edmond');
  if (text.includes('norman')) tags.push('norman');
  if (text.includes('bricktown')) tags.push('bricktown');
  if (text.includes('midtown')) tags.push('midtown');
  
  return tags.slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return Response.json({ error: 'Missing postId' }, { status: 400 });
    }

    console.log('🔧 Fixing category and tags for post:', postId);

    // Get post data
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('scraped_posts')
      .select('scraped_title, ai_summary')
      .eq('id', postId)
      .single();

    if (fetchError || !post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    // Re-categorize and re-tag
    const newCategory = categorizeArticle(post.scraped_title, post.ai_summary || '');
    const newTags = extractTags(post.scraped_title, post.ai_summary || '');

    console.log('📊 New category:', newCategory);
    console.log('🏷️ New tags:', newTags);

    // Update post
    const { error: updateError } = await supabaseAdmin
      .from('scraped_posts')
      .update({
        ai_category: newCategory,
        ai_tags: newTags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      return Response.json({ error: 'Failed to update post' }, { status: 500 });
    }

    console.log('✅ Post updated successfully');

    // Revalidate feed
    revalidatePath('/okc/feed');
    revalidatePath('/');

    return Response.json({
      success: true,
      category: newCategory,
      tags: newTags,
      message: 'Post category and tags updated'
    });

  } catch (error) {
    console.error('❌ Fix category error:', error);
    return Response.json(
      { error: 'Internal error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

