/**
 * DealSprints Legal Data Collector
 * 2025-2026 Architecture: Lightweight, Fast, Legally-Compliant
 * 
 * This system collects ONLY publicly available, legally compliant data
 * for business intelligence analysis.
 */

import { z } from 'zod';

// Legal data source schema
export const LegalDataSourceSchema = z.object({
  type: z.enum(['google_places', 'website_analysis', 'social_media', 'news_mentions', 'public_records']),
  url: z.string(),
  data: z.any(),
  reliability: z.enum(['high', 'medium', 'low']),
  legal_compliance: z.boolean(),
  last_updated: z.string(),
  cost_per_request: z.number().optional()
});

export type LegalDataSource = z.infer<typeof LegalDataSourceSchema>;

/**
 * Main data collection orchestrator
 * Collects data from multiple sources in parallel for maximum speed
 */
export async function collectBusinessData(placeId: string): Promise<{
  sources: LegalDataSource[];
  total_cost: number;
  collection_time: number;
}> {
  const startTime = Date.now();
  
  // Parallel data collection for maximum speed
  const [placesData, websiteData, socialData, newsData] = await Promise.all([
    collectGooglePlacesData(placeId),
    collectWebsiteData(placeId),
    collectSocialMediaData(placeId),
    collectNewsData(placeId)
  ]);

  const sources = [placesData, websiteData, socialData, newsData].filter(Boolean);
  const total_cost = sources.reduce((sum, source) => sum + (source?.cost_per_request || 0), 0);
  const collection_time = Date.now() - startTime;

  return {
    sources,
    total_cost,
    collection_time
  };
}

/**
 * Google Places API Data Collection
 * Uses official API - fully legal and compliant
 */
async function collectGooglePlacesData(placeId: string): Promise<LegalDataSource | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('Google Places API key not configured');
      return null;
    }

    // Place details request
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,formatted_address,geometry,formatted_phone_number,website,opening_hours,reviews&key=${apiKey}`;
    
    const response = await fetch(detailsUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return {
      type: 'google_places',
      url: detailsUrl,
      data: data.result,
      reliability: 'high',
      legal_compliance: true,
      last_updated: new Date().toISOString(),
      cost_per_request: 0.017 // Google Places API pricing
    };
  } catch (error) {
    console.error('Error collecting Google Places data:', error);
    return null;
  }
}

/**
 * Website Analysis Data Collection
 * Lightweight HTTP analysis - no scraping, just headers and metadata
 */
async function collectWebsiteData(placeId: string): Promise<LegalDataSource | null> {
  try {
    // First get the website URL from Google Places
    const placesData = await collectGooglePlacesData(placeId);
    const websiteUrl = placesData?.data?.website;
    
    if (!websiteUrl) {
      return null;
    }

    // Lightweight website analysis - only headers and basic metadata
    const response = await fetch(websiteUrl, {
      method: 'HEAD', // Only get headers, not content
      headers: {
        'User-Agent': 'DealSprints-Bot/1.0 (Business Intelligence Analysis)'
      }
    });

    const headers = Object.fromEntries(response.headers.entries());
    const lastModified = headers['last-modified'];
    const contentLength = headers['content-length'];
    const server = headers['server'];

    return {
      type: 'website_analysis',
      url: websiteUrl,
      data: {
        status_code: response.status,
        last_modified: lastModified,
        content_length: contentLength,
        server: server,
        response_time: Date.now(),
        ssl_enabled: websiteUrl.startsWith('https://')
      },
      reliability: 'medium',
      legal_compliance: true,
      last_updated: new Date().toISOString(),
      cost_per_request: 0 // Free - just HTTP headers
    };
  } catch (error) {
    console.error('Error collecting website data:', error);
    return null;
  }
}

/**
 * Social Media Data Collection
 * Uses public APIs and metadata only - no scraping
 */
async function collectSocialMediaData(placeId: string): Promise<LegalDataSource | null> {
  try {
    const placesData = await collectGooglePlacesData(placeId);
    const businessName = placesData?.data?.name;
    
    if (!businessName) {
      return null;
    }

    // Lightweight social media presence detection
    // This would use official APIs in production
    const socialPresence = {
      linkedin: await checkSocialPresence(businessName, 'linkedin'),
      facebook: await checkSocialPresence(businessName, 'facebook'),
      twitter: await checkSocialPresence(businessName, 'twitter')
    };

    return {
      type: 'social_media',
      url: 'https://social-media-analysis',
      data: socialPresence,
      reliability: 'medium',
      legal_compliance: true,
      last_updated: new Date().toISOString(),
      cost_per_request: 0
    };
  } catch (error) {
    console.error('Error collecting social media data:', error);
    return null;
  }
}

/**
 * News Mentions Data Collection
 * Uses news APIs - fully legal and compliant
 */
async function collectNewsData(placeId: string): Promise<LegalDataSource | null> {
  try {
    const placesData = await collectGooglePlacesData(placeId);
    const businessName = placesData?.data?.name;
    const location = placesData?.data?.formatted_address;
    
    if (!businessName) {
      return null;
    }

    // Use news API for legal news collection
    // This is a placeholder - would use actual news API in production
    const newsMentions = {
      total_mentions: 0,
      recent_mentions: [],
      sentiment: 'neutral',
      last_mention_date: null
    };

    return {
      type: 'news_mentions',
      url: 'https://news-api-analysis',
      data: newsMentions,
      reliability: 'medium',
      legal_compliance: true,
      last_updated: new Date().toISOString(),
      cost_per_request: 0.01 // Estimated news API cost
    };
  } catch (error) {
    console.error('Error collecting news data:', error);
    return null;
  }
}

/**
 * Check social media presence (placeholder implementation)
 */
async function checkSocialPresence(businessName: string, platform: string): Promise<boolean> {
  // In production, this would use official social media APIs
  // or lightweight public page detection
  return Math.random() > 0.5; // Placeholder
}

/**
 * Data validation and quality assurance
 */
export function validateDataQuality(sources: LegalDataSource[]): {
  overall_quality: number;
  missing_data: string[];
  reliability_score: number;
} {
  const reliabilityScores = sources.map(s => {
    switch (s.reliability) {
      case 'high': return 1.0;
      case 'medium': return 0.7;
      case 'low': return 0.4;
      default: return 0.0;
    }
  });

  const reliability_score = reliabilityScores.reduce((sum, score) => sum + score, 0) / sources.length;
  const overall_quality = reliability_score * (sources.length / 4); // Normalize to expected sources

  const missing_data = [];
  if (!sources.find(s => s.type === 'google_places')) missing_data.push('google_places');
  if (!sources.find(s => s.type === 'website_analysis')) missing_data.push('website_analysis');
  if (!sources.find(s => s.type === 'social_media')) missing_data.push('social_media');
  if (!sources.find(s => s.type === 'news_mentions')) missing_data.push('news_mentions');

  return {
    overall_quality,
    missing_data,
    reliability_score
  };
}

/**
 * Cost optimization and caching
 */
export class DataCollectionCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async get(key: string): Promise<any | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  async set(key: string, data: any, ttl: number = 3600000): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Cache TTL by data type
  static getTTL(dataType: string): number {
    switch (dataType) {
      case 'google_places': return 86400000; // 24 hours
      case 'website_analysis': return 3600000; // 1 hour
      case 'social_media': return 7200000; // 2 hours
      case 'news_mentions': return 1800000; // 30 minutes
      default: return 3600000; // 1 hour
    }
  }
}
