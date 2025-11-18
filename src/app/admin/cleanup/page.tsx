'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Trash2, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

export default function CleanupPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<'preview' | 'delete'>('preview');

  async function runCleanup() {
    if (mode === 'delete') {
      if (!confirm('⚠️ WARNING: This will permanently delete all posts from copyrighted sources (Journal Record, Oklahoman, etc.).\n\nThis cannot be undone. Continue?')) {
        return;
      }
    }

    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/cleanup-copyrighted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dryRun: mode === 'preview',
          confirm: mode === 'delete',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          ...data,
        });
      } else {
        setResult({
          success: false,
          error: data.error || 'Unknown error',
          details: data.details,
        });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Cleanup Copyrighted Sources
            </h1>
            <p className="text-gray-600 mb-6">
              Remove all posts from copyrighted news sources (Journal Record, Oklahoman, etc.)
              that were removed from the scraper. This helps avoid copyright issues.
            </p>

            {/* Warning */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Important</h3>
                  <p className="text-sm text-yellow-800">
                    This will permanently delete posts from copyrighted sources. 
                    Legal sources (City of OKC, Greater OKC Partnership, etc.) will be kept.
                  </p>
                </div>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="preview"
                    checked={mode === 'preview'}
                    onChange={(e) => setMode(e.target.value as 'preview' | 'delete')}
                    disabled={isRunning}
                    className="w-4 h-4"
                  />
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview (Dry Run)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="delete"
                    checked={mode === 'delete'}
                    onChange={(e) => setMode(e.target.value as 'preview' | 'delete')}
                    disabled={isRunning}
                    className="w-4 h-4"
                  />
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete (Permanent)
                  </span>
                </label>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runCleanup}
              disabled={isRunning}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === 'delete'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'preview' ? 'Previewing...' : 'Deleting...'}
                </>
              ) : (
                <>
                  {mode === 'preview' ? <Eye className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                  {mode === 'preview' ? 'Preview Cleanup' : 'Delete Copyrighted Posts'}
                </>
              )}
            </button>

            {/* Results */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {result.success ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">
                        {result.dryRun ? 'Preview Complete' : 'Cleanup Complete'}
                      </h3>
                    </div>
                    <p className="text-green-800 mb-3">{result.message}</p>
                    {result.stats && (
                      <div className="space-y-2 text-sm text-green-700">
                        <p><strong>Total to {result.dryRun ? 'delete' : 'deleted'}:</strong> {result.stats.totalToDelete || result.stats.deleted}</p>
                        {result.stats.bySource && (
                          <div>
                            <strong>By source:</strong>
                            <ul className="ml-4 mt-1 list-disc">
                              {Object.entries(result.stats.bySource).map(([source, count]) => (
                                <li key={source}>{source}: {count as number}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.stats.remainingLegalPosts !== undefined && (
                          <p><strong>Remaining legal posts:</strong> {result.stats.remainingLegalPosts}</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">Cleanup Failed</h3>
                    </div>
                    <p className="text-red-800">{result.error}</p>
                    {result.details && (
                      <p className="text-sm text-red-700 mt-2">{result.details}</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What This Does:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Removes posts from copyrighted sources (Journal Record, Oklahoman, etc.)</li>
                <li>• Keeps all legal sources (City of OKC, Greater OKC Partnership, etc.)</li>
                <li>• Use Preview mode first to see what will be deleted</li>
                <li>• This action cannot be undone</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

