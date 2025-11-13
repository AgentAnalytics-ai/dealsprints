import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    console.log('🔄 Unpublishing post:', postId);

    // Update post status back to pending_photo
    const { error } = await supabaseAdmin
      .from('scraped_posts')
      .update({
        status: 'pending_photo',
        published_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (error) {
      console.error('❌ Failed to unpublish:', error);
      return Response.json({ error: 'Failed to unpublish post' }, { status: 500 });
    }

    console.log('✅ Post unpublished successfully');

    // Revalidate feed page to remove post
    revalidatePath('/okc/feed');

    return Response.json({ success: true });
  } catch (error) {
    console.error('❌ Unpublish error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

