/**
 * Test Scraper - Inspect actual HTML from public data sources
 * Helps debug and build proper parsers
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'permits';
    
    const sources: Record<string, { url: string; name: string }> = {
      permits: {
        url: 'https://okc.gov/development-services/building-permits',
        name: 'OKC Building Permits',
      },
      liquor: {
        url: 'https://able.ok.gov/licenses',
        name: 'ABLE Liquor Licenses',
      },
      business: {
        url: 'https://www.sos.ok.gov/corp/corpInquiryFind.aspx',
        name: 'Oklahoma Business Licenses',
      },
      court: {
        url: 'https://www.oscn.net/dockets/',
        name: 'Oklahoma County Court Records',
      },
    };
    
    const selectedSource = sources[source] || sources.permits;
    
    console.log(`🔍 Testing scraper for: ${selectedSource.name}`);
    console.log(`📡 URL: ${selectedSource.url}`);
    
    const response = await fetch(selectedSource.url, {
      headers: {
        'User-Agent': 'DealSprints OKC Intelligence Bot/1.0 (contact@dealsprints.com)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 0 },
    });
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to fetch',
        status: response.status,
        statusText: response.statusText,
        url: selectedSource.url,
      }, { status: response.status });
    }
    
    const html = await response.text();
    const contentType = response.headers.get('content-type') || 'unknown';
    
    // Analyze HTML structure
    const analysis = {
      totalLength: html.length,
      hasTables: /<table[^>]*>/i.test(html),
      hasForms: /<form[^>]*>/i.test(html),
      hasLists: /<ul[^>]*>|<ol[^>]*>/i.test(html),
      divCount: (html.match(/<div[^>]*>/gi) || []).length,
      tableCount: (html.match(/<table[^>]*>/gi) || []).length,
      formCount: (html.match(/<form[^>]*>/gi) || []).length,
      inputCount: (html.match(/<input[^>]*>/gi) || []).length,
      selectCount: (html.match(/<select[^>]*>/gi) || []).length,
      buttonCount: (html.match(/<button[^>]*>|<input[^>]*type=["']submit["'][^>]*>/gi) || []).length,
    };
    
    // Extract sample HTML snippets
    const snippets = {
      first500: html.substring(0, 500),
      last500: html.substring(Math.max(0, html.length - 500)),
      title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || 'No title',
      metaDescription: html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || 'No description',
      tableRows: (html.match(/<tr[^>]*>[\s\S]{0,500}?<\/tr>/gi) || []).slice(0, 3),
      divsWithClass: (html.match(/<div[^>]*class=["'][^"']*permit[^"']*["'][^>]*>[\s\S]{0,300}?<\/div>/gi) || []).slice(0, 3),
      forms: (html.match(/<form[^>]*>[\s\S]{0,1000}?<\/form>/gi) || []).slice(0, 2),
    };
    
    // Look for data patterns
    const dataPatterns = {
      hasPermitNumbers: /(?:permit|permit\s*#)[^>]*#?[:\s]*([A-Z0-9-]+)/i.test(html),
      hasAddresses: /\d+\s+[^,<]+(?:Street|Avenue|Road|Boulevard|Drive|Lane|Way)/i.test(html),
      hasDollarAmounts: /\$[\d,]+/i.test(html),
      hasDates: /\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}/i.test(html),
      hasLicenseNumbers: /(?:license|permit)[^>]*#?[:\s]*([A-Z0-9-]+)/i.test(html),
    };
    
    return NextResponse.json({
      success: true,
      source: selectedSource.name,
      url: selectedSource.url,
      contentType,
      analysis,
      dataPatterns,
      snippets,
      fullHtml: html, // Include full HTML for inspection
      recommendations: [
        analysis.hasTables ? '✅ Has tables - likely data in <tr> rows' : '❌ No tables found',
        analysis.hasForms ? '⚠️ Has forms - may require form submission' : '✅ No forms (direct access)',
        analysis.hasDivs > 0 ? `✅ Has ${analysis.hasDivs} divs - may contain structured data` : '❌ No divs found',
        dataPatterns.hasPermitNumbers ? '✅ Found permit number patterns' : '❌ No permit numbers found',
        dataPatterns.hasAddresses ? '✅ Found address patterns' : '❌ No addresses found',
        dataPatterns.hasDollarAmounts ? '✅ Found dollar amounts' : '❌ No dollar amounts found',
      ],
    });
    
  } catch (error) {
    console.error('Test scraper error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

