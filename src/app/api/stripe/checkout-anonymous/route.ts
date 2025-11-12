/**
 * Anonymous Stripe Checkout API
 * Creates a checkout session for users who haven't signed up yet
 * Account will be created AFTER payment via webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId } = body;

    console.log('🆕 Creating anonymous checkout session');

    // Ensure site URL has https:// scheme
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealsprints.com';
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      siteUrl = `https://${siteUrl}`;
    }

    // Create Stripe checkout session (email collected by Stripe)
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRICE_ID || 'price_1SRHGN2fq8sWUTjaxi9dnPsT',
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/okc/feed`,
      // customer_email is NOT pre-filled - Stripe will collect it
      metadata: {
        brand: 'dealsprints',
        product_line: 'okc_membership',
        is_anonymous_checkout: 'true',
      },
      subscription_data: {
        metadata: {
          brand: 'dealsprints',
          product_line: 'okc_membership',
        },
      },
    });

    console.log('✅ Anonymous checkout session created:', checkoutSession.id);

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });

  } catch (error: any) {
    console.error('❌ Anonymous checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

