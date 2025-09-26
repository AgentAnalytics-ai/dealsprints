import { NextRequest, NextResponse } from 'next/server';
import { getOKCBusinesses } from '@/lib/okcBusinesses';

// 2025/2026: Edge runtime for faster responses
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const industry = searchParams.get('industry');
    const priceRange = searchParams.get('priceRange');
    const limit = searchParams.get('limit');
    
    let businesses = await getOKCBusinesses();
    
    // 2025/2026: Enhanced filtering with price range
    if (status) {
      businesses = businesses.filter(b => b.status === status);
    }
    
    if (industry) {
      businesses = businesses.filter(b => 
        b.name.toLowerCase().includes(industry.toLowerCase()) ||
        b.industry?.toLowerCase().includes(industry.toLowerCase())
      );
    }
    
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      businesses = businesses.filter(b => {
        if (!b.price) return false;
        if (max) {
          return b.price >= min && b.price <= max;
        } else {
          return b.price >= min;
        }
      });
    }
    
    if (limit) {
      businesses = businesses.slice(0, parseInt(limit));
    }
    
    // 2025/2026: Add caching headers
    const response = NextResponse.json({
      success: true,
      count: businesses.length,
      businesses,
      timestamp: new Date().toISOString()
    });
    
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    
    return response;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
