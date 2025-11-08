import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return Response.json({ error: 'Missing postId' }, { status: 400 });
    }

    // Check if post has photo
    const { data: post } = await supabaseAdmin
      .from('scraped_posts')
      .select('photo_url')
      .eq('id', postId)
      .single();

    if (!post?.photo_url) {
      return Response.json({ error: 'Post must have a photo before publishing' }, { status: 400 });
    }

    // Update status to published
    const { error } = await supabaseAdmin
      .from('scraped_posts')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', postId);

    if (error) throw error;

    // Revalidate the feed page (ISR)
    revalidatePath('/okc/feed');
    revalidatePath('/');

    return Response.json({ 
      success: true, 
      message: 'Post published successfully' 
    });

  } catch (error) {
    console.error('Publish error:', error);
    return Response.json(
      { error: 'Failed to publish post' },
      { status: 500 }
    );
  }
}

