import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Fetching published posts...');

    // Fetch published posts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .eq('status', 'published')
      .gte('published_at', thirtyDaysAgo.toISOString())
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return Response.json({ 
        error: 'Supabase query failed',
        details: error.message
      }, { status: 500 });
    }

    console.log(`✅ Found ${data?.length || 0} published posts`);

    return Response.json({ 
      success: true, 
      posts: data || []
    });
  } catch (error) {
    console.error('❌ Caught error:', error);
    return Response.json({ 
      error: 'Failed to fetch posts', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

