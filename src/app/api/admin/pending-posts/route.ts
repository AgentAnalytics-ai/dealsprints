import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Fetching pending posts...');
    console.log('🔑 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 Service Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data, error } = await supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .eq('status', 'pending_photo')
      .order('created_at', { ascending: false });

    console.log('📊 Query result:', { data, error, count: data?.length });

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    return Response.json({ 
      success: true, 
      posts: data || [],
      debug: {
        count: data?.length || 0,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
  } catch (error) {
    console.error('❌ Error fetching pending posts:', error);
    return Response.json({ 
      error: 'Failed to fetch posts', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

