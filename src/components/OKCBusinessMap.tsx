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

// Custom marker icons for different business statuses
const getMarkerIcons = () => {
  if (typeof window === 'undefined' || !window.google || !window.google.maps || !window.google.maps.Size) {
    return {};
  }
  
  return {
    for_sale: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    },
    active: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#1f2937" stroke="#ffffff" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">B</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    },
    sold: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">✓</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    },
    closed: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#6b7280" stroke="#ffffff" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">✕</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    }
  };
};

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
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 2025/2026: Enhanced business loading with mock data for demo
  const loadBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from API first
      const data = await getOKCBusinesses();
      
      if (data && data.length > 0) {
        setBusinesses(data);
        setFilteredBusinesses(data);
      } else {
        // Fallback to enhanced mock data with different statuses
        const mockBusinesses: OKCBusiness[] = [
          {
            id: '1',
            name: 'Downtown Coffee Co.',
            address: '123 Main St, Oklahoma City, OK',
            coordinates: { lat: 35.4676, lng: -97.5164 },
            status: 'for_sale',
            industry: 'restaurant',
            rating: 4.5,
            price: 125000,
            phone: '(405) 555-0123',
            website: 'https://downtowncoffee.com',
            lastUpdated: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Auto Repair Plus',
            address: '456 Auto Way, Oklahoma City, OK',
            coordinates: { lat: 35.4776, lng: -97.5264 },
            status: 'active',
            industry: 'automotive',
            rating: 4.2,
            phone: '(405) 555-0456',
            lastUpdated: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Beauty Salon Elite',
            address: '789 Beauty Blvd, Oklahoma City, OK',
            coordinates: { lat: 35.4576, lng: -97.5064 },
            status: 'sold',
            industry: 'beauty',
            rating: 4.8,
            price: 65000,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Tech Solutions Inc',
            address: '321 Tech Ave, Oklahoma City, OK',
            coordinates: { lat: 35.4876, lng: -97.5364 },
            status: 'for_sale',
            industry: 'technology',
            rating: 4.7,
            price: 450000,
            phone: '(405) 555-0789',
            website: 'https://techsolutions.com',
            lastUpdated: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Family Restaurant',
            address: '654 Food St, Oklahoma City, OK',
            coordinates: { lat: 35.4476, lng: -97.4964 },
            status: 'active',
            industry: 'restaurant',
            rating: 4.3,
            phone: '(405) 555-0321',
            lastUpdated: new Date().toISOString()
          },
          {
            id: '6',
            name: 'Retail Store Central',
            address: '987 Commerce Blvd, Oklahoma City, OK',
            coordinates: { lat: 35.4976, lng: -97.5464 },
            status: 'for_sale',
            industry: 'retail',
            rating: 4.1,
            price: 180000,
            phone: '(405) 555-0654',
            lastUpdated: new Date().toISOString()
          }
        ];
        
        setBusinesses(mockBusinesses);
        setFilteredBusinesses(mockBusinesses);
      }
    } catch (err) {
      console.error('Error loading businesses:', err);
      setError('Failed to load businesses. Please try again.');
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
        const price = business.price || 0;
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

  // Don't render on server side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading map...</div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center bg-red-50 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="font-medium text-red-800">For Sale ({filteredBusinesses.filter(b => b.status === 'for_sale').length})</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
            <span className="font-medium text-gray-800">Active Businesses ({filteredBusinesses.filter(b => b.status === 'active').length})</span>
          </div>
          <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium text-green-800">Recently Sold ({filteredBusinesses.filter(b => b.status === 'sold').length})</span>
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
          {filteredBusinesses.map((business) => {
            const markerIcons = getMarkerIcons();
            const icon = markerIcons[business.status] || markerIcons.active;
            return (
              <Marker
                key={business.id}
                position={business.coordinates}
                onClick={() => handleMarkerClick(business)}
                icon={icon}
              />
            );
          })}
          
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
        // Enhanced fallback with business list when map is not available
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-blue-600 text-2xl mr-3">🗺️</div>
              <div>
                <h3 className="text-xl font-semibold text-blue-800">Interactive Map Coming Soon</h3>
                <p className="text-blue-700">We're working on bringing you an interactive map experience!</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">In the meantime, explore our business listings:</h4>
              <p className="text-sm text-gray-600">Browse through {filteredBusinesses.length} businesses in Oklahoma City</p>
            </div>
          </div>
          
          {/* Business List Fallback */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.slice(0, 12).map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    business.status === 'for_sale' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {business.status === 'for_sale' ? 'FOR SALE' : 'ACTIVE'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">{business.address}</p>
                {business.industry && (
                  <p className="text-sm text-gray-500 mb-4">{business.industry}</p>
                )}
                
                {business.rating && (
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">{business.rating}/5 rating</span>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleContactBusiness(business)}
                    className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex-1"
                  >
                    Get Valuation
                  </button>
                  {business.website && (
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredBusinesses.length > 12 && (
            <div className="text-center">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                View All {filteredBusinesses.length} Businesses
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
