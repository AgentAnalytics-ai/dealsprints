'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';
import { getOKCBusinesses, getBusinessDetails, getBusinessValuation, OKCBusiness } from '@/lib/okcBusinesses';

// 2025/2026: Optimized map configuration
const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 35.4676, // OKC coordinates
  lng: -97.5164
};

const libraries: ("places")[] = ["places"];

// 2025/2026: Custom map styles for better UX
const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

interface OKCBusinessMapProps {
  searchFilters?: {
    industry: string;
    status: string;
    priceRange: string;
  };
}

export function OKCBusinessMap({ searchFilters }: OKCBusinessMapProps) {
  const [businesses, setBusinesses] = useState<OKCBusiness[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<OKCBusiness[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<OKCBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuation, setValuation] = useState<any>(null);

  // 2025/2026: Memoized business loading with error boundaries
  const loadBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOKCBusinesses();
      setBusinesses(data);
      setFilteredBusinesses(data);
    } catch (err) {
      setError('Failed to load businesses. Please try again.');
      console.error('Error loading businesses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2025/2026: Filter businesses based on search criteria
  const filterBusinesses = useCallback(() => {
    if (!searchFilters) {
      setFilteredBusinesses(businesses);
      return;
    }

    let filtered = businesses;

    if (searchFilters.industry) {
      filtered = filtered.filter(business => 
        business.industry?.toLowerCase().includes(searchFilters.industry.toLowerCase())
      );
    }

    if (searchFilters.status) {
      filtered = filtered.filter(business => business.status === searchFilters.status);
    }

    if (searchFilters.priceRange) {
      const [min, max] = searchFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(business => {
        const price = business.estimatedValue || 0;
        if (searchFilters.priceRange === '500000+') {
          return price >= 500000;
        }
        return price >= min && price <= max;
      });
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchFilters]);

  useEffect(() => {
    filterBusinesses();
  }, [filterBusinesses]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  // 2025/2026: Enhanced marker click with AI valuation
  const handleMarkerClick = useCallback(async (business: OKCBusiness) => {
    try {
      const [details, valuationData] = await Promise.all([
        getBusinessDetails(business.id),
        getBusinessValuation(business)
      ]);
      
      if (details) {
        setSelectedBusiness(details);
        setValuation(valuationData);
      } else {
        setSelectedBusiness(business);
        setValuation(valuationData);
      }
    } catch (error) {
      console.error('Error loading business details:', error);
      setSelectedBusiness(business);
    }
  }, []);

  // 2025/2026: Enhanced lead generation with pre-filled data
  const handleContactBusiness = useCallback((business: OKCBusiness) => {
    const params = new URLSearchParams({
      business: business.name,
      industry: business.industry || 'business',
      location: 'Oklahoma City, OK',
      source: 'business_map'
    });
    
    // 2025/2026: Smooth scroll to assessment with pre-filled data
    const assessmentElement = document.getElementById('assessment');
    if (assessmentElement) {
      assessmentElement.scrollIntoView({ behavior: 'smooth' });
      // Trigger form pre-fill
      window.dispatchEvent(new CustomEvent('prefillAssessment', { 
        detail: { business, valuation } 
      }));
    }
  }, [valuation]);

  // 2025/2026: Memoized map options for performance
  const mapOptions = useMemo(() => ({
    styles: mapStyles,
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  }), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading OKC businesses...</div>
          <div className="text-sm text-gray-500 mt-2">Powered by Google Places API</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            onClick={loadBusinesses}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Interactive Business Map
        </h2>
        <p className="text-gray-700 text-lg mb-4">
          Discover {filteredBusinesses.length} businesses in OKC - Find, buy, and sell businesses like never before
        </p>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="font-medium text-blue-800">Active Businesses</span>
          </div>
          <div className="flex items-center bg-red-50 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="font-medium text-red-800">For Sale</span>
          </div>
          <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium text-green-800">AI Valued</span>
          </div>
        </div>
      </div>
      
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
          loadingElement={<div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>}
        >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          options={mapOptions}
        >
          {filteredBusinesses.map((business) => (
            <Marker
              key={business.id}
              position={business.coordinates}
              onClick={() => handleMarkerClick(business)}
              icon={{
                url: business.status === 'for_sale' 
                  ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(32, 32)
              }}
            />
          ))}
          
          {selectedBusiness && (
            <InfoWindow
              position={selectedBusiness.coordinates}
              onCloseClick={() => {
                setSelectedBusiness(null);
                setValuation(null);
              }}
            >
              <div className="p-4 max-w-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {selectedBusiness.name}
                </h3>
                <p className="text-gray-600 mb-2">{selectedBusiness.address}</p>
                
                {selectedBusiness.rating && (
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm">{selectedBusiness.rating}/5</span>
                  </div>
                )}
                
                {valuation && (
                  <div className="bg-green-50 p-3 rounded-lg mb-3">
                    <div className="text-sm font-semibold text-green-800">
                      AI Estimated Value
                    </div>
                    <div className="text-lg font-bold text-green-900">
                      ${valuation.estimatedValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-700">
                      {valuation.confidence}% confidence
                    </div>
                  </div>
                )}
                
                {selectedBusiness.phone && (
                  <p className="text-sm text-gray-600 mb-1">
                    📞 {selectedBusiness.phone}
                  </p>
                )}
                
                {selectedBusiness.website && (
                  <p className="text-sm text-blue-600 mb-3">
                    🌐 <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </p>
                )}
                
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                    View Details
                  </button>
                  <button 
                    onClick={() => handleContactBusiness(selectedBusiness)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    Get Valuation
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        </LoadScript>
      ) : (
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Google Maps Integration</h3>
            <p className="text-gray-600 mb-4">
              To enable the interactive map, please add your Google Maps API key to the environment variables.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md">
              <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Get a Google Maps API key from Google Cloud Console</li>
                <li>2. Enable Maps JavaScript API and Places API</li>
                <li>3. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file</li>
                <li>4. Restart your development server</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
