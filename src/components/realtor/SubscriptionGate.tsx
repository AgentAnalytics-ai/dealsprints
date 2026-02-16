/**
 * Subscription Gate Component
 * Shows subscription required message or redirects to checkout
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionStatus {
  hasAccess: boolean;
  isActive: boolean;
  plan: 'free' | 'realtor' | null;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | null;
  currentPeriodEnd: Date | null;
}

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const response = await fetch('/api/realtor/checkout', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Failed to start checkout');
    } finally {
      setSubscribing(false);
    }
  };

  useEffect(() => {
    async function checkSubscription() {
      try {
        const response = await fetch('/api/realtor/subscription-status');
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error('Subscription check error:', error);
        setSubscription({
          hasAccess: false,
          isActive: false,
          plan: null,
          status: null,
          currentPeriodEnd: null,
        });
      } finally {
        setLoading(false);
      }
    }

    checkSubscription();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription...</p>
        </div>
      </div>
    );
  }

  // TEMPORARY: Allow access without subscription for testing
  // TODO: Remove this bypass after fixing auth flow
  const BYPASS_SUBSCRIPTION = true;
  
  if (!BYPASS_SUBSCRIPTION && !subscription?.hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Subscription Required
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Access to the OKC Realtor Intelligence Dashboard requires an active subscription.
            </p>

            {/* Features */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                What You Get:
              </h2>
              <ul className="space-y-3">
                {[
                  'Early-stage leads from public records',
                  'Building permits & new business licenses',
                  'Interactive map with geocoded locations',
                  'AI-powered lead scoring (Hot/Warm/Future)',
                  'Property value estimates',
                  'Daily updates via automated scraping',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribing ? 'Processing...' : 'Subscribe Now'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Status Info */}
            {subscription?.status && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Current status: <span className="font-semibold capitalize">{subscription.status}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
