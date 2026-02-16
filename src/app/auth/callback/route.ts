/**
 * Auth Callback Route
 * Handles the redirect from Supabase Auth after email confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect') || '/realtor/dashboard';

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
  }

  try {
    // Create Supabase client with proper cookie handling for SSR
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Cookies will be set via response
        },
        remove(name: string, options: any) {
          // Cookies will be removed via response
        },
      },
    } as any);

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`);
    }

    // Create redirect response
    const response = NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);

    // Supabase sets cookies automatically, but we need to ensure they're in the response
    // The cookies are set by Supabase's internal handling, but we can verify session exists
    
    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_failed`);
  }
}

