/**
 * OKC Realtor Intelligence Dashboard
 * Professional-grade dashboard for real estate professionals
 * 
 * Features:
 * - Interactive map with lead visualization
 * - Advanced filtering and search
 * - Lead scoring and prioritization
 * - Real-time stats and analytics
 * - Professional UI/UX
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SubscriptionGate } from '@/components/realtor/SubscriptionGate';
import { 
  MapPin, Filter, TrendingUp, DollarSign, Calendar, Building2, 
  UtensilsCrossed, Home, Zap, Sparkles, ArrowRight, Search, 
  Download, Share2, Star, Clock, Target, BarChart3, Layers
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import Google Maps to avoid SSR issues
const GoogleMap = dynamic(() => import('@/components/realtor/RealtorMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[700px] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-xl" />
});

interface Lead {
  id: string;
  type: string;
  title: string;
  address: string;
  value: number;
  date: string;
  summary: string;
  location: string;
  source: string;
  sourceUrl: string;
  tags: string[];
  score: number;
  opportunity: 'hot' | 'warm' | 'future';
  // Market intelligence fields
  impact_type: 'positive' | 'negative' | 'mixed' | null;
  impact_radius: number | null;
  impact_value_change: number | null;
  development_status: 'planned' | 'approved' | 'in_progress' | 'completed' | null;
  coordinates: { lat: number; lng: number } | null;
}

interface DashboardStats {
  total: number;
  byType: Record<string, number>;
  byOpportunity: {
    hot: number;
    warm: number;
    future: number;
  };
  totalValue: number;
  avgValue: number;
}

export default function RealtorDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [impactFilter, setImpactFilter] = useState<string>('all');
  const [opportunityFilter, setOpportunityFilter] = useState<string>('all');
  const [minValue, setMinValue] = useState<number>(0);
  const [daysFilter, setDaysFilter] = useState<number>(30);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [activeTab, setActiveTab] = useState<'impact' | 'opportunities' | 'all'>('impact');

  // Fetch leads
  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (typeFilter !== 'all') params.append('type', typeFilter);
        if (minValue > 0) params.append('minValue', minValue.toString());
        params.append('days', daysFilter.toString());

        const response = await fetch(`/api/realtor/leads?${params.toString()}`);
        const data = await response.json();

        // Geocode addresses
        const geocodedLeads = await Promise.all(
          data.leads.map(async (lead: Lead) => {
            if (lead.coordinates) return lead;
            
            try {
              const geoResponse = await fetch('/api/realtor/geocode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: lead.address }),
              });
              const geoData = await geoResponse.json();
              return { ...lead, coordinates: { lat: geoData.lat, lng: geoData.lng } };
            } catch (error) {
              return lead;
            }
          })
        );

        // Filter by opportunity
        const filteredLeads = opportunityFilter === 'all'
          ? geocodedLeads
          : geocodedLeads.filter((lead: Lead) => lead.opportunity === opportunityFilter);

        setLeads(filteredLeads);
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, [typeFilter, minValue, daysFilter, opportunityFilter]);

  // Search and impact filter
  const filteredLeads = useMemo(() => {
    let filtered = leads;
    
    // Tab filter (productized view)
    if (activeTab === 'impact') {
      // Show only developments affecting property values
      filtered = filtered.filter(lead => 
        lead.impact_type === 'negative' || lead.impact_type === 'positive' || lead.impact_type === 'mixed'
      );
    } else if (activeTab === 'opportunities') {
      // Show only new opportunities (permits, licenses)
      filtered = filtered.filter(lead => 
        lead.type === 'permit' || lead.type === 'license' || lead.type === 'liquor'
      );
    }
    // 'all' tab shows everything
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(lead => lead.type === typeFilter);
    }
    
    // Impact type filter
    if (impactFilter === 'negative') {
      filtered = filtered.filter(lead => lead.impact_type === 'negative');
    } else if (impactFilter === 'positive') {
      filtered = filtered.filter(lead => lead.impact_type === 'positive');
    } else if (impactFilter === 'mixed') {
      filtered = filtered.filter(lead => lead.impact_type === 'mixed');
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.title.toLowerCase().includes(query) ||
        lead.address.toLowerCase().includes(query) ||
        lead.summary?.toLowerCase().includes(query) ||
        lead.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [leads, activeTab, searchQuery, typeFilter, impactFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'permit': return <Building2 className="w-4 h-4" />;
      case 'liquor': return <UtensilsCrossed className="w-4 h-4" />;
      case 'property': return <Home className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'permit': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'liquor': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'property': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'zoning': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getOpportunityBadge = (opportunity: string) => {
    switch (opportunity) {
      case 'hot':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
            <Zap className="w-3 h-3" />
            Hot Lead
          </span>
        );
      case 'warm':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200">
            Warm
          </span>
        );
      case 'future':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
            Future
          </span>
        );
      default:
        return null;
    }
  };

  const getImpactBadge = (lead: Lead) => {
    if (!lead.impact_type) return null;
    
    const colors = {
      negative: 'bg-red-50 text-red-700 border-red-200',
      positive: 'bg-green-50 text-green-700 border-green-200',
      mixed: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };
    
    const icons = {
      negative: '🔴',
      positive: '🟢',
      mixed: '🟡',
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${colors[lead.impact_type]} text-xs font-semibold rounded-full border`}>
        {icons[lead.impact_type]}
        {lead.impact_type === 'negative' && 'Negative'}
        {lead.impact_type === 'positive' && 'Positive'}
        {lead.impact_type === 'mixed' && 'Mixed'}
        {lead.impact_value_change && ` ${lead.impact_value_change > 0 ? '+' : ''}${lead.impact_value_change}%`}
        {lead.impact_radius && ` (${lead.impact_radius}mi)`}
      </span>
    );
  };

  return (
    <SubscriptionGate>
      <main className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Professional Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  What's Happening in OKC
                </h1>
                <p className="text-gray-600">
                  Everything we're tracking: permits, licenses, developments, news • Updated daily at 6am
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <a
                  href={`/api/realtor/leads/export?type=${typeFilter}&minValue=${minValue}&days=${daysFilter}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </a>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Total</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                  <div className="text-xs text-blue-700 mt-1">Active Leads</div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-5 h-5 text-red-600" />
                    <span className="text-xs font-medium text-red-700">Priority</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">{stats.byOpportunity.hot}</div>
                  <div className="text-xs text-red-700 mt-1">Hot Leads</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">Value</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-900">
                    ${(stats.totalValue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-emerald-700 mt-1">Total Value</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">Average</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    ${(stats.avgValue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-purple-700 mt-1">Avg Value</div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <Layers className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">Categories</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-900">
                    {Object.keys(stats.byType).length}
                  </div>
                  <div className="text-xs text-amber-700 mt-1">Active Types</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs - Productized View */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-1 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('impact')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'impact'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                🔴 Impact Alerts
                <span className="ml-2 text-xs text-gray-500">
                  ({filteredLeads.filter(l => l.impact_type === 'negative' || l.impact_type === 'positive').length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'opportunities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                🎯 New Opportunities
                <span className="ml-2 text-xs text-gray-500">
                  ({filteredLeads.filter(l => l.type === 'permit' || l.type === 'license' || l.type === 'liquor').length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'all'
                    ? 'border-gray-500 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Everything
                <span className="ml-2 text-xs text-gray-500">
                  ({filteredLeads.length})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'impact' 
                      ? "Search developments affecting property values..."
                      : activeTab === 'opportunities'
                      ? "Search permits, licenses, new construction..."
                      : "Search all leads..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="permit">Building Permits</option>
                  <option value="liquor">Liquor Licenses</option>
                  <option value="property">Property Records</option>
                  <option value="zoning">Zoning Changes</option>
                </select>

                <select
                  value={opportunityFilter}
                  onChange={(e) => setOpportunityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Opportunities</option>
                  <option value="hot">Hot Leads</option>
                  <option value="warm">Warm Leads</option>
                  <option value="future">Future Opportunities</option>
                </select>

                <select
                  value={impactFilter}
                  onChange={(e) => setImpactFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Impact Types</option>
                  <option value="negative">🔴 Negative Impact</option>
                  <option value="positive">🟢 Positive Impact</option>
                  <option value="mixed">🟡 Mixed Impact</option>
                </select>

                <select
                  value={minValue}
                  onChange={(e) => setMinValue(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="0">Any Value</option>
                  <option value="50000">$50K+</option>
                  <option value="100000">$100K+</option>
                  <option value="500000">$500K+</option>
                  <option value="1000000">$1M+</option>
                </select>

                <select
                  value={daysFilter}
                  onChange={(e) => setDaysFilter(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="60">Last 60 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      viewMode === 'map' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Map
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {viewMode === 'map' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map View - 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Interactive Map
                      <span className="ml-auto text-sm text-gray-500 font-normal">
                        {filteredLeads.length} leads
                      </span>
                    </h2>
                  </div>
                  <div className="h-[700px]">
                    {loading ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading map...</p>
                        </div>
                      </div>
                    ) : (
                      <GoogleMap leads={filteredLeads} selectedLead={selectedLead} onLeadSelect={setSelectedLead} />
                    )}
                  </div>
                </div>
              </div>

              {/* Lead Feed - 1 column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Latest Leads
                    </h2>
                  </div>
                  <div className="max-h-[700px] overflow-y-auto">
                    {loading ? (
                      <div className="p-4 space-y-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredLeads.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No leads found</p>
                        <p className="text-sm mt-2">Try adjusting your filters</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredLeads.map((lead) => (
                          <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className={`group p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                              selectedLead?.id === lead.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(lead.type)}`}>
                                  {getTypeIcon(lead.type)}
                                  {lead.type}
                                </span>
                                {getOpportunityBadge(lead.opportunity)}
                                {getImpactBadge(lead)}
                              </div>
                              {lead.value > 0 && (
                                <div className="text-sm font-bold text-emerald-600 whitespace-nowrap">
                                  ${(lead.value / 1000).toFixed(0)}K
                                </div>
                              )}
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {lead.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span className="line-clamp-1">{lead.address}</span>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {lead.summary}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(lead.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  Score: {lead.score}
                                </div>
                              </div>
                              
                              <Link
                                href={`/realtor/lead/${lead.id}`}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium group-hover:gap-2 transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => window.location.href = `/realtor/lead/${lead.id}`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${getTypeColor(lead.type)}`}>
                          {getTypeIcon(lead.type)}
                          {lead.type}
                        </span>
                        {getOpportunityBadge(lead.opportunity)}
                        {getImpactBadge(lead)}
                      </div>
                      {lead.value > 0 && (
                        <div className="text-lg font-bold text-emerald-600">
                          ${(lead.value / 1000).toFixed(0)}K
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {lead.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="line-clamp-1">{lead.address}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {lead.summary}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {lead.score}
                        </div>
                      </div>
                      
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </SubscriptionGate>
  );
}
