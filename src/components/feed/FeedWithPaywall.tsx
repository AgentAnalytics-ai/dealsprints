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
        // Check if user is logged in AND has Pro plan
        const { session } = await getSession();
        
        if (session) {
          const member = await getMemberProfile(session.user.id);
          setIsPro(member?.plan === 'member');
        } else {
          // Not logged in = show free preview
          setIsPro(false);
        }
      } catch (error) {
        console.error('Error checking pro status:', error);
        setIsPro(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkProStatus();
  }, []);

  // Show first 5 posts while checking auth status
  if (isLoading) {
    return (
      <div className="space-y-8">
        {allPosts.slice(0, freeLimit).map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  // SECURITY: Filter posts based on user plan
  // Pro users see all posts, free users see only first 5
  const postsToShow = isPro ? allPosts : allPosts.slice(0, freeLimit);
  const hasMore = !isPro && allPosts.length > freeLimit; // Show paywall if free user and there are more posts

  return (
    <div className="space-y-8">
      {/* Show posts (5 for everyone, unlimited for Pro) */}
      {postsToShow.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}

      {/* Paywall for non-Pro users (including anonymous) */}
      {!isPro && hasMore && (
        <PaywallCard 
          lockedPostCount={allPosts.length - freeLimit}
          totalPosts={allPosts.length}
        />
      )}

      {/* Pro user message */}
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
