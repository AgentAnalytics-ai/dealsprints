import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Fetching pending posts...');
    console.log('ENV Check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    });

    // Fetch pending_photo posts
    const { data, error, count } = await supabaseAdmin
      .from('scraped_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'pending_photo')
      .order('created_at', { ascending: false });

    console.log('Query result:', {
      dataLength: data?.length,
      count,
      error: error?.message,
      firstTitle: data?.[0]?.scraped_title
    });

    if (error) {
      console.error('❌ Supabase error:', error);
      return Response.json({ 
        error: 'Supabase query failed',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    console.log(`✅ Found ${data?.length || 0} pending posts`);

    return Response.json({ 
      success: true, 
      posts: data || [],
      debug: {
        count,
        hasData: !!data,
        dataLength: data?.length || 0
      }
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

