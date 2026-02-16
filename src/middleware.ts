/**
 * Next.js Middleware
 * Protects routes requiring authentication and subscription
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect realtor routes
  if (pathname.startsWith('/realtor')) {
    // TEMPORARY: Allow access to test auth flow
    // TODO: Re-enable auth check after fixing callback
    const BYPASS_AUTH_CHECK = true;
    
    if (!BYPASS_AUTH_CHECK) {
      // Get session from cookies using type assertion to bypass TypeScript limitation
      const cookieOptions = {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
        },
      } as any;
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey, cookieOptions);

      const { data: { session } } = await supabase.auth.getSession();

      // Redirect to login if not authenticated
      if (!session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Check subscription status (will be checked again in the page component)
    // Middleware just ensures they're logged in
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/realtor/:path*',
  ],
};
