/**
 * Supabase Client Configuration
 * Used for reading/writing posts, managing admin operations
 */

import { createClient } from '@supabase/supabase-js';

// Safe env var access with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// Public client (for reading published posts)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
  // Realtor dashboard fields
  data_type?: string | null; // 'permit', 'license', 'liquor', 'property', 'zoning', 'rss'
  data_value?: number | null; // Permit/property value
  data_address?: string | null; // Address for geocoding
}

