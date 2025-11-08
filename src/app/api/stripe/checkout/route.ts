/**
 * Stripe Checkout API
 * Creates a checkout session for member upgrades
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const { session: authSession } = await getSession();
    
    if (!authSession) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { priceId, memberEmail, memberId } = body;

    console.log('🔵 Creating checkout session:', { priceId, memberEmail, memberId });

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
      customer_email: memberEmail || authSession.user.email,
      client_reference_id: memberId,
      metadata: {
        brand: 'dealsprints',
        product_line: 'okc_membership',
        member_id: memberId,
        user_id: authSession.user.id,
      },
      subscription_data: {
        metadata: {
          brand: 'dealsprints',
          product_line: 'okc_membership',
          member_id: memberId,
          user_id: authSession.user.id,
        },
      },
    });

    console.log('✅ Checkout session created:', checkoutSession.id);

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });

  } catch (error) {
    console.error('❌ Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

