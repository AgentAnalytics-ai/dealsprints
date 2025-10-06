/**
 * DealSprints Performance Monitor
 * 2025-2026 Architecture: Real-time Performance Tracking
 */

import { track } from '@vercel/analytics';

// Core Web Vitals tracking
export function trackCoreWebVitals() {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    onCLS((metric) => {
      track('web_vitals', {
        metric: 'CLS',
        value: metric.value,
        rating: metric.rating
      });
    });

    onINP((metric) => {
      track('web_vitals', {
        metric: 'INP',
        value: metric.value,
        rating: metric.rating
      });
    });

    onFCP((metric) => {
      track('web_vitals', {
        metric: 'FCP',
        value: metric.value,
        rating: metric.rating
      });
    });

    onLCP((metric) => {
      track('web_vitals', {
        metric: 'LCP',
        value: metric.value,
        rating: metric.rating
      });
    });

    onTTFB((metric) => {
      track('web_vitals', {
        metric: 'TTFB',
        value: metric.value,
        rating: metric.rating
      });
    });
  });
}

// Business analysis tracking
export function trackBusinessAnalysis(placeId: string, metrics: {
  processingTime: number;
  dataSources: number;
  cost: number;
  success: boolean;
  error?: string;
}) {
  track('business_analysis', {
    place_id: placeId,
    processing_time: metrics.processingTime,
    data_sources: metrics.dataSources,
    cost: metrics.cost,
    success: metrics.success,
    error: metrics.error || 'Unknown error'
  });
}

// AI model performance tracking
export function trackAIModelPerformance(model: string, metrics: {
  responseTime: number;
  tokenCount: number;
  cost: number;
  quality: number;
}) {
  track('ai_model_performance', {
    model,
    response_time: metrics.responseTime,
    token_count: metrics.tokenCount,
    cost: metrics.cost,
    quality: metrics.quality
  });
}

// SEO performance tracking
export function trackSEOPerformance(page: string, metrics: {
  loadTime: number;
  score: number;
  keywords: string[];
  rankings: Record<string, number>;
}) {
  track('seo_performance', {
    page,
    load_time: metrics.loadTime,
    score: metrics.score,
    keywords: metrics.keywords.join(','),
    rankings: JSON.stringify(metrics.rankings)
  });
}
