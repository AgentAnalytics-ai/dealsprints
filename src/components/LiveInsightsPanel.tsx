'use client';

import { motion } from 'framer-motion';
import { useLiveInsights } from '@/contexts/LiveInsightsContext';

export function LiveInsightsPanel() {
  const { liveInsight, liveLoading } = useLiveInsights();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border p-6 mb-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900 mb-2">Live Insight</p>
          {liveLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
              <div className="h-3 bg-blue-200 rounded animate-pulse w-3/4"></div>
            </div>
          ) : liveInsight ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                {liveInsight.headline}
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                {liveInsight.summary}
              </p>
              {liveInsight.recommendations?.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-blue-900">Quick Tips:</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    {liveInsight.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-600 mr-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-sm text-blue-700">
              Provide a few details to see live insights
            </div>
          )}
        </div>
        
        <div className="text-right ml-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-xs text-blue-700 mb-1">Quick Score</div>
            <motion.div 
              className="text-3xl font-bold text-blue-900"
              key={liveInsight?.quick_score || 50}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {liveInsight?.quick_score || 50}
            </motion.div>
            <div className="text-xs text-blue-600 mt-1">out of 100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
