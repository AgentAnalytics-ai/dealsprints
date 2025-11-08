import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return Response.json({ error: 'Missing postId' }, { status: 400 });
    }

    // Delete the post
    const { error } = await supabaseAdmin
      .from('scraped_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    return Response.json({ 
      success: true, 
      message: 'Post rejected and deleted' 
    });

  } catch (error) {
    console.error('Reject error:', error);
    return Response.json(
      { error: 'Failed to reject post' },
      { status: 500 }
    );
  }
}

