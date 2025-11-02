"use client";

import { useState } from 'react';
import { Post } from '@/lib/data/mockFeed';
import { FeedCard } from './FeedCard';
// Removed unused import

interface FeedListProps {
  posts: Post[];
  showFilters?: boolean;
}

export function FeedList({ posts, showFilters = true }: FeedListProps) {
  const [selectedKind, setSelectedKind] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Get unique tags from all posts
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (selectedKind !== 'all' && post.kind !== selectedKind) return false;
    if (selectedTag !== 'all' && !post.tags.includes(selectedTag)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Simple Dropdown Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Type dropdown */}
          <select
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
            className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 font-medium focus:border-brand focus:outline-none transition-colors bg-white"
          >
            <option value="all">🔥 All Updates</option>
            <option value="development">🏗️ Developments</option>
            <option value="opening">🎉 New Openings</option>
            <option value="expansion">📈 Expansions</option>
            <option value="event">📅 Events</option>
            <option value="data-insight">📊 Market Data</option>
          </select>

          {/* Tag dropdown */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 font-medium focus:border-brand focus:outline-none transition-colors bg-white"
          >
            <option value="all">🏷️ All Areas</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>

          {/* Clear button (only show when filtering) */}
          {(selectedKind !== 'all' || selectedTag !== 'all') && (
            <button
              onClick={() => {
                setSelectedKind('all');
                setSelectedTag('all');
              }}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'update' : 'updates'}
        </p>
      </div>

      {/* Posts list */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-600">No updates found with the selected filters.</p>
          <button
            onClick={() => {
              setSelectedKind('all');
              setSelectedTag('all');
            }}
            className="mt-4 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
          >
            Clear filters to see all updates
          </button>
        </div>
      )}
    </div>
  );
}

