"use client";

import { useState } from 'react';
import { Member } from '@/lib/data/mockFeed';
import { MemberCard } from './MemberCard';
import { Search, SlidersHorizontal } from 'lucide-react';

interface MemberGridProps {
  members: Member[];
  showFilters?: boolean;
}

export function MemberGrid({ members, showFilters = true }: MemberGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');

  // Get unique categories
  const categories = Array.from(
    new Set(members.map(m => m.category))
  ).sort();

  // Filter members
  const filteredMembers = members.filter(member => {
    // Search filter
    if (searchTerm && !member.businessName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !member.tagline.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!member.ownerName || !member.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && member.category !== selectedCategory) {
      return false;
    }

    // Plan filter
    if (selectedPlan !== 'all' && member.plan !== selectedPlan) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filter Members</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="Business name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            {/* Category filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Plan filter */}
            <div>
              <label htmlFor="plan-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Membership
              </label>
              <select
                id="plan-filter"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="all">All Members</option>
                <option value="pro">Pro Members</option>
                <option value="verified">Verified Members</option>
                <option value="free">Free Members</option>
              </select>
            </div>
          </div>

          {(searchTerm || selectedCategory !== 'all' || selectedPlan !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedPlan('all');
              }}
              className="mt-4 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> {filteredMembers.length === 1 ? 'member' : 'members'}
        </p>
      </div>

      {/* Members grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.slug} member={member} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-600">No members found with the selected filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedPlan('all');
            }}
            className="mt-4 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
          >
            Clear filters to see all members
          </button>
        </div>
      )}
    </div>
  );
}

