/**
 * Lead Detail Page
 * Shows full details for a single lead
 */

import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MapPin, Calendar, DollarSign, Building2, UtensilsCrossed, Home, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const GoogleMap = dynamic(() => import('@/components/realtor/RealtorMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg" />
});

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Lead Details | OKC Realtor Dashboard`,
    description: 'View detailed lead information',
  };
}

export default async function LeadDetailPage({ params }: PageProps) {
  // Fetch lead from database
  const { data: post, error } = await supabaseAdmin
    .from('scraped_posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !post) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead Not Found</h1>
          <p className="text-gray-600 mb-8">The lead you're looking for doesn't exist.</p>
          <Link
            href="/realtor/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Geocode address for map
  let coordinates: { lat: number; lng: number } | null = null;
  const address = post.data_address || post.ai_location || 'Oklahoma City, OK';
  
  if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      const geoResponse = await fetch(geocodeUrl);
      const geoData = await geoResponse.json();
      
      if (geoData.status === 'OK' && geoData.results?.[0]) {
        const location = geoData.results[0].geometry.location;
        coordinates = { lat: location.lat, lng: location.lng };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }

  const lead = {
    id: post.id,
    type: post.data_type || 'unknown',
    title: post.scraped_title,
    address,
    value: post.data_value || 0,
    date: post.scraped_date,
    summary: post.ai_summary,
    location: post.ai_location || 'Oklahoma City, OK',
    source: post.source_name,
    sourceUrl: post.source_url,
    tags: post.ai_tags || [],
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'permit': return <Building2 className="w-5 h-5" />;
      case 'liquor': return <UtensilsCrossed className="w-5 h-5" />;
      case 'property': return <Home className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            href="/realtor/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium border ${getTypeColor(lead.type)}`}>
                  {getTypeIcon(lead.type)}
                  {lead.type}
                </span>
                {lead.value > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-semibold border border-green-200">
                    <DollarSign className="w-4 h-4" />
                    ${lead.value.toLocaleString()}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lead.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {lead.address}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(lead.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            {coordinates && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-[400px]">
                  <GoogleMap
                    leads={[{ ...lead, coordinates, opportunity: 'warm' as const, score: 50 }]}
                    selectedLead={{ ...lead, coordinates, opportunity: 'warm' as const, score: 50 }}
                    onLeadSelect={() => {}}
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Generated Insight</h2>
              <p className="text-gray-700 leading-relaxed">
                {lead.summary}
              </p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lead Details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{lead.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date Filed</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(lead.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Source</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.source}</dd>
                </div>
                {lead.value > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estimated Value</dt>
                    <dd className="mt-1 text-sm font-semibold text-green-600">
                      ${lead.value.toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tags */}
            {lead.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Source Link */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Source</h3>
              <a
                href={lead.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
              >
                View Original Source
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Action Items */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border border-purple-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Next Steps</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Research property owner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Check comparable properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Contact at optimal timing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
