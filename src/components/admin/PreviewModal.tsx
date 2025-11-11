'use client';

import { FeedCard } from '@/components/feed/FeedCard';
import { Post } from '@/lib/data/mockFeed';
import { X, CheckCircle } from 'lucide-react';

interface PreviewModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onPublish?: () => void;
}

export function PreviewModal({ post, isOpen, onClose, onPublish }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Preview Post</h2>
            <p className="text-sm text-gray-600">How this will appear on the feed</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <FeedCard post={post} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Close Preview
          </button>
          
          {onPublish && (
            <button
              onClick={() => {
                onPublish();
                onClose();
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Looks Good - Publish Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

