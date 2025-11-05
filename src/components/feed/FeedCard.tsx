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
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
      {/* Featured Image - CONSISTENT SIZE */}
      {post.imageUrl && (
        <div className="w-full h-56 bg-gray-100 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header with kind badge */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${kindColors[post.kind]}`}>
            {kindLabels[post.kind]}
          </span>
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Title - CONSISTENT TYPOGRAPHY */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
          {post.title}
        </h3>

        {/* Summary - CONSISTENT LENGTH */}
        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
          {post.summary}
        </p>

        {/* Metadata footer - CONSISTENT LAYOUT */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-3 text-sm">
            {post.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{post.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {post.sourceUrl && (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-purple-600 transition-colors group"
            >
              <span>Read full story at {post.source}</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
          {!post.sourceUrl && post.source && (
            <span className="text-sm text-gray-500 font-medium">
              Source: {post.source}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

