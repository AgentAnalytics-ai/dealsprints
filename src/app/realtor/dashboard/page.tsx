/**
 * OKC Realtor Intelligence Dashboard
 * 
 * Shows leads from scraped public data (permits, licenses, property records)
 * with interactive map and filtering
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MapPin, Filter, TrendingUp, DollarSign, Calendar, Building2, UtensilsCrossed, Home, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Google Maps to avoid SSR issues
const GoogleMap = dynamic(() => import('@/components/realtor/RealtorMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-200 animate-pulse rounded-lg" />
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
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [opportunityFilter, setOpportunityFilter] = useState<string>('all');
  const [minValue, setMinValue] = useState<number>(0);
  const [daysFilter, setDaysFilter] = useState<number>(30);

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
            if (lead.coordinates) return lead; // Already geocoded
            
            try {
              const geoResponse = await fetch('/api/realtor/geocode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: lead.address }),
              });
              const geoData = await geoResponse.json();
              return { ...lead, coordinates: { lat: geoData.lat, lng: geoData.lng } };
            } catch (error) {
              console.error('Geocoding error:', error);
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
      case 'permit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'liquor': return 'bg-green-100 text-green-800 border-green-200';
      case 'property': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'zoning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOpportunityBadge = (opportunity: string) => {
    switch (opportunity) {
      case 'hot':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full border border-red-200">
          <Zap className="w-3 h-3" />
          Hot Lead
        </span>;
      case 'warm':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-200">
          Warm
        </span>;
      case 'future':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full border border-gray-200">
          Future
        </span>;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            OKC Realtor Intelligence Dashboard
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Early-stage leads from public records. Building permits, new businesses, 
            and development opportunities before they go public.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.byOpportunity.hot}</div>
                <div className="text-sm text-gray-600">Hot Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(stats.totalValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${(stats.avgValue / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Avg Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(stats.byType).length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Opportunities</option>
              <option value="hot">Hot Leads</option>
              <option value="warm">Warm Leads</option>
              <option value="future">Future Opportunities</option>
            </select>

            <select
              value={minValue}
              onChange={(e) => setMinValue(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Interactive Map
                </h2>
              </div>
              <div className="h-[600px]">
                {loading ? (
                  <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                    <div className="text-gray-500">Loading map...</div>
                  </div>
                ) : (
                  <GoogleMap leads={leads} selectedLead={selectedLead} onLeadSelect={setSelectedLead} />
                )}
              </div>
            </div>
          </div>

          {/* Lead Feed - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Latest Leads ({leads.length})
                </h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : leads.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No leads found with current filters</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedLead?.id === lead.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getTypeColor(lead.type)}`}>
                              {getTypeIcon(lead.type)}
                              {lead.type}
                            </span>
                            {getOpportunityBadge(lead.opportunity)}
                          </div>
                          {lead.value > 0 && (
                            <div className="text-sm font-semibold text-green-600">
                              ${(lead.value / 1000).toFixed(0)}K
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {lead.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{lead.address}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {lead.summary}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Score: {lead.score}
                          </div>
                        </div>
                        
                        <a
                          href={`/realtor/lead/${lead.id}`}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Details →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
