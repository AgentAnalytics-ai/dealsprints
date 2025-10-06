/**
 * DealSprints Business Intelligence Page
 * 2025-2026 Architecture: SEO-Optimized, Dynamic Content Generation
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BusinessIntelligenceReport } from '@/components/BusinessIntelligenceReport';
import { collectBusinessData } from '@/lib/dataSources/legalDataCollector';

// Generate metadata for SEO optimization
export async function generateMetadata({ 
  params 
}: { 
  params: { placeId: string } 
}): Promise<Metadata> {
  try {
    // Get basic business data for SEO
    const dataCollection = await collectBusinessData(params.placeId);
    const placesData = dataCollection.sources.find(s => s.type === 'google_places');
    
    if (!placesData) {
      return {
        title: 'Business Analysis | DealSprints',
        description: 'Professional business intelligence and valuation analysis using AI-powered insights.'
      };
    }

    const business = placesData.data;
    const businessName = business.name || 'Business';
    const location = business.formatted_address || '';
    const rating = business.rating || 0;
    const industry = 'Business'; // Would be determined from analysis

    return {
      title: `${businessName} Business Analysis & Valuation | DealSprints`,
      description: `Complete AI-powered business analysis for ${businessName} in ${location}. Get professional valuation estimates, market insights, and due diligence reports. Rating: ${rating}/5 stars.`,
      keywords: [
        `${businessName} business analysis`,
        `${businessName} valuation`,
        `business for sale ${location}`,
        'business broker services',
        'AI business valuation',
        'business intelligence',
        'due diligence report',
        'business acquisition',
        'market analysis',
        'competitive intelligence'
      ].join(', '),
      
      openGraph: {
        title: `${businessName} - Professional Business Analysis`,
        description: `Get comprehensive business intelligence for ${businessName} including AI-powered valuation estimates and market analysis.`,
        type: 'article',
        images: [
          {
            url: `/api/og/business/${params.placeId}`,
            width: 1200,
            height: 630,
            alt: `${businessName} Business Analysis`
          }
        ],
        siteName: 'DealSprints',
        locale: 'en_US'
      },
      
      twitter: {
        card: 'summary_large_image',
        title: `${businessName} Business Analysis`,
        description: `Professional AI-powered business intelligence and valuation analysis.`,
        images: [`/api/og/business/${params.placeId}`]
      },
      
      alternates: {
        canonical: `https://dealsprints.com/business/${params.placeId}`
      },
      
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      
      other: {
        'business:place_id': params.placeId,
        'business:name': businessName,
        'business:location': location,
        'business:rating': rating.toString(),
        'analysis:timestamp': new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Business Analysis | DealSprints',
      description: 'Professional business intelligence and valuation analysis using AI-powered insights.'
    };
  }
}

// Generate structured data for rich snippets
function generateStructuredData(business: any, placeId: string) {
  if (!business) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BusinessEntity',
    '@id': `https://dealsprints.com/business/${placeId}`,
    'name': business.name,
    'description': `Professional business analysis and valuation for ${business.name}`,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': business.formatted_address,
      'addressLocality': business.vicinity,
      'addressCountry': 'US'
    },
    'telephone': business.formatted_phone_number,
    'url': business.website,
    'aggregateRating': business.rating ? {
      '@type': 'AggregateRating',
      'ratingValue': business.rating,
      'reviewCount': business.user_ratings_total || 0,
      'bestRating': 5,
      'worstRating': 1
    } : undefined,
    'priceRange': '$$',
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Business Analysis Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'AI Business Intelligence Analysis',
            'description': 'Comprehensive business analysis using artificial intelligence'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Business Valuation Estimate',
            'description': 'Non-binding business valuation estimate'
          }
        }
      ]
    },
    'provider': {
      '@type': 'Organization',
      'name': 'DealSprints',
      'url': 'https://dealsprints.com',
      'logo': 'https://dealsprints.com/logo.png'
    }
  };
}

// Main page component
export default async function BusinessAnalysisPage({ 
  params 
}: { 
  params: { placeId: string } 
}) {
  try {
    // Validate placeId format
    if (!/^[a-zA-Z0-9_-]+$/.test(params.placeId)) {
      notFound();
    }

    // Collect initial business data for SEO and display
    const dataCollection = await collectBusinessData(params.placeId);
    const placesData = dataCollection.sources.find(s => s.type === 'google_places');
    
    if (!placesData) {
      notFound();
    }

    const business = placesData.data;
    const structuredData = generateStructuredData(business, params.placeId);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Structured Data */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        )}

        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-500 hover:text-gray-700">
                  DealSprints
                </a>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">
                  {business.name || 'Business Analysis'}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BusinessIntelligenceReport 
              placeId={params.placeId}
              businessName={business.name}
              initialData={business}
            />
          </div>
        </main>

        {/* Related Businesses Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Business Analyses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This would be populated with related businesses */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Similar Businesses
                </h3>
                <p className="text-gray-600 text-sm">
                  Discover other businesses in the same industry and location.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <footer className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Legal Disclaimer:</strong> All business analyses, valuations, and insights provided by DealSprints 
                are for informational purposes only and should not be considered as professional business advice, 
                legal advice, or financial advice. All valuations are estimates based on publicly available data 
                and should not be used as the sole basis for business decisions.
              </p>
              <p>
                Users should consult with qualified professionals including business brokers, accountants, 
                attorneys, and valuation experts before making any business decisions.
              </p>
              <p>
                DealSprints uses only legally compliant, publicly available data sources. We do not access, 
                store, or process any private or proprietary business information.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );

  } catch (error) {
    console.error('Error loading business analysis page:', error);
    notFound();
  }
}

// Generate static params for popular businesses (optional)
export async function generateStaticParams() {
  // This would generate static pages for popular businesses
  // For now, we'll return an empty array to use dynamic rendering
  return [];
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour
