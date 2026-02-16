/**
 * Geocoding API
 * Converts addresses to coordinates using Google Maps Geocoding API
 */

import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return Response.json({ error: 'Address required' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'Google Maps API key not configured' }, { status: 500 });
    }

    // Geocode address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return Response.json({ error: 'Geocoding failed' }, { status: 400 });
    }

    const result = data.results[0];
    const location = result.geometry.location;

    return Response.json({
      lat: location.lat,
      lng: location.lng,
      formatted_address: result.formatted_address,
      place_id: result.place_id,
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
