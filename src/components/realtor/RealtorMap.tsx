/**
 * Realtor Map Component
 * Interactive Google Maps showing leads with color-coded pins
 */

'use client';

import { useMemo, useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';
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

  // Get marker color based on type
  const getMarkerColor = (type: string, opportunity: string) => {
    if (opportunity === 'hot') return '#EF4444'; // Red for hot
    if (opportunity === 'warm') return '#F59E0B'; // Yellow for warm
    
    switch (type) {
      case 'permit': return '#3B82F6'; // Blue
      case 'liquor': return '#10B981'; // Green
      case 'property': return '#8B5CF6'; // Purple
      case 'zoning': return '#F59E0B'; // Yellow
      default: return '#6B7280'; // Gray
    }
  };

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
        
        const markerColor = getMarkerColor(lead.type, lead.opportunity);
        const icon = createMarkerIcon(markerColor);
        
        return (
          <Marker
            key={lead.id}
            position={lead.coordinates}
            icon={icon}
            onClick={() => onLeadSelect(lead)}
            title={lead.title}
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
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {lead.type}
                    </span>
                    {lead.opportunity === 'hot' && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                        Hot Lead
                      </span>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
      </GoogleMap>
    </LoadScript>
  );
}
