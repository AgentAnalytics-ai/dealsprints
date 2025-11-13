'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Upload, Calendar, MapPin, Tag, ExternalLink, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface PublishedPost {
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
  published_at: string;
  created_at: string;
}

export default function AdminPublishedPage() {
  const [posts, setPosts] = useState<PublishedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Fetch published posts
  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  async function fetchPublishedPosts() {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/published-posts?t=${timestamp}`, {
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

  // Handle photo upload/replace
  async function handlePhotoChange(postId: string, file: File) {
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
        // Update local state
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, photo_url: data.photoUrl } : p
        ));
        alert('Photo updated successfully!');
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

  // Handle photo removal
  async function handleRemovePhoto(postId: string) {
    if (!confirm('Remove this photo? You can upload a new one.')) return;
    
    try {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, photo_url: null } : p
      ));
      alert('Photo removed! Upload a new one and save.');
    } catch (error) {
      console.error('Remove photo error:', error);
    }
  }

  // Handle unpublish
  async function handleUnpublish(postId: string) {
    if (!confirm('Unpublish this post? It will go back to pending review.')) return;
    
    try {
      const response = await fetch('/api/admin/unpublish-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
        alert('Post unpublished successfully!');
      }
    } catch (error) {
      console.error('Unpublish error:', error);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading published posts...</p>
        </div>
        <Footer />
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
                Published Posts
              </h1>
              <p className="text-xl text-gray-600">
                {posts.length} posts live — Edit photos or unpublish if needed
              </p>
            </div>
            <button
              onClick={() => fetchPublishedPosts()}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Published Posts</h2>
              <p className="text-gray-600">Go to Review Queue to publish some posts first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
                >
                  {/* Photo Area with Edit Controls */}
                  <div className="relative bg-gray-100 h-64 flex items-center justify-center group">
                    {post.photo_url ? (
                      <>
                        <img 
                          src={post.photo_url} 
                          alt={post.scraped_title}
                          className="w-full h-full object-cover"
                        />
                        {/* Photo Controls Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleRemovePhoto(post.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Photo
                          </button>
                          <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer">
                            <Upload className="w-4 h-4" />
                            Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePhotoChange(post.id, file);
                              }}
                            />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-3 p-8 hover:bg-gray-200 transition-colors rounded-xl w-full h-full">
                        <Upload className="w-12 h-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {uploadingId === post.id ? 'Uploading...' : 'Click to add photo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingId === post.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoChange(post.id, file);
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
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
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
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
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
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-purple-600 transition-colors mb-4"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View source at {post.source_name}
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleUnpublish(post.id)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Unpublish
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

