'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getMemberProfile } from '@/lib/auth';

export function GetStartedButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // Check if user is logged in
      const { session } = await getSession();

      if (!session) {
        // Not logged in → Go to signup
        router.push('/signup');
        return;
      }

      // User is logged in → Check if already Pro
      const member = await getMemberProfile(session.user.id);
      
      if (member?.plan === 'member') {
        // Already Pro → Go to dashboard
        router.push('/dashboard');
        return;
      }

      // User is Free → Go straight to Stripe checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_1SRHGN2fq8sWUTjaxi9dnPsT',
          memberEmail: session.user.email,
          memberId: member?.id,
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Get Started error:', error);
      // Fallback to pricing page on error
      router.push('/pricing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="inline-block px-10 py-5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        'Get Started'
      )}
    </button>
  );
}

