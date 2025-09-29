'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, TrendingUp, BarChart3, CheckCircle, Menu, X } from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TopNavigation({ activeTab, onTabChange }: TopNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'evaluation', label: 'Free Business Ranking', icon: TrendingUp, description: 'Get instant business valuation & PDF report' },
    { id: 'marketplace', label: 'Business Map', icon: MapPin, description: 'Explore OKC businesses' },
    { id: 'sold', label: 'Recently Sold', icon: CheckCircle, description: 'See actual sale prices' },
    { id: 'insights', label: 'Market Insights', icon: BarChart3, description: 'AI-powered market data' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onTabChange('marketplace');
      // Add search functionality here
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : 'shadow-sm'
    }`}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Search Bar */}
        <div className="py-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses by name, industry, or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Desktop Tab Navigation */}
        <nav className="hidden md:flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 rounded-t-lg`}
                title={tab.description}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg"
          >
            <span className="font-medium text-gray-700">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </span>
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-500" />
            ) : (
              <Menu className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {isMobileMenuOpen && (
            <div className="mt-2 space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-blue-500'
                        : 'bg-white text-gray-700 border-gray-200'
                    } w-full flex items-center space-x-3 py-3 px-4 border rounded-lg transition-colors`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
