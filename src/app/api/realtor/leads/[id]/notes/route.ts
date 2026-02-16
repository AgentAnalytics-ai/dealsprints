/**
 * Lead Notes API
 * Add, get, and update notes for leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Get notes for a lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const leadId = params.id;

    const { data: notes, error } = await supabaseAdmin
      .from('lead_notes')
      .select('*')
      .eq('lead_id', leadId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json({ notes: notes || [] });
  } catch (error) {
    console.error('Get notes error:', error);
    return Response.json(
      { error: 'Failed to get notes' },
      { status: 500 }
    );
  }
}

// Add a note to a lead
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const leadId = params.id;
    const { note, status } = await request.json();

    if (!note) {
      return Response.json(
        { error: 'Note is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('lead_notes')
      .insert({
        user_id: userId,
        lead_id: leadId,
        note,
        status: status || 'not_contacted',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ note: data });
  } catch (error) {
    console.error('Add note error:', error);
    return Response.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}

// Update note status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const leadId = params.id;
    const { status } = await request.json();

    if (!status) {
      return Response.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Update most recent note or create new one
    const { data, error } = await supabaseAdmin
      .from('lead_notes')
      .upsert({
        user_id: userId,
        lead_id: leadId,
        status,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lead_id',
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ note: data });
  } catch (error) {
    console.error('Update status error:', error);
    return Response.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
