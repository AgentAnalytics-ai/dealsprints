/**
 * Authentication Utilities
 * Handles user authentication with Supabase Auth
 */

import { createClient } from '@supabase/supabase-js';

// Supabase client for auth operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface SignUpData {
  email: string;
  password: string;
  businessName: string;
  ownerName?: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface Member {
  id: string;
  user_id: string;
  business_name: string;
  slug: string;
  owner_name: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  category: string | null;
  tagline: string | null;
  bio: string | null;
  logo_url: string | null;
  plan: 'free' | 'member';
  is_verified: boolean;
  is_active: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData) {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          business_name: data.businessName,
          owner_name: data.ownerName,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // 2. Create member profile
    const slug = generateSlug(data.businessName);
    
    const { error: memberError } = await supabaseAuth
      .from('members')
      .insert({
        user_id: authData.user.id,
        business_name: data.businessName,
        slug,
        owner_name: data.ownerName || null,
        email: data.email,
        phone: data.phone || null,
        plan: 'free',
        is_verified: false,
        is_active: true,
      });

    if (memberError) throw memberError;

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData) {
  try {
    const { data: authData, error } = await supabaseAuth.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    return { user: authData.user, session: authData.session, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, session: null, error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabaseAuth.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabaseAuth.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }
}

/**
 * Get the current user
 */
export async function getUser() {
  try {
    const { data: { user }, error } = await supabaseAuth.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Get user error:', error);
    return { user: null, error };
  }
}

/**
 * Get member profile for current user
 */
export async function getMemberProfile(userId: string): Promise<Member | null> {
  try {
    const { data, error } = await supabaseAuth
      .from('members')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as Member;
  } catch (error) {
    console.error('Get member profile error:', error);
    return null;
  }
}

/**
 * Update member profile
 */
export async function updateMemberProfile(userId: string, updates: Partial<Member>) {
  try {
    const { data, error } = await supabaseAuth
      .from('members')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Update member profile error:', error);
    return { data: null, error };
  }
}

/**
 * Generate a URL-friendly slug from business name
 */
function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .concat('-okc');
}

/**
 * Check if user is authenticated (client-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const { session } = await getSession();
  return !!session;
}

/**
 * Require authentication (use in server components/API routes)
 */
export async function requireAuth() {
  const { session } = await getSession();
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}

