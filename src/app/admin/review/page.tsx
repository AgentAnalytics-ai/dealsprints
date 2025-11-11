"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, ExternalLink, Upload, Calendar, MapPin, Tag, Eye, RefreshCw } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PreviewModal } from '@/components/admin/PreviewModal';
import { Post } from '@/lib/data/mockFeed';

interface PendingPost {
  id: string;
  source_url: string;
  source_name: string;
  scraped_title: string;
  scraped_date: string;
  ai_summary: string;
  ai_category: string | null;
  ai_location: string | null;
  ai_tags: string[];
  photo_url: string | null;
  status: string;
  created_at: string;
}

export default function AdminReviewPage() {
  const [posts, setPosts] = useState<PendingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch pending posts
  useEffect(() => {
    fetchPendingPosts();
  }, []);

  async function fetchPendingPosts() {
    try {
      // Add timestamp to bust cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/pending-posts?t=${timestamp}`, {
        cache: 'no-store'
      });
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle photo upload
  async function handlePhotoUpload(postId: string, file: File) {
    setUploadingId(postId);
    
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('postId', postId);
      
      const response = await fetch('/api/admin/upload-photo', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refetch to get latest data from database
        await fetchPendingPosts();
      } else {
        alert('Failed to upload photo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading photo');
    } finally {
      setUploadingId(null);
    }
  }

  // Handle publish
  async function handlePublish(postId: string) {
    const post = posts.find(p => p.id === postId);
    if (!post?.photo_url) {
      alert('Please upload a photo first!');
      return;
    }

    setPublishingId(postId);
    
    try {
      const response = await fetch('/api/admin/publish-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from list
        setPosts(posts.filter(p => p.id !== postId));
        alert('Published successfully!');
      } else {
        alert('Failed to publish');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Error publishing post');
    } finally {
      setPublishingId(null);
    }
  }

  // Handle reject
  async function handleReject(postId: string) {
    if (!confirm('Are you sure you want to reject this post?')) return;
    
    try {
      const response = await fetch('/api/admin/reject-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
      }
    } catch (error) {
      console.error('Reject error:', error);
    }
  }

  // Convert PendingPost to Post format for preview
  function convertToPost(pendingPost: PendingPost): Post {
    return {
      id: pendingPost.id,
      kind: (pendingPost.ai_category || 'opening') as Post['kind'],
      title: pendingPost.scraped_title,
      location: pendingPost.ai_location || 'Oklahoma City, OK',
      date: pendingPost.scraped_date,
      summary: pendingPost.ai_summary,
      source: pendingPost.source_name,
      sourceUrl: pendingPost.source_url,
      tags: pendingPost.ai_tags || [],
      imageUrl: pendingPost.photo_url || undefined,
    };
  }

  // Handle preview
  function handlePreview(pendingPost: PendingPost) {
    const post = convertToPost(pendingPost);
    setPreviewPost(post);
    setIsPreviewOpen(true);
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending posts...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Review Queue
              </h1>
              <p className="text-xl text-gray-600">
                {posts.length} posts pending review — Add photos and approve to publish
              </p>
            </div>
            <button
              onClick={() => fetchPendingPosts()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
              <p className="text-gray-600">No posts pending review. Check back after the next scrape runs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  {/* Photo Upload Area */}
                  <div className="relative bg-gray-100 h-64 flex items-center justify-center">
                    {post.photo_url ? (
                      <img 
                        src={post.photo_url} 
                        alt={post.scraped_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-3 p-8 hover:bg-gray-200 transition-colors rounded-xl">
                        <Upload className="w-12 h-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {uploadingId === post.id ? 'Uploading...' : 'Click to upload photo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingId === post.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(post.id, file);
                          }}
                        />
                      </label>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-lg">
                        {post.ai_category || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {post.scraped_title}
                    </h3>

                    {/* AI Summary */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {post.ai_summary}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4 text-sm">
                      {post.ai_location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{post.ai_location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.scraped_date).toLocaleDateString()}</span>
                      </div>
                      {post.ai_tags.length > 0 && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Tag className="w-4 h-4" />
                          <div className="flex flex-wrap gap-1">
                            {post.ai_tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Source Link */}
                    <a
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-purple-600 transition-colors mb-6"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View source at {post.source_name}
                    </a>

                    {/* Preview Button */}
                    {post.photo_url && (
                      <div className="mb-4">
                        <button
                          onClick={() => handlePreview(post)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                          Preview How This Will Look on Feed
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handlePublish(post.id)}
                        disabled={!post.photo_url || publishingId === post.id}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <CheckCircle className="w-5 h-5" />
                        {publishingId === post.id ? 'Publishing...' : 'Approve & Publish'}
                      </button>
                      
                      <button
                        onClick={() => handleReject(post.id)}
                        className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Manual Add Button */}
          <div className="mt-12 text-center">
            <a
              href="/admin/add-post"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:border-indigo-500 hover:scale-105 transition-all shadow-lg"
            >
              Manually Add Post
            </a>
          </div>
        </div>
      </main>
      <Footer />

      {/* Preview Modal */}
      {previewPost && (
        <PreviewModal
          post={previewPost}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewPost(null);
          }}
          onPublish={() => {
            if (previewPost) {
              handlePublish(previewPost.id);
            }
          }}
        />
      )}
    </>
  );
}

