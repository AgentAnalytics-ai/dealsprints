/**
 * Realtor Leads API
 * Returns filtered leads from scraped_posts for realtor dashboard
 * 
 * Filters by:
 * - Type (permit, license, liquor, property, zoning)
 * - Value (min/max)
 * - Area (location)
 * - Days (how recent)
 */

import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface LeadFilters {
  type?: string; // 'permit' | 'license' | 'liquor' | 'property' | 'zoning'
  minValue?: number;
  maxValue?: number;
  area?: string; // 'bricktown', 'midtown', etc.
  days?: number; // Last N days
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters
    const filters: LeadFilters = {
      type: searchParams.get('type') || undefined,
      minValue: searchParams.get('minValue') ? parseInt(searchParams.get('minValue')!) : undefined,
      maxValue: searchParams.get('maxValue') ? parseInt(searchParams.get('maxValue')!) : undefined,
      area: searchParams.get('area') || undefined,
      days: searchParams.get('days') ? parseInt(searchParams.get('days')!) : 30, // Default 30 days
    };

    // Build query
    let query = supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .in('status', ['published', 'approved']) // Only published/approved
      .order('scraped_date', { ascending: false });

    // Filter by data_type (permit, license, etc.)
    if (filters.type) {
      query = query.eq('data_type', filters.type);
    } else {
      // Default: only show permit, license, liquor, property (not RSS)
      query = query.in('data_type', ['permit', 'license', 'liquor', 'property', 'zoning']);
    }

    // Filter by date (last N days)
    if (filters.days) {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - filters.days);
      query = query.gte('scraped_date', dateThreshold.toISOString());
    }

    // Filter by value
    if (filters.minValue) {
      query = query.gte('data_value', filters.minValue);
    }
    if (filters.maxValue) {
      query = query.lte('data_value', filters.maxValue);
    }

    // Filter by area (location contains area keyword)
    if (filters.area) {
      query = query.ilike('ai_location', `%${filters.area}%`);
    }

    const { data: posts, error } = await query.limit(100);

    if (error) {
      console.error('Database error:', error);
      return Response.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    // Transform to lead format
    const leads = (posts || []).map(post => {
      // Calculate lead score
      let score = 50; // Base score
      
      // Value-based scoring
      if (post.data_value) {
        if (post.data_value >= 500000) score += 30; // High value
        else if (post.data_value >= 100000) score += 20;
        else if (post.data_value >= 50000) score += 10;
      }

      // Type-based scoring
      if (post.data_type === 'permit') score += 15; // Permits = early leads
      if (post.data_type === 'liquor') score += 10; // Liquor = restaurant opportunity
      if (post.data_type === 'zoning') score += 5; // Zoning = future opportunity

      // Recency scoring
      const daysAgo = Math.floor((Date.now() - new Date(post.scraped_date).getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo <= 3) score += 15; // Very recent
      else if (daysAgo <= 7) score += 10;
      else if (daysAgo <= 14) score += 5;

      // Determine opportunity level
      let opportunity: 'hot' | 'warm' | 'future' = 'warm';
      if (score >= 80) opportunity = 'hot';
      else if (score < 60) opportunity = 'future';

      return {
        id: post.id,
        type: post.data_type || 'unknown',
        title: post.scraped_title,
        address: post.data_address || post.ai_location || 'Oklahoma City, OK',
        value: post.data_value || 0,
        date: post.scraped_date,
        summary: post.ai_summary,
        location: post.ai_location || 'Oklahoma City, OK',
        source: post.source_name,
        sourceUrl: post.source_url,
        tags: post.ai_tags || [],
        score,
        opportunity,
        // Market intelligence fields
        impact_type: post.impact_type || null,
        impact_radius: post.impact_radius || null,
        impact_value_change: post.impact_value_change || null,
        development_status: post.development_status || null,
        // Will be geocoded on frontend
        coordinates: null as { lat: number; lng: number } | null,
      };
    });

    // Calculate stats
    const stats = {
      total: leads.length,
      byType: leads.reduce((acc, lead) => {
        acc[lead.type] = (acc[lead.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byOpportunity: {
        hot: leads.filter(l => l.opportunity === 'hot').length,
        warm: leads.filter(l => l.opportunity === 'warm').length,
        future: leads.filter(l => l.opportunity === 'future').length,
      },
      totalValue: leads.reduce((sum, lead) => sum + (lead.value || 0), 0),
      avgValue: leads.length > 0 
        ? Math.round(leads.reduce((sum, lead) => sum + (lead.value || 0), 0) / leads.length)
        : 0,
    };

    return Response.json({
      leads,
      stats,
      filters,
    });

  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
