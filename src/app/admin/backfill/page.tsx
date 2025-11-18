'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function BackfillPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [monthsBack, setMonthsBack] = useState(2);
  const [sourceName, setSourceName] = useState('OKC Chamber');

  async function runBackfill() {
    if (!confirm(`Backfill ${sourceName} posts from the past ${monthsBack} months? This may take a few minutes.`)) {
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/backfill-chamber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthsBack, sourceName }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: data.message,
          stats: data.stats,
        });
      } else {
        setResult({
          success: false,
          error: data.error || 'Unknown error',
        });
      }
    } catch (error) {
      console.error('Backfill error:', error);
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
              Backfill Historical Posts
            </h1>
            <p className="text-gray-600 mb-6">
              Fetch historical posts from RSS feeds. This will process articles from the past 1-2 months and add them to your database.
            </p>

            {/* Settings */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source:
                </label>
                <select
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isRunning}
                >
                  <option value="OKC Chamber">OKC Chamber</option>
                  <option value="City of OKC News">City of OKC News</option>
                  <option value="Greater OKC Partnership">Greater OKC Partnership</option>
                  <option value="Downtown OKC Inc">Downtown OKC Inc</option>
                  <option value="i2E - Innovation to Enterprise">i2E - Innovation to Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Months Back:
                </label>
                <select
                  value={monthsBack}
                  onChange={(e) => setMonthsBack(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isRunning}
                >
                  <option value={1}>1 Month</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                </select>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runBackfill}
              disabled={isRunning}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running Backfill...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Run Backfill
                </>
              )}
            </button>

            {/* Results */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {result.success ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Backfill Complete!</h3>
                    </div>
                    <p className="text-green-800 mb-3">{result.message}</p>
                    {result.stats && (
                      <div className="space-y-1 text-sm text-green-700">
                        <p>• Total Articles: {result.stats.totalArticles}</p>
                        <p>• OKC Articles: {result.stats.okcArticles}</p>
                        <p>• Recent Articles: {result.stats.recentArticles}</p>
                        <p>• New Posts Added: {result.stats.totalNew}</p>
                        <p>• Duplicates Skipped: {result.stats.totalDuplicates}</p>
                        {result.stats.totalErrors > 0 && (
                          <p>• Errors: {result.stats.totalErrors}</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">Backfill Failed</h3>
                    </div>
                    <p className="text-red-800">{result.error}</p>
                  </>
                )}
              </div>
            )}

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">How It Works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Fetches RSS feed from {sourceName}</li>
                <li>• Filters for OKC metro area articles</li>
                <li>• Processes articles from the past {monthsBack} months</li>
                <li>• Skips duplicates (articles already in database)</li>
                <li>• Uses AI to rewrite summaries</li>
                <li>• Adds posts with status "pending_photo"</li>
                <li>• Go to Review Queue to add photos and publish</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

