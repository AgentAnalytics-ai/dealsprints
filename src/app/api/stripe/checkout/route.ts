/**
 * Stripe Checkout API
 * Creates a checkout session for member upgrades
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, memberEmail, memberId, userId } = body;

    console.log('🔵 Creating checkout session:', { priceId, memberEmail, memberId, userId });

    // Validate required fields
    if (!memberEmail || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: memberEmail or userId' },
        { status: 400 }
      );
    }

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
      customer_email: memberEmail,
      client_reference_id: memberId || userId,
      metadata: {
        brand: 'dealsprints',
        product_line: 'okc_membership',
        member_id: memberId || '',
        user_id: userId,
      },
      subscription_data: {
        metadata: {
          brand: 'dealsprints',
          product_line: 'okc_membership',
          member_id: memberId || '',
          user_id: userId,
        },
      },
    });

    console.log('✅ Checkout session created:', checkoutSession.id);

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });

  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
