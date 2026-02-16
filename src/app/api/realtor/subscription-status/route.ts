/**
 * Subscription Status API
 * Returns current user's subscription status
 */

import { NextRequest } from 'next/server';
import { getCurrentUserSubscription } from '@/lib/subscription';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    
    // Get subscription status
    const subscription = await getCurrentUserSubscription();
    
    return Response.json({
      ...subscription,
    });
  } catch (error) {
    return Response.json(
      { 
        error: 'Failed to get subscription status',
        hasAccess: false,
        isActive: false,
      },
      { status: 401 }
    );
  }
}
