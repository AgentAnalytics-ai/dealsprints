/**
 * Realtor Subscription Checkout
 * Creates Stripe checkout session for realtor subscription
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    const userId = session.user.id;

    // Get member profile
    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .select('stripe_customer_id, email')
      .eq('user_id', userId)
      .single();

    if (memberError || !member) {
      return Response.json(
        { error: 'Member profile not found' },
        { status: 404 }
      );
    }

    // Create or get Stripe customer
    let customerId = member.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: member.email,
        metadata: {
          user_id: userId,
        },
      });
      customerId = customer.id;

      // Update member with customer ID
      await supabaseAdmin
        .from('members')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId);
    }

    // Use existing DealSprints monthly product
    const priceId = process.env.STRIPE_PRICE_ID || 'price_1SRHGN2fq8sWUTjaxi9dnPsT';

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/realtor/dashboard?success=true`,
      cancel_url: `${request.nextUrl.origin}/realtor/dashboard?canceled=true`,
      metadata: {
        user_id: userId,
        plan: 'realtor',
        product_line: 'realtor_intelligence',
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan: 'realtor',
          product_line: 'realtor_intelligence',
        },
      },
    });

    return Response.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
