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
        url: 'https://www.okc.gov/government/development-services',
        name: 'OKC Building Permits',
      },
      permits2: {
        url: 'https://www.okc.gov/departments/development-services',
        name: 'OKC Development Services (Alt)',
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
    
    let response: Response;
    try {
      response = await fetch(selectedSource.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        next: { revalidate: 0 },
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({
        error: 'Fetch failed',
        details: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        url: selectedSource.url,
        possibleCauses: [
          'Site may be blocking automated requests',
          'Network/CORS issue',
          'Site may require JavaScript (needs browser automation)',
          'SSL/certificate issue',
          'Site may be down or unreachable',
        ],
        suggestions: [
          'Try visiting the URL manually in a browser',
          'Check if the site requires a search form (not direct URL access)',
          'May need to use browser automation (Puppeteer/Playwright) instead of fetch',
        ],
      }, { status: 500 });
    }
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to fetch',
        status: response.status,
        statusText: response.statusText,
        url: selectedSource.url,
        note: response.status === 404 
          ? 'URL may be incorrect. Try visiting the site manually to find the correct path.'
          : 'Check if the site requires authentication or has changed its structure.',
        suggestions: response.status === 404 ? [
          'Visit okc.gov and navigate to Development Services section',
          'Check if permits are in a different section',
          'May require search form or API access',
        ] : [],
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
        analysis.divCount > 0 ? `✅ Has ${analysis.divCount} divs - may contain structured data` : '❌ No divs found',
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

