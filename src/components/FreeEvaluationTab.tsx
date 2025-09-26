'use client';

import { Assessment } from './Assessment';

export function FreeEvaluationTab() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Your Free Business Evaluation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your business's true value in 60 seconds. Get instant market insights, 
            competitive analysis, and a professional valuation report.
          </p>
          <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Instant Results
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              AI-Powered Analysis
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Professional Report
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Assessment />
        </div>
      </div>
    </div>
  );
}
