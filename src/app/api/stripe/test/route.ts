/**
 * Stripe Configuration Test Endpoint
 * Use this to verify Stripe is configured correctly
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    const checks: any = {
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      stripePriceId: !!process.env.STRIPE_PRICE_ID,
      siteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'missing',
      siteUrlValue: process.env.NEXT_PUBLIC_SITE_URL || 'missing',
    };

    // Try to initialize Stripe
    let stripeInitialized = false;
    let stripeError = null;
    
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-10-29.clover',
      });
      
      // Try to retrieve the price
      const price = await stripe.prices.retrieve(
        process.env.STRIPE_PRICE_ID || 'price_1SRHGN2fq8sWUTjaxi9dnPsT'
      );
      
      stripeInitialized = true;
      checks.priceCheck = {
        id: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        type: price.type,
      };
    } catch (error: any) {
      stripeError = error.message;
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks,
      stripeInitialized,
      stripeError,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

