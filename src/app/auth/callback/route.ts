/**
 * Auth Callback Route
 * Handles the redirect from Supabase Auth after email confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      // Exchange the code for a session
      await supabaseAuth.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_failed`);
    }
  }

  // Redirect to dashboard after successful auth
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}

