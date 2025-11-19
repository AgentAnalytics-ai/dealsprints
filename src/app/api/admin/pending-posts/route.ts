import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Check for test query parameter
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('test') === 'november';
    const diagnosticMode = searchParams.get('diagnostic') === 'true';
    const month = searchParams.get('month') || '11';
    const year = searchParams.get('year') || '2025';

    if (testMode) {
      // Test mode: Get November posts
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      const legalOnly = searchParams.get('legalOnly') !== 'false'; // Default to true

      const { data: posts, error } = await supabaseAdmin
        .from('scraped_posts')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        return Response.json({ error: 'Failed to fetch posts', details: error.message }, { status: 500 });
      }

      // Legal sources (from DEVELOPMENT_RSS_SOURCES)
      const legalSources = [
        'City of OKC News',
        'Greater OKC Partnership',
        'Downtown OKC Inc',
        'OKC Chamber',
        'i2E - Innovation to Enterprise',
        'Greater Oklahoma City',
      ];

      // Copyrighted sources to filter out
      const copyrightedSources = ['Journal Record', 'Oklahoman', 'OKC Friday', 'NonDoc', 'Business Journal', 'Gazette'];
      
      // Filter to legal sources only if requested
      const filteredPosts = legalOnly 
        ? (posts || []).filter(p => {
            // Must match a legal source AND not be copyrighted
            const isLegal = legalSources.some(legal => p.source_name.includes(legal));
            const isCopyrighted = copyrightedSources.some(c => p.source_name.includes(c));
            return isLegal && !isCopyrighted;
          })
        : (posts || []);

      // Group by source
      const bySource: Record<string, any[]> = {};
      filteredPosts.forEach(post => {
        if (!bySource[post.source_name]) {
          bySource[post.source_name] = [];
        }
        bySource[post.source_name].push(post);
      });

      // Also group all posts (for comparison)
      const allBySource: Record<string, any[]> = {};
      (posts || []).forEach(post => {
        if (!allBySource[post.source_name]) {
          allBySource[post.source_name] = [];
        }
        allBySource[post.source_name].push(post);
      });

      const hasCopyrighted = (posts || []).some(p => copyrightedSources.some(c => p.source_name.includes(c)));

      return Response.json({
        success: true,
        testMode: true,
        period: `November ${year}`,
        filter: legalOnly ? 'legal-only' : 'all',
        summary: {
          totalPosts: filteredPosts.length,
          totalPostsIncludingCopyrighted: (posts || []).length,
          legalSources: legalSources.length,
          sources: Object.keys(bySource).length,
          hasCopyrightedSources: hasCopyrighted,
        },
        bySource: Object.keys(bySource).map(source => ({
          source,
          count: bySource[source].length,
          isLegal: legalSources.some(l => source.includes(l)) && !copyrightedSources.some(c => source.includes(c)),
        })),
        allSources: Object.keys(allBySource).map(source => ({
          source,
          count: allBySource[source].length,
          isLegal: legalSources.some(l => source.includes(l)) && !copyrightedSources.some(c => source.includes(c)),
        })),
        recentPosts: filteredPosts.slice(0, 10).map(p => ({
          id: p.id,
          title: p.scraped_title,
          source: p.source_name,
          summary: p.ai_summary,
          category: p.ai_category,
          location: p.ai_location,
          tags: p.ai_tags,
          date: p.created_at,
          isLegal: legalSources.some(l => p.source_name.includes(l)) && !copyrightedSources.some(c => p.source_name.includes(c)),
        })),
        note: legalOnly 
          ? 'Showing only legal sources. Add ?legalOnly=false to see all posts including copyrighted ones.'
          : 'Showing all posts including copyrighted sources. Add ?legalOnly=true to filter to legal sources only.',
      });
    }

    // Diagnostic mode: System health check
    if (diagnosticMode) {
      const legalSources = [
        'City of OKC News',
        'Greater OKC Partnership',
        'Downtown OKC Inc',
        'OKC Chamber',
        'i2E - Innovation to Enterprise',
        'Greater Oklahoma City',
      ];
      const copyrightedSources = ['Journal Record', 'Oklahoman', 'OKC Friday', 'NonDoc', 'Business Journal', 'Gazette'];
      
      // Get last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentPosts, error: diagError } = await supabaseAdmin
        .from('scraped_posts')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (diagError) {
        return Response.json({ error: 'Diagnostic failed', details: diagError.message }, { status: 500 });
      }
      
      const legalPosts = (recentPosts || []).filter(p => 
        legalSources.some(l => p.source_name.includes(l))
      );
      const copyrightedPosts = (recentPosts || []).filter(p => 
        copyrightedSources.some(c => p.source_name.includes(c))
      );
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const last7DaysLegal = legalPosts.filter(p => new Date(p.created_at) >= sevenDaysAgo);
      const last7DaysCopyrighted = copyrightedPosts.filter(p => new Date(p.created_at) >= sevenDaysAgo);
      
      const bySource: Record<string, number> = {};
      (recentPosts || []).forEach(p => {
        bySource[p.source_name] = (bySource[p.source_name] || 0) + 1;
      });
      
      return Response.json({
        success: true,
        diagnostic: true,
        period: 'Last 30 days',
        summary: {
          totalPosts: recentPosts?.length || 0,
          legalPosts: legalPosts.length,
          copyrightedPosts: copyrightedPosts.length,
          last7DaysLegal: last7DaysLegal.length,
          last7DaysCopyrighted: last7DaysCopyrighted.length,
        },
        bySource: Object.keys(bySource).map(s => ({
          source: s,
          count: bySource[s],
          isLegal: legalSources.some(l => s.includes(l)),
          isCopyrighted: copyrightedSources.some(c => s.includes(c)),
        })),
        recommendations: [
          ...(copyrightedPosts.length > 0 ? [`⚠️ Found ${copyrightedPosts.length} copyrighted posts. Use /admin/cleanup to remove.`] : []),
          ...(last7DaysLegal.length === 0 ? ['⚠️ No legal posts in last 7 days. Check if cron is running.'] : [`✅ Found ${last7DaysLegal.length} legal posts in last 7 days.`]),
          ...(last7DaysCopyrighted.length > 0 ? ['🚨 Copyrighted posts still being created!'] : []),
        ],
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

