import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const postId = formData.get('postId') as string;

    if (!photo || !postId) {
      return Response.json({ error: 'Missing photo or postId' }, { status: 400 });
    }

    console.log('📸 Uploading photo:', { postId, filename: photo.name, size: photo.size });

    // Check if post exists and get its status
    const { data: post } = await supabaseAdmin
      .from('scraped_posts')
      .select('status, photo_url')
      .eq('id', postId)
      .single();

    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    // If post has an old photo, delete it from storage
    if (post.photo_url) {
      try {
        const oldUrl = post.photo_url;
        const oldFilename = oldUrl.split('/').pop()?.split('?')[0];
        if (oldFilename) {
          await supabaseAdmin.storage.from('post-images').remove([oldFilename]);
          console.log('🗑️ Deleted old photo:', oldFilename);
        }
      } catch (deleteError) {
        console.warn('⚠️ Could not delete old photo (non-critical):', deleteError);
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = photo.name.split('.').pop();
    const filename = `post-${postId.slice(0, 8)}-${timestamp}.${extension}`;
    
    // Convert File to ArrayBuffer
    const bytes = await photo.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('post-images')
      .upload(filename, bytes, {
        contentType: photo.type,
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Supabase Storage upload error:', uploadError);
      throw uploadError;
    }

    console.log('✅ Upload successful:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('post-images')
      .getPublicUrl(filename);

    console.log('🔗 Public URL:', publicUrl);

    // Update Supabase post with photo URL
    const { error: updateError } = await supabaseAdmin
      .from('scraped_posts')
      .update({ 
        photo_url: publicUrl, 
        updated_at: new Date().toISOString()
      })
      .eq('id', postId);

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      throw updateError;
    }

    console.log('✅ Post updated with photo URL');

    // Revalidate feed pages if post is published
    if (post.status === 'published') {
      revalidatePath('/okc/feed');
      revalidatePath('/');
      console.log('🔄 Revalidated feed cache');
    }

    return Response.json({ 
      success: true, 
      photoUrl: publicUrl,
      message: 'Photo uploaded successfully' 
    });

  } catch (error) {
    console.error('❌ Photo upload error:', error);
    return Response.json(
      { 
        error: 'Failed to upload photo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

