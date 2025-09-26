'use client';

import { OKCBusinessMap } from './OKCBusinessMap';
import { BusinessSearch } from './BusinessSearch';

export function BusinessMarketplaceTab() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oklahoma City Business Marketplace
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover businesses for sale, find investment opportunities, and connect with business owners in OKC. 
            The first AI-powered, gamified business marketplace.
          </p>
          <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              AI-Powered Valuations
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Real-Time Data
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Expert Insights
            </div>
          </div>
        </div>
        
        <BusinessSearch onSearch={(filters) => console.log('Search filters:', filters)} />
        <OKCBusinessMap />
      </div>
    </div>
  );
}
