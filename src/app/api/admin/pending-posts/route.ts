import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .eq('status', 'pending_photo')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json({ success: true, posts: data });
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

