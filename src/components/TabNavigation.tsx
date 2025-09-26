'use client';

import { useState } from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'evaluation', label: 'Free Business Evaluation', icon: '📊' },
    { id: 'marketplace', label: 'Business Marketplace', icon: '🗺️' },
    { id: 'sold', label: 'Recently Sold', icon: '✅' },
    { id: 'insights', label: 'Market Insights', icon: '📈' }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
