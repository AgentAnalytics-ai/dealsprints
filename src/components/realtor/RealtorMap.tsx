/**
 * Realtor Map Component
 * Interactive Google Maps showing leads with color-coded pins
 */

'use client';

import { useMemo, useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript, Circle } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 35.4676, // OKC coordinates
  lng: -97.5164
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

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

interface RealtorMapProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onLeadSelect: (lead: Lead | null) => void;
}

export default function RealtorMap({ leads, selectedLead, onLeadSelect }: RealtorMapProps) {
  const [isClient, setIsClient] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter leads with coordinates
  const leadsWithCoords = useMemo(() => {
    return leads.filter(lead => lead.coordinates);
  }, [leads]);

  // Get marker color based on impact type (prioritize impact over opportunity)
  const getMarkerColor = (lead: Lead) => {
    // Impact type takes priority
    if (lead.impact_type === 'negative') return '#EF4444'; // Red for negative impact
    if (lead.impact_type === 'positive') return '#10B981'; // Green for positive impact
    if (lead.impact_type === 'mixed') return '#F59E0B'; // Yellow for mixed impact
    
    // Fallback to opportunity/type
    if (lead.opportunity === 'hot') return '#EF4444';
    if (lead.opportunity === 'warm') return '#F59E0B';
    
    switch (lead.type) {
      case 'permit': return '#3B82F6'; // Blue
      case 'liquor': return '#10B981'; // Green
      case 'property': return '#8B5CF6'; // Purple
      case 'zoning': return '#F59E0B'; // Yellow
      default: return '#6B7280'; // Gray
    }
  };

  // Get circle color for impact radius
  const getCircleColor = (impactType: string | null) => {
    switch (impactType) {
      case 'negative': return '#EF4444'; // Red
      case 'positive': return '#10B981'; // Green
      case 'mixed': return '#F59E0B'; // Yellow
      default: return null;
    }
  };

  // Convert miles to meters for Google Maps Circle radius
  const milesToMeters = (miles: number) => miles * 1609.34;

  // Create custom marker icon
  const createMarkerIcon = (color: string) => {
    if (typeof window === 'undefined' || !window.google?.maps) {
      return undefined;
    }
    
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.8,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 8,
    };
  };

  if (!isClient || !apiKey) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={leadsWithCoords.length > 0 && selectedLead?.coordinates
          ? selectedLead.coordinates
          : center}
        zoom={leadsWithCoords.length > 0 ? 12 : 11}
        options={mapOptions}
      >
      {leadsWithCoords.map((lead) => {
        if (!lead.coordinates) return null;
        
        const markerColor = getMarkerColor(lead);
        const icon = createMarkerIcon(markerColor);
        const circleColor = getCircleColor(lead.impact_type);
        
        return (
          <>
            {/* Impact radius circle */}
            {lead.impact_radius && circleColor && (
              <Circle
                key={`circle-${lead.id}`}
                center={lead.coordinates}
                radius={milesToMeters(lead.impact_radius)}
                options={{
                  fillColor: circleColor,
                  fillOpacity: 0.1,
                  strokeColor: circleColor,
                  strokeOpacity: 0.5,
                  strokeWeight: 2,
                  clickable: false,
                  zIndex: 1,
                }}
              />
            )}
            
            {/* Lead marker */}
            <Marker
              key={lead.id}
              position={lead.coordinates}
              icon={icon}
              onClick={() => onLeadSelect(lead)}
              title={lead.title}
              zIndex={2}
            >
            {selectedLead?.id === lead.id && (
              <InfoWindow
                position={lead.coordinates}
                onCloseClick={() => onLeadSelect(null)}
              >
                <div className="p-2 max-w-xs">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {lead.title}
                    </h3>
                    {lead.value > 0 && (
                      <div className="text-sm font-bold text-green-600 ml-2">
                        ${(lead.value / 1000).toFixed(0)}K
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      {lead.address}
                    </div>
                    <div className="text-gray-500">
                      {new Date(lead.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                    {lead.summary}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {lead.type}
                    </span>
                    {lead.opportunity === 'hot' && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                        Hot Lead
                      </span>
                    )}
                    {lead.impact_type && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        lead.impact_type === 'negative' 
                          ? 'bg-red-100 text-red-800'
                          : lead.impact_type === 'positive'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lead.impact_type === 'negative' && '🔴'}
                        {lead.impact_type === 'positive' && '🟢'}
                        {lead.impact_type === 'mixed' && '🟡'}
                        {lead.impact_value_change && `${lead.impact_value_change > 0 ? '+' : ''}${lead.impact_value_change}%`}
                      </span>
                    )}
                    {lead.impact_radius && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {lead.impact_radius}mi radius
                      </span>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
          </>
        );
      })}
      </GoogleMap>
    </LoadScript>
  );
}
