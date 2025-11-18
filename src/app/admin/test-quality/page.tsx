'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle, AlertTriangle, TrendingUp, BarChart3, FileText, XCircle } from 'lucide-react';

interface PostQuality {
  id: string;
  source_name: string;
  scraped_title: string;
  ai_summary: string;
  ai_category: string;
  ai_location: string;
  ai_tags: string[];
  scraped_date: string;
  created_at: string;
  data_type?: string;
  quality_score?: number;
  issues?: string[];
}

interface QualityReport {
  success: boolean;
  period: {
    month: number;
    year: number;
  };
  summary: {
    totalPosts: number;
    avgQualityScore: number;
    legalPosts: number;
    copyrightedPosts: number;
    highQualityCount: number;
    issuesCount: number;
  };
  bySource: Record<string, {
    count: number;
    avgScore: number;
    posts: PostQuality[];
  }>;
  samples: {
    highQuality: PostQuality[];
    withIssues: PostQuality[];
  };
  allPosts: PostQuality[];
}

export default function TestQualityPage() {
  const [report, setReport] = useState<QualityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState('11');
  const [year, setYear] = useState('2025');
  const [selectedView, setSelectedView] = useState<'summary' | 'samples' | 'all'>('summary');

  async function runQualityTest() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/test-content-quality?month=${month}&year=${year}`);
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    runQualityTest();
  }, []);

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Content Quality Test
            </h1>
            <p className="text-gray-600 mb-6">
              Professional testing tool to verify system is working and producing high-quality, original content.
            </p>

            {/* Date Selector */}
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month:</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <option key={m} value={m}>{new Date(2025, m - 1).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year:</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={runQualityTest}
                  disabled={isLoading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Analyzing...' : 'Run Quality Test'}
                </button>
              </div>
            </div>
          </div>

          {report && (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-600">Total Posts</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{report.summary.totalPosts}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-600">Avg Quality</h3>
                  </div>
                  <p className={`text-3xl font-bold ${getQualityColor(report.summary.avgQualityScore).split(' ')[0]}`}>
                    {report.summary.avgQualityScore}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getQualityLabel(report.summary.avgQualityScore)}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="text-sm font-medium text-gray-600">Legal Sources</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{report.summary.legalPosts}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {report.summary.copyrightedPosts > 0 && (
                      <span className="text-red-600">{report.summary.copyrightedPosts} copyrighted</span>
                    )}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-5 h-5 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-600">High Quality</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{report.summary.highQualityCount}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {report.summary.issuesCount} with issues
                  </p>
                </div>
              </div>

              {/* Source Breakdown */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Source Breakdown</h2>
                <div className="space-y-4">
                  {Object.entries(report.bySource).map(([source, data]) => {
                    const isCopyrighted = ['Journal Record', 'Oklahoman', 'OKC Friday', 'NonDoc', 'Business Journal', 'Gazette']
                      .some(c => source.includes(c));
                    
                    return (
                      <div key={source} className={`p-4 rounded-lg border ${isCopyrighted ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{source}</h3>
                            {isCopyrighted && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                COPYRIGHTED
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{data.count} posts</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getQualityColor(data.avgScore)}`}>
                              {data.avgScore}% quality
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setSelectedView('summary')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedView === 'summary'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setSelectedView('samples')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedView === 'samples'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sample Posts
                </button>
                <button
                  onClick={() => setSelectedView('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedView === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Posts ({report.allPosts.length})
                </button>
              </div>

              {/* Content Views */}
              {selectedView === 'summary' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Quality Summary</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">System Status</h3>
                      </div>
                      <ul className="text-sm text-green-800 space-y-1 ml-7">
                        <li>✅ {report.summary.legalPosts} posts from legal sources</li>
                        <li>✅ Average quality score: {report.summary.avgQualityScore}%</li>
                        <li>✅ {report.summary.highQualityCount} high-quality posts (80%+)</li>
                        {report.summary.copyrightedPosts === 0 && (
                          <li>✅ No copyrighted sources detected</li>
                        )}
                      </ul>
                    </div>

                    {report.summary.copyrightedPosts > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <h3 className="font-semibold text-red-900">⚠️ Copyrighted Sources Found</h3>
                        </div>
                        <p className="text-sm text-red-800 ml-7">
                          {report.summary.copyrightedPosts} posts from copyrighted sources. 
                          Use <a href="/admin/cleanup" className="underline font-semibold">cleanup tool</a> to remove them.
                        </p>
                      </div>
                    )}

                    {report.summary.issuesCount > 0 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <h3 className="font-semibold text-yellow-900">Posts with Issues</h3>
                        </div>
                        <p className="text-sm text-yellow-800 ml-7">
                          {report.summary.issuesCount} posts have quality issues. Review samples below.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedView === 'samples' && (
                <div className="space-y-6">
                  {/* High Quality Samples */}
                  {report.samples.highQuality.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        High Quality Samples (Score 80%+)
                      </h2>
                      <div className="space-y-4">
                        {report.samples.highQuality.map(post => (
                          <div key={post.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{post.scraped_title}</h3>
                                <p className="text-sm text-gray-600">
                                  Source: {post.source_name} • {post.ai_category} • {post.ai_location}
                                </p>
                              </div>
                              <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded">
                                {post.quality_score}%
                              </span>
                            </div>
                            <p className="text-gray-700 mt-2">{post.ai_summary}</p>
                            <div className="flex gap-2 mt-3">
                              {post.ai_tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Posts with Issues */}
                  {report.samples.withIssues.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        Posts with Issues
                      </h2>
                      <div className="space-y-4">
                        {report.samples.withIssues.map(post => (
                          <div key={post.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{post.scraped_title}</h3>
                                <p className="text-sm text-gray-600">
                                  Source: {post.source_name} • {post.ai_category} • {post.ai_location}
                                </p>
                              </div>
                              <span className="px-3 py-1 bg-yellow-600 text-white text-sm font-semibold rounded">
                                {post.quality_score}%
                              </span>
                            </div>
                            <p className="text-gray-700 mt-2">{post.ai_summary}</p>
                            {post.issues && post.issues.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-semibold text-yellow-900 mb-1">Issues:</p>
                                <ul className="text-sm text-yellow-800 space-y-1">
                                  {post.issues.map((issue, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <XCircle className="w-4 h-4" />
                                      {issue}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedView === 'all' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">All Posts</h2>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {report.allPosts.map(post => (
                      <div key={post.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{post.scraped_title}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {post.source_name} • {post.ai_category} • {post.ai_location}
                            </p>
                            <p className="text-gray-700 text-sm">{post.ai_summary}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-semibold rounded ml-4 ${getQualityColor(post.quality_score || 0)}`}>
                            {post.quality_score}%
                          </span>
                        </div>
                        {post.issues && post.issues.length > 0 && (
                          <div className="mt-2 text-xs text-yellow-700">
                            Issues: {post.issues.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

