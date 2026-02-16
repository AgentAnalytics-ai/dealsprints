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

  console.log('🔐 Auth callback received:', { code: code ? 'present' : 'missing', redirectTo });

  if (!code) {
    console.error('❌ No code in callback URL');
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
  }

  try {
    // Create redirect response first (we'll add cookies to it)
    const redirectResponse = NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
    
    // Create Supabase client with cookie handling
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Set cookies in the redirect response
          redirectResponse.cookies.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: options?.maxAge || 60 * 60 * 24 * 7, // 7 days default
          });
        },
        remove(name: string, options: any) {
          redirectResponse.cookies.delete(name);
        },
      },
    } as any);

    // Exchange the code for a session
    console.log('🔄 Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('❌ Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    if (!data.session) {
      console.error('❌ No session returned from exchange');
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no_session`);
    }

    console.log('✅ Session created successfully:', { userId: data.session.user.id });

    // Return redirect response with cookies set by Supabase
    return redirectResponse;
  } catch (error: any) {
    console.error('❌ Auth callback exception:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error.message || 'auth_failed')}`);
  }
}

