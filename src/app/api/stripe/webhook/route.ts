/**
 * Stripe Webhook Handler
 * Processes Stripe events (payments, cancellations, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💳 Checkout completed:', session.id);
        
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('🔄 Subscription updated:', subscription.id);
        
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('❌ Subscription canceled:', subscription.id);
        
        await handleSubscriptionCancel(subscription);
        break;
      }

      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.user_id;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (!userId) {
      console.error('❌ No user_id in metadata');
      return;
    }

    console.log('🔄 Updating member to paid plan:', { userId, customerId, subscriptionId });

    // Update member record
    const { error } = await supabaseAdmin
      .from('members')
      .update({
        plan: 'member',
        is_verified: true,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Failed to update member:', error);
      throw error;
    }

    console.log('✅ Member upgraded successfully!');

    // TODO: Send welcome email here
    // await sendWelcomeEmail(memberEmail);

  } catch (error) {
    console.error('❌ handleCheckoutComplete error:', error);
  }
}

// Handle subscription update
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const status = subscription.status;

    console.log('🔄 Subscription status:', status);

    // If subscription is canceled or past_due, downgrade
    if (status === 'canceled' || status === 'past_due' || status === 'unpaid') {
      const { error } = await supabaseAdmin
        .from('members')
        .update({
          plan: 'free',
          is_verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId);

      if (error) throw error;
      console.log('⬇️ Member downgraded due to subscription status:', status);
    }

  } catch (error) {
    console.error('❌ handleSubscriptionUpdate error:', error);
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancel(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    console.log('❌ Downgrading member due to cancellation');

    const { error } = await supabaseAdmin
      .from('members')
      .update({
        plan: 'free',
        is_verified: false,
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customerId);

    if (error) throw error;

    console.log('✅ Member downgraded successfully');

    // TODO: Send cancellation confirmation email
    // await sendCancellationEmail(memberEmail);

  } catch (error) {
    console.error('❌ handleSubscriptionCancel error:', error);
  }
}

