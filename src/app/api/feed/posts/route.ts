import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server-side feed endpoint with paywall enforcement
export async function GET(request: NextRequest) {
  try {
    // Get user session to check plan
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if user has Pro plan
    let isPro = false;
    if (session) {
      const { data: member } = await supabaseAdmin
        .from('members')
        .select('plan')
        .eq('user_id', session.user.id)
        .single();
      
      isPro = member?.plan === 'member';
    }

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch published posts (last 30 days)
    let query = supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .eq('status', 'published')
      .gte('published_at', thirtyDaysAgo.toISOString())
      .order('published_at', { ascending: false });

    // SECURITY: Limit free users to 5 posts (server-side)
    if (!isPro) {
      query = query.limit(5);
    } else {
      query = query.limit(100); // Pro users get up to 100 posts
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('❌ Error fetching posts:', error);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    // Return posts with user access level
    return NextResponse.json({
      posts: posts || [],
      isPro,
      totalCount: posts?.length || 0,
      hasMore: isPro ? false : (posts?.length || 0) >= 5, // Free users always have more if we hit limit
    });

  } catch (error) {
    console.error('❌ Feed API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

