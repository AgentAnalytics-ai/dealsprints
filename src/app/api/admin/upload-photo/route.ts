import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const postId = formData.get('postId') as string;

    if (!photo || !postId) {
      return Response.json({ error: 'Missing photo or postId' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = photo.name.split('.').pop();
    const filename = `post-${postId.slice(0, 8)}-${timestamp}.${extension}`;
    
    // Convert File to Buffer
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/images directory
    const publicPath = join(process.cwd(), 'public', 'images', filename);
    await writeFile(publicPath, buffer);
    
    const photoUrl = `/images/${filename}`;

    // Update Supabase with photo URL
    const { error } = await supabaseAdmin
      .from('scraped_posts')
      .update({ photo_url: photoUrl })
      .eq('id', postId);

    if (error) throw error;

    return Response.json({ 
      success: true, 
      photoUrl,
      message: 'Photo uploaded successfully' 
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    return Response.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

