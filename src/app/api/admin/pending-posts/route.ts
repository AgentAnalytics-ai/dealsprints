import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Log env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔍 ENV CHECK:');
    console.log('  URL:', supabaseUrl);
    console.log('  URL correct:', supabaseUrl === 'https://cshnrqhtwwuombfoqqws.supabase.co');
    console.log('  Service Key exists:', !!serviceKey);
    console.log('  Service Key length:', serviceKey?.length);
    console.log('  Service Key starts with:', serviceKey?.substring(0, 10));

    // Create fresh client
    const supabase = createClient(
      supabaseUrl || '',
      serviceKey || ''
    );

    console.log('🔍 Querying scraped_posts...');
    console.log('  Looking for status: pending_photo');

    // Test 1: Count all rows
    const { count: totalCount } = await supabase
      .from('scraped_posts')
      .select('*', { count: 'exact', head: true });
    
    console.log('📊 Total rows in scraped_posts:', totalCount);

    // Test 2: Count pending_photo rows
    const { count: pendingCount } = await supabase
      .from('scraped_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_photo');
    
    console.log('📊 Rows with status=pending_photo:', pendingCount);

    // Test 3: Fetch actual data
    const { data, error } = await supabase
      .from('scraped_posts')
      .select('*')
      .eq('status', 'pending_photo')
      .order('created_at', { ascending: false });

    console.log('📊 Query result:', { 
      dataCount: data?.length, 
      error: error,
      firstPost: data?.[0]?.scraped_title 
    });

    if (error) {
      console.error('❌ Supabase error:', error);
      return Response.json({ 
        error: 'Supabase query failed',
        details: error.message,
        hint: error.hint,
        code: error.code
      }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      posts: data || [],
      debug: {
        count: data?.length || 0,
        totalInTable: totalCount,
        pendingInTable: pendingCount,
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceKey: !!serviceKey,
        urlMatch: supabaseUrl === 'https://cshnrqhtwwuombfoqqws.supabase.co'
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

