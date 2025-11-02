import { Post } from '@/lib/data/mockFeed';
import { Building2, Calendar, ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';

interface FeedCardProps {
  post: Post;
}

const kindColors = {
  development: 'bg-blue-100 text-blue-800 border-blue-200',
  opening: 'bg-green-100 text-green-800 border-green-200',
  expansion: 'bg-purple-100 text-purple-800 border-purple-200',
  event: 'bg-orange-100 text-orange-800 border-orange-200',
  'data-insight': 'bg-gray-100 text-gray-800 border-gray-200',
};

const kindLabels = {
  development: 'Development',
  opening: 'New Opening',
  expansion: 'Expansion',
  event: 'Event',
  'data-insight': 'Market Data',
};

export function FeedCard({ post }: FeedCardProps) {
  return (
    <article className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header with kind badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${kindColors[post.kind]}`}>
              {kindLabels[post.kind]}
            </span>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
            {post.title}
          </h3>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {post.summary}
      </p>

      {/* Metadata footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600">
          {post.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{post.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {post.sourceUrl && (
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
          >
            <span>Source: {post.source}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {!post.sourceUrl && post.source && (
          <span className="text-sm text-gray-500">
            Source: {post.source}
          </span>
        )}
      </div>
    </article>
  );
}

