import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Fetching pending posts...');

    // Fetch pending_photo posts
    const { data, error } = await supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .eq('status', 'pending_photo')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return Response.json({ 
        error: 'Supabase query failed',
        details: error.message
      }, { status: 500 });
    }

    console.log(`✅ Found ${data?.length || 0} pending posts`);

    return Response.json({ 
      success: true, 
      posts: data || []
    });
  } catch (error) {
    console.error('❌ Caught error:', error);
    return Response.json({ 
      error: 'Failed to fetch posts', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

