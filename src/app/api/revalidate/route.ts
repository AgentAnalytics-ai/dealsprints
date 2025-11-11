import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return Response.json({ error: 'Missing path parameter' }, { status: 400 });
  }
  
  try {
    revalidatePath(path);
    return Response.json({ 
      revalidated: true, 
      path,
      now: Date.now() 
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to revalidate',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

