/**
 * Export Leads to CSV
 * Exports filtered leads for CRM import
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    
    // Get same filters as leads endpoint
    const typeFilter = searchParams.get('type') || undefined;
    const minValue = searchParams.get('minValue') ? parseInt(searchParams.get('minValue')!) : undefined;
    const daysFilter = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 30;

    // Build query (same as leads endpoint)
    let query = supabaseAdmin
      .from('scraped_posts')
      .select('*')
      .in('status', ['published', 'approved'])
      .order('scraped_date', { ascending: false });

    if (typeFilter) {
      query = query.eq('data_type', typeFilter);
    } else {
      query = query.in('data_type', ['permit', 'license', 'liquor', 'property', 'zoning']);
    }

    if (daysFilter) {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysFilter);
      query = query.gte('scraped_date', dateThreshold.toISOString());
    }

    if (minValue) {
      query = query.gte('data_value', minValue);
    }

    const { data: posts, error } = await query.limit(1000);

    if (error) throw error;

    // Convert to CSV
    const headers = [
      'ID',
      'Type',
      'Title',
      'Address',
      'Value',
      'Date',
      'Location',
      'Summary',
      'Source',
      'Source URL',
      'Tags',
      'Score',
      'Opportunity',
    ];

    const rows = (posts || []).map(post => {
      // Calculate score (same logic as leads endpoint)
      let score = 50;
      if (post.data_value) {
        if (post.data_value >= 500000) score += 30;
        else if (post.data_value >= 100000) score += 20;
        else if (post.data_value >= 50000) score += 10;
      }
      if (post.data_type === 'permit') score += 15;
      if (post.data_type === 'liquor') score += 10;
      if (post.data_type === 'zoning') score += 5;
      
      const daysAgo = Math.floor((Date.now() - new Date(post.scraped_date).getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo <= 3) score += 15;
      else if (daysAgo <= 7) score += 10;
      else if (daysAgo <= 14) score += 5;

      let opportunity = 'warm';
      if (score >= 80) opportunity = 'hot';
      else if (score < 60) opportunity = 'future';

      return [
        post.id,
        post.data_type || 'unknown',
        `"${post.scraped_title.replace(/"/g, '""')}"`,
        `"${(post.data_address || post.ai_location || '').replace(/"/g, '""')}"`,
        post.data_value || 0,
        post.scraped_date,
        `"${(post.ai_location || '').replace(/"/g, '""')}"`,
        `"${(post.ai_summary || '').replace(/"/g, '""')}"`,
        `"${(post.source_name || '').replace(/"/g, '""')}"`,
        post.source_url || '',
        (post.ai_tags || []).join('; '),
        score,
        opportunity,
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Return CSV file
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="okc-leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return Response.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
