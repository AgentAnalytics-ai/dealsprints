/**
 * Supabase Client Configuration
 * Used for reading/writing posts, managing admin operations
 */

import { createClient } from '@supabase/supabase-js';

// Public client (for reading published posts)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client (for server-side operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// TypeScript types for scraped posts
export interface ScrapedPost {
  id: string;
  source_url: string;
  source_name: string;
  scraped_title: string;
  scraped_date: string;
  ai_summary: string;
  ai_category: string | null;
  ai_location: string | null;
  ai_tags: string[];
  photo_url: string | null;
  status: 'pending_photo' | 'approved' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

