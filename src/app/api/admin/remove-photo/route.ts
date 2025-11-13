import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return Response.json({ error: 'Missing postId' }, { status: 400 });
    }

    console.log('🗑️ Removing photo for post:', postId);

    // Get post to check status and old photo URL
    const { data: post } = await supabaseAdmin
      .from('scraped_posts')
      .select('status, photo_url')
      .eq('id', postId)
      .single();

    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete old photo from storage if it exists
    if (post.photo_url) {
      try {
        const oldUrl = post.photo_url;
        const oldFilename = oldUrl.split('/').pop()?.split('?')[0];
        if (oldFilename) {
          const { error: deleteError } = await supabaseAdmin
            .storage
            .from('post-images')
            .remove([oldFilename]);
          
          if (deleteError) {
            console.warn('⚠️ Could not delete photo from storage:', deleteError);
          } else {
            console.log('🗑️ Deleted photo from storage:', oldFilename);
          }
        }
      } catch (deleteError) {
        console.warn('⚠️ Error deleting photo (non-critical):', deleteError);
      }
    }

    // Update post to remove photo URL
    const { error: updateError } = await supabaseAdmin
      .from('scraped_posts')
      .update({ 
        photo_url: null, 
        updated_at: new Date().toISOString()
      })
      .eq('id', postId);

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      throw updateError;
    }

    console.log('✅ Photo removed from post');

    // Revalidate feed pages if post is published
    if (post.status === 'published') {
      revalidatePath('/okc/feed');
      revalidatePath('/');
      console.log('🔄 Revalidated feed cache');
    }

    return Response.json({ 
      success: true, 
      message: 'Photo removed successfully' 
    });

  } catch (error) {
    console.error('❌ Remove photo error:', error);
    return Response.json(
      { 
        error: 'Failed to remove photo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

