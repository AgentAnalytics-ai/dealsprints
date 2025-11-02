"use client";

import { useState } from 'react';
import { Member } from '@/lib/data/mockFeed';
import { MemberCard } from './MemberCard';
import { Search } from 'lucide-react';

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
      {/* Simple Dropdown Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 text-gray-700 font-medium focus:border-brand focus:outline-none transition-colors bg-white"
            />
          </div>

          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 font-medium focus:border-brand focus:outline-none transition-colors bg-white"
          >
            <option value="all">📂 All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Plan dropdown */}
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 font-medium focus:border-brand focus:outline-none transition-colors bg-white"
          >
            <option value="all">👥 All Members</option>
            <option value="pro">⭐ Pro Members</option>
            <option value="verified">✓ Verified Members</option>
            <option value="free">Free Members</option>
          </select>

          {/* Clear button */}
          {(searchTerm || selectedCategory !== 'all' || selectedPlan !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedPlan('all');
              }}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors whitespace-nowrap"
            >
              Clear
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

