import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Check for test query parameter
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('test') === 'november';
    const month = searchParams.get('month') || '11';
    const year = searchParams.get('year') || '2025';

    if (testMode) {
      // Test mode: Get November posts
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

      const { data: posts, error } = await supabaseAdmin
        .from('scraped_posts')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        return Response.json({ error: 'Failed to fetch posts', details: error.message }, { status: 500 });
      }

      // Group by source
      const bySource: Record<string, any[]> = {};
      posts?.forEach(post => {
        if (!bySource[post.source_name]) {
          bySource[post.source_name] = [];
        }
        bySource[post.source_name].push(post);
      });

      // Check for copyrighted
      const copyrightedSources = ['Journal Record', 'Oklahoman', 'OKC Friday', 'NonDoc', 'Business Journal', 'Gazette'];
      const hasCopyrighted = posts?.some(p => copyrightedSources.some(c => p.source_name.includes(c)));

      return Response.json({
        success: true,
        testMode: true,
        period: `November ${year}`,
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
        recentPosts: (posts || []).slice(0, 10).map(p => ({
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
      });
    }

    // Normal mode: Fetch pending_photo posts
    console.log('🔍 Fetching pending posts...');
    console.log('ENV Check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    });

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

