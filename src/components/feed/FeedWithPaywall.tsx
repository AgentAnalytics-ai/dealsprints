'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/data/mockFeed';
import { FeedCard } from './FeedCard';
import { PaywallCard } from './PaywallCard';
import { getSession, getMemberProfile } from '@/lib/auth';

interface FeedWithPaywallProps {
  allPosts: Post[];
  freeLimit?: number;
}

export function FeedWithPaywall({ allPosts, freeLimit = 5 }: FeedWithPaywallProps) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkProStatus() {
      try {
        const { session } = await getSession();
        
        if (session) {
          const member = await getMemberProfile(session.user.id);
          setIsPro(member?.plan === 'member');
        }
      } catch (error) {
        console.error('Error checking pro status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkProStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {allPosts.slice(0, freeLimit).map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  const postsToShow = isPro ? allPosts : allPosts.slice(0, freeLimit);
  const hasMore = allPosts.length > freeLimit;

  return (
    <div className="space-y-8">
      {/* Show posts (5 for free, all for Pro) */}
      {postsToShow.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}

      {/* Paywall for free users */}
      {!isPro && hasMore && (
        <>
          {/* Subtle fade effect */}
          <div className="h-32 bg-gradient-to-b from-transparent to-gray-50 -mt-32 relative z-10 pointer-events-none" />
          
          {/* Paywall Card */}
          <PaywallCard />
          
          {/* Show count of locked posts */}
          <div className="text-center text-gray-600 py-8">
            <p className="text-lg">
              <strong>{allPosts.length - freeLimit} more posts</strong> available with Pro access
            </p>
          </div>
        </>
      )}

      {/* No paywall for Pro users */}
      {isPro && (
        <div className="text-center py-8 text-gray-600">
          <p className="text-sm">
            You're viewing all {allPosts.length} posts as a Pro member
          </p>
        </div>
      )}
    </div>
  );
}

