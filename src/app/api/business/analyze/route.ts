/**
 * DealSprints Business Analysis API
 * 2025-2026 AI Architecture: Streaming, Real-time Business Intelligence
 */

import { NextRequest } from 'next/server';
import { generateBusinessIntelligence, streamBusinessIntelligence } from '@/lib/ai/agents/businessIntelligenceAgent';
import { collectBusinessData } from '@/lib/dataSources/legalDataCollector';
import { headers } from 'next/headers';

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { placeId, stream = false } = await request.json();

    if (!placeId) {
      return Response.json(
        { error: 'placeId is required' },
        { status: 400 }
      );
    }

    // Validate placeId format (Google Places ID format)
    if (!/^[a-zA-Z0-9_-]+$/.test(placeId)) {
      return Response.json(
        { error: 'Invalid placeId format' },
        { status: 400 }
      );
    }

    // Log the analysis request
    console.log(`Business analysis requested for placeId: ${placeId}, IP: ${ip}`);

    if (stream) {
      // Streaming response for real-time analysis
      const stream = await streamBusinessIntelligence(placeId);
      return stream.toTextStreamResponse();
    } else {
      // Standard response
      const startTime = Date.now();
      
      // Collect data first
      const dataCollection = await collectBusinessData(placeId);
      
      // Generate AI analysis
      const analysis = await generateBusinessIntelligence(placeId);
      
      const processingTime = Date.now() - startTime;

      // Return comprehensive response
      return Response.json({
        success: true,
        analysis,
        metadata: {
          place_id: placeId,
          processing_time_ms: processingTime,
          data_collection: {
            sources_count: dataCollection.sources.length,
            total_cost: dataCollection.total_cost,
            collection_time: dataCollection.collection_time
          },
          ai_models_used: ['gpt-4o'],
          analysis_timestamp: new Date().toISOString(),
          api_version: '2025.1.0'
        }
      });
    }

  } catch (error) {
    console.error('Business analysis error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return Response.json(
          { error: 'Service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return Response.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return Response.json(
      { 
        error: 'Analysis failed. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for simple status check
export async function GET() {
  return Response.json({
    status: 'operational',
    service: 'DealSprints Business Intelligence API',
    version: '2025.1.0',
    features: [
      'AI-powered business analysis',
      'Real-time streaming responses',
      'Legal data collection',
      'Comprehensive business intelligence',
      'Non-binding valuation estimates'
    ],
    rate_limits: {
      requests_per_minute: RATE_LIMIT,
      burst_limit: RATE_LIMIT * 2
    }
  });
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
