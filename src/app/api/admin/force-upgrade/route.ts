/**
 * Manual Upgrade Endpoint
 * Use this to manually upgrade a user's account when Stripe webhook fails
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    console.log('🔧 Manual upgrade requested for:', email);

    // Find member by email
    const { data: member, error: findError } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !member) {
      console.error('❌ Member not found:', findError);
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    console.log('📋 Found member:', member.id);

    // Update to paid plan
    const { error: updateError } = await supabaseAdmin
      .from('members')
      .update({
        plan: 'member',
        is_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', member.id);

    if (updateError) {
      console.error('❌ Failed to upgrade:', updateError);
      return NextResponse.json({ error: 'Update failed', details: updateError }, { status: 500 });
    }

    console.log('✅ Member upgraded successfully!');

    return NextResponse.json({
      success: true,
      message: 'Member upgraded to Pro',
      member: {
        email: member.email,
        plan: 'member',
      },
    });

  } catch (error: any) {
    console.error('❌ Manual upgrade error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: error.message },
      { status: 500 }
    );
  }
}

