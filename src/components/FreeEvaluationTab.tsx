'use client';

import SurveyForm from './SurveyForm';

export function FreeEvaluationTab() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-6">
        {/* Psychology-Optimized Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Your Free Business Ranking & Market Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how your business compares to the market and get a detailed PDF report with 
            location-based insights, growth recommendations, and competitive analysis.
          </p>
          
          {/* Value Proposition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-green-600 text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-green-800 mb-2">Market Ranking</h3>
              <p className="text-sm text-green-700">See where your business ranks compared to similar businesses in your area</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 text-2xl mb-3">📍</div>
              <h3 className="font-semibold text-blue-800 mb-2">Location Analysis</h3>
              <p className="text-sm text-blue-700">Understand how your location impacts your business value and growth potential</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="text-purple-600 text-2xl mb-3">📈</div>
              <h3 className="font-semibold text-purple-800 mb-2">Growth Insights</h3>
              <p className="text-sm text-purple-700">Get actionable insights on how to improve your business performance</p>
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              What You'll Get in Your Free PDF Report
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Business Valuation</h4>
                  <p className="text-sm text-gray-600">Professional estimate based on market data</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Market Comparison</h4>
                  <p className="text-sm text-gray-600">See how you stack up against competitors</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Growth Recommendations</h4>
                  <p className="text-sm text-gray-600">Actionable steps to increase your business value</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Location Analysis</h4>
                  <p className="text-sm text-gray-600">Understand your market position and opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Assessment Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Start Your Free Analysis
            </h3>
            <p className="text-gray-600">
              Takes less than 2 minutes to complete
            </p>
          </div>
          <SurveyForm />
        </div>
      </div>
    </div>
  );
}
