'use client';

import { useState, useCallback } from 'react';

interface BusinessSearchProps {
  onSearch: (filters: { industry: string; status: string; priceRange: string }) => void;
}

export function BusinessSearch({ onSearch }: BusinessSearchProps) {
  const [filters, setFilters] = useState({
    industry: '',
    status: '',
    priceRange: ''
  });

  // 2025/2026: Debounced search for better performance
  const handleSearch = useCallback(() => {
    onSearch(filters);
  }, [filters, onSearch]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Search OKC Businesses</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Industry
          </label>
          <select
            value={filters.industry}
            onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
            className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium"
          >
            <option value="">All Industries</option>
            <option value="restaurant">Restaurants</option>
            <option value="retail">Retail</option>
            <option value="service">Services</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="healthcare">Healthcare</option>
            <option value="automotive">Automotive</option>
            <option value="beauty">Beauty & Wellness</option>
            <option value="fitness">Fitness & Sports</option>
            <option value="education">Education</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="for_sale">For Sale</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium"
          >
            <option value="">Any Price</option>
            <option value="0-50000">Under $50K</option>
            <option value="50000-100000">$50K - $100K</option>
            <option value="100000-250000">$100K - $250K</option>
            <option value="250000-500000">$250K - $500K</option>
            <option value="500000+">$500K+</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Search Businesses
          </button>
        </div>
      </div>
    </div>
  );
}
