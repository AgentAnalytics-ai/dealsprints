import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const postId = formData.get('postId') as string;

    if (!photo || !postId) {
      return Response.json({ error: 'Missing photo or postId' }, { status: 400 });
    }

    console.log('📸 Uploading photo:', { postId, filename: photo.name, size: photo.size });

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
      .update({ photo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', postId);

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      throw updateError;
    }

    console.log('✅ Post updated with photo URL');

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

