/**
 * Subscription Utilities
 * Handles Stripe subscription checking and management
 */

import { supabaseAdmin } from './supabase';
import { getSession } from './auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export interface SubscriptionStatus {
  hasAccess: boolean;
  isActive: boolean;
  subscriptionId: string | null;
  customerId: string | null;
  plan: 'free' | 'realtor' | null;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Check if user has active subscription
 */
export async function checkSubscription(userId: string): Promise<SubscriptionStatus> {
  try {
    // Get member profile
    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (error || !member) {
      return {
        hasAccess: false,
        isActive: false,
        subscriptionId: null,
        customerId: null,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    // If no Stripe IDs, no subscription
    if (!member.stripe_subscription_id || !member.stripe_customer_id) {
      return {
        hasAccess: false,
        isActive: false,
        subscriptionId: null,
        customerId: member.stripe_customer_id,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    // Check subscription status with Stripe
    const subscription = await stripe.subscriptions.retrieve(member.stripe_subscription_id);

    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    const plan = subscription.items.data[0]?.price?.metadata?.plan as 'realtor' | null || null;

    // Safely access subscription properties
    const currentPeriodEnd = 'current_period_end' in subscription && subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : null;
    
    const cancelAtPeriodEnd = 'cancel_at_period_end' in subscription 
      ? subscription.cancel_at_period_end || false
      : false;

    return {
      hasAccess: isActive,
      isActive,
      subscriptionId: member.stripe_subscription_id,
      customerId: member.stripe_customer_id,
      plan,
      status: subscription.status as SubscriptionStatus['status'],
      currentPeriodEnd,
      cancelAtPeriodEnd,
    };
  } catch (error) {
    console.error('Subscription check error:', error);
    return {
      hasAccess: false,
      isActive: false,
      subscriptionId: null,
      customerId: null,
      plan: null,
      status: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }
}

/**
 * Require active subscription (use in API routes/server components)
 */
export async function requireSubscription(userId: string): Promise<SubscriptionStatus> {
  const subscription = await checkSubscription(userId);
  
  if (!subscription.hasAccess) {
    throw new Error('Active subscription required');
  }
  
  return subscription;
}

/**
 * Get subscription status for current user
 */
export async function getCurrentUserSubscription(): Promise<SubscriptionStatus> {
  const { session } = await getSession();
  
  if (!session?.user?.id) {
    return {
      hasAccess: false,
      isActive: false,
      subscriptionId: null,
      customerId: null,
      plan: null,
      status: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }
  
  return checkSubscription(session.user.id);
}
