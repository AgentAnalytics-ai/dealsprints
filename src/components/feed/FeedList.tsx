"use client";

import { useState } from 'react';
import { Post } from '@/lib/data/mockFeed';
import { FeedCard } from './FeedCard';
import { Filter } from 'lucide-react';

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
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kind filter */}
            <div>
              <label htmlFor="kind-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                id="kind-filter"
                value={selectedKind}
                onChange={(e) => setSelectedKind(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="all">All Types</option>
                <option value="development">Developments</option>
                <option value="opening">New Openings</option>
                <option value="expansion">Expansions</option>
                <option value="event">Events</option>
                <option value="data-insight">Market Data</option>
              </select>
            </div>

            {/* Tag filter */}
            <div>
              <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Tag
              </label>
              <select
                id="tag-filter"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(selectedKind !== 'all' || selectedTag !== 'all') && (
            <button
              onClick={() => {
                setSelectedKind('all');
                setSelectedTag('all');
              }}
              className="mt-4 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
            >
              Clear filters
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

