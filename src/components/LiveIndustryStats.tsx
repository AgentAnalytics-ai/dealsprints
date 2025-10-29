'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Building2, DollarSign, Users, Target, Award, MapPin, Clock, BarChart3 } from 'lucide-react';
import { getIndustryStats, calculateBusinessRanking } from '@/lib/data/industryDatabase';

interface LiveIndustryStatsProps {
  industry: string;
  revenue: string;
  employees: string;
  location: string;
}

export function LiveIndustryStats({ industry, revenue, employees, location }: LiveIndustryStatsProps) {
  const stats = getIndustryStats(industry);
  const ranking = calculateBusinessRanking(industry, revenue, employees, location);

  if (!stats) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border p-6 mb-8">
        <div className="text-center text-blue-700">
          <Building2 className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Select an industry to see live market data</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border p-6 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {stats.name} Market Data
          </h3>
          <p className="text-sm text-blue-700">Live industry insights & your ranking</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {getTrendIcon(stats.trends.direction)}
          <span className={getTrendColor(stats.trends.direction)}>
            {stats.trends.description}
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Companies */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Total Companies</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(stats.totalCompanies / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-600">in this sector</div>
        </div>

        {/* Average Revenue */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">Avg Revenue</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.avgRevenue}</div>
          <div className="text-xs text-gray-600">industry average</div>
        </div>

        {/* Growth Rate */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-gray-500">Growth Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.growthRate}</div>
          <div className="text-xs text-gray-600">annual growth</div>
        </div>

        {/* Market Size */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">Market Size</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.marketSize}</div>
          <div className="text-xs text-gray-600">total market</div>
        </div>
      </div>

      {/* Your Business Ranking */}
      {(revenue || employees) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 shadow-sm border-2 border-blue-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Your Business Ranking
            </h4>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {ranking.marketPosition}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Revenue Percentile */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Revenue Ranking</span>
                <span className="text-sm font-bold text-blue-600">{ranking.revenuePercentile}th percentile</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${ranking.revenuePercentile}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Employee Percentile */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Team Size</span>
                <span className="text-sm font-bold text-green-600">{ranking.employeePercentile}th percentile</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-green-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${ranking.employeePercentile}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>

            {/* Valuation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Est. Valuation</span>
                <span className="text-sm font-bold text-purple-600">{ranking.valuation}</span>
              </div>
              <div className="text-xs text-gray-600">
                {ranking.multiplier} multiplier • {ranking.premium}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Profit Margin</div>
          <div className="font-semibold text-gray-900">{stats.keyMetrics.profitMargin}</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Avg Employees</div>
          <div className="font-semibold text-gray-900">{stats.keyMetrics.employeeCount}</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Years to Exit</div>
          <div className="font-semibold text-gray-900">{stats.keyMetrics.yearsToExit}</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Funding Raised</div>
          <div className="font-semibold text-gray-900">{stats.keyMetrics.fundingRaised}</div>
        </div>
      </div>

      {/* Top Markets */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Top Markets</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {stats.topMarkets.map((market, index) => (
            <span
              key={market}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
            >
              {market}
            </span>
          ))}
        </div>
      </div>

      {/* Buyer Activity */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-700">Avg Close Time: {stats.avgCloseTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            stats.buyerActivity === 'High' ? 'bg-green-500' :
            stats.buyerActivity === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-700">{stats.buyerActivity} Buyer Activity</span>
        </div>
      </div>
    </motion.div>
  );
}
