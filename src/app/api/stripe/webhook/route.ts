/**
 * Stripe Webhook Handler
 * Processes Stripe events (payments, cancellations, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
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
    const isAnonymous = session.metadata?.is_anonymous_checkout === 'true';
    const customerEmail = session.customer_details?.email || session.customer_email;

    console.log('💳 Processing checkout:', { userId, isAnonymous, customerEmail });

    // SCENARIO 1: Anonymous checkout (no pre-existing account)
    if (isAnonymous || !userId) {
      console.log('🆕 Creating new account for anonymous checkout');
      
      if (!customerEmail) {
        console.error('❌ No customer email provided');
        return;
      }

      // Check if user already exists
      const { data: existingMember } = await supabaseAdmin
        .from('members')
        .select('*')
        .eq('email', customerEmail)
        .single();

      if (existingMember) {
        console.log('✅ Existing member found, upgrading...');
        // Just upgrade existing account
        await supabaseAdmin
          .from('members')
          .update({
            plan: 'member',
            is_verified: true,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingMember.id);
      } else {
        console.log('🆕 Creating new Supabase user and member record');
        
        // Create Supabase auth user (password-less, will use magic link)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true, // Auto-confirm email
        });

        if (authError || !authData.user) {
          console.error('❌ Failed to create auth user:', authError);
          return;
        }

        // Create member record
        const slug = customerEmail.split('@')[0] + '-okc';
        const { error: memberError } = await supabaseAdmin
          .from('members')
          .insert({
            user_id: authData.user.id,
            business_name: customerEmail.split('@')[0], // Use email prefix as placeholder
            slug,
            email: customerEmail,
            plan: 'member',
            is_verified: true,
            is_active: true,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          });

        if (memberError) {
          console.error('❌ Failed to create member:', memberError);
          return;
        }

        console.log('✅ New member created successfully!');
      }

      // Send magic link email for first login
      // Supabase will automatically send the email if email is configured
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dealsprints.com'}/okc/feed`,
        },
      });

      if (linkError) {
        console.error('❌ Failed to generate magic link:', linkError);
        // Continue anyway - user can use password reset if needed
      } else {
        console.log('📧 Magic link generated for:', customerEmail);
        // Supabase should automatically send the email
        // If email doesn't arrive, user can use password reset
      }
      return;
    }

    // SCENARIO 2: Existing user upgrading
    console.log('🔄 Upgrading existing user:', userId);

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

