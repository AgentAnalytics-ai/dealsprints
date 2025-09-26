'use client';

import { useState } from 'react';
import { OKCBusinessMap } from './OKCBusinessMap';
import { BusinessSearch } from './BusinessSearch';

export function BusinessMarketplaceTab() {
  console.log('BusinessMarketplaceTab rendered');
  const [searchFilters, setSearchFilters] = useState({
    industry: '',
    status: '',
    priceRange: ''
  });

  const handleSearch = (filters: { industry: string; status: string; priceRange: string }) => {
    setSearchFilters(filters);
    console.log('Search filters applied:', filters);
  };
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Oklahoma City Business Marketplace
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover businesses for sale, find investment opportunities, and connect with business owners in OKC. 
            The first AI-powered, gamified business marketplace.
          </p>
          <div className="mt-8 flex justify-center space-x-8 text-sm">
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="font-medium text-green-800">AI-Powered Valuations</span>
            </div>
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="font-medium text-blue-800">Real-Time Data</span>
            </div>
            <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <span className="font-medium text-purple-800">Expert Insights</span>
            </div>
          </div>
        </div>
        
        <BusinessSearch onSearch={handleSearch} />
        <OKCBusinessMap searchFilters={searchFilters} />
      </div>
    </div>
  );
}
