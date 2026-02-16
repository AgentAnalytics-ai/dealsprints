/**
 * Backfill OKC Chamber of Commerce RSS Feed
 * Fetches historical posts from the past 1-2 months
 * Run this manually to populate database with older content
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getErrorMessage } from '@/lib/errorHandler';

export const dynamic = 'force-dynamic';

// Decode HTML entities
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&#8216;': '\u2018',
    '&#8217;': '\u2019',
    '&#8220;': '\u201C',
    '&#8221;': '\u201D',
    '&#8211;': '\u2013',
    '&#8212;': '\u2014',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
  };
  
  return text.replace(/&#?\w+;/g, (match) => entities[match] || match);
}

// Fetch RSS feed
interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
}

async function fetchRSS(url: string): Promise<RSSItem[]> {
  try {
    console.log(`📡 Fetching RSS from ${url}...`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DealSprintsBot/1.0)',
      },
    });
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch ${url}: ${response.status}`);
      return [];
    }
    
    const text = await response.text();
    
    // Parse RSS
    const items: RSSItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(text)) !== null) {
      const itemXml = match[1];
      const rawTitle = (itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || 
                    itemXml.match(/<title>(.*?)<\/title>/))?.[1] || '';
      const title = decodeHtmlEntities(rawTitle);
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const contentSnippet = (itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                             itemXml.match(/<description>(.*?)<\/description>/))?.[1] || '';
      
      if (title && link) {
        items.push({ title, link, pubDate, contentSnippet });
      }
    }
    
    console.log(`✅ Found ${items.length} items in RSS feed`);
    return items;
  } catch (error) {
    console.error(`❌ Error fetching RSS from ${url}:`, error);
    return [];
  }
}

// Filter for OKC metro
const OKC_METRO_KEYWORDS = [
  'oklahoma city', 'okc', 'edmond', 'norman', 'moore', 'yukon', 'midwest city',
  'mustang', 'bethany', 'del city', 'warr acres', 'nicoma park', 'choctaw',
  'elk city', 'stillwater', 'shawnee', 'guthrie', 'bricktown', 'midtown',
  'downtown okc', 'automobile alley', 'plaza district', 'paseo', 'scissortail',
  'oklahoma county', 'oklahoma metro', 'metro area'
];

function filterOKCMetro(items: RSSItem[]): RSSItem[] {
  return items.filter(item => {
    const searchText = `${item.title} ${item.contentSnippet}`.toLowerCase();
    return OKC_METRO_KEYWORDS.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
  });
}

// Check if article already exists
async function articleExists(url: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('scraped_posts')
    .select('id')
    .eq('source_url', url)
    .limit(1);
  
  return (data?.length || 0) > 0;
}

// Filter articles from past 1-2 months
function filterRecentArticles(items: RSSItem[], monthsBack: number = 2): RSSItem[] {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
  
  return items.filter(item => {
    if (!item.pubDate) return false;
    try {
      const pubDate = new Date(item.pubDate);
      return pubDate >= cutoffDate;
    } catch {
      return false;
    }
  });
}

// Generate original insight (not rewriting copyrighted content)
async function generateOriginalInsight(title: string, content: string): Promise<string> {
  try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `You're an OKC business intelligence analyst. Write original insights from development/economic news.
Focus on what this means for OKC businesses, opportunities, and growth.
Write 2-3 sentences. Be specific about neighborhoods, areas, and business implications.
This is YOUR original analysis of public information, not a rewrite of copyrighted content.`
        },
        {
          role: 'user',
          content: `Development/Economic News:
Title: ${title}
Content: ${content.substring(0, 500)}

Write an original insight about what this means for OKC businesses and opportunities.`
        }
      ],
      temperature: 0.7,
    });
    
    return result.text.trim();
  } catch (error) {
    console.error('❌ AI generation error:', error);
    return content.substring(0, 280); // Fallback
  }
}

// Categorize article
function categorizeArticle(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  
  // Real estate development FIRST
  if (text.includes('arena') || text.includes('stadium') || text.includes('facility') || 
      text.includes('project') || text.includes('design') || text.includes('develop') || 
      text.includes('construction') || text.includes('build') || text.includes('building')) {
    return 'development';
  }
  
  // Events/Programs
  if (text.includes('event') || text.includes('festival') || text.includes('conference')) {
    return 'event';
  }
  if (text.includes('program') || text.includes('launch') || text.includes('initiative') || text.includes('drive')) {
    return 'event';
  }
  
  // Business openings
  if (text.includes('opening') || text.includes('opens') || text.includes('now open') || text.includes('grand opening')) {
    return 'opening';
  }
  
  // Business expansions
  if (text.includes('expan') || text.includes('adds') || text.includes('grow')) {
    return 'expansion';
  }
  
  // Data/reports
  if (text.includes('data') || text.includes('report') || text.includes('statistic')) {
    return 'data-insight';
  }
  
  return 'event';
}

// Extract location
function extractLocation(title: string, content: string): string {
  const text = `${title} ${content}`;
  const neighborhoods = [
    'Bricktown', 'Midtown', 'Plaza District', 'Automobile Alley',
    'Paseo', 'Classen Curve', 'Wheeler District', 'Scissortail Park',
    'Innovation District', 'Capitol Hill', 'Deep Deuce', 'Film Row',
    'Downtown OKC', 'Downtown Oklahoma City'
  ];
  
  for (const hood of neighborhoods) {
    if (text.includes(hood)) {
      return `${hood}, OKC`;
    }
  }
  
  // Check for city names
  if (text.includes('Edmond')) return 'Edmond, OK';
  if (text.includes('Norman')) return 'Norman, OK';
  if (text.includes('Moore')) return 'Moore, OK';
  if (text.includes('Yukon')) return 'Yukon, OK';
  if (text.includes('Midwest City')) return 'Midwest City, OK';
  
  return 'Oklahoma City, OK';
}

// Extract tags
function extractTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
  // Always add OKC tag
  if (text.includes('okc') || text.includes('oklahoma city') || 
      text.includes('downtown okc') || text.includes('downtown oklahoma city')) {
    tags.push('okc');
  }
  
  // Industry tags
  if (text.includes('retail') || text.includes('shop') || text.includes('store')) tags.push('retail');
  if (text.includes('restaurant') || text.includes('food') || text.includes('dining')) tags.push('food-beverage');
  if (text.includes('tech') || text.includes('software') || text.includes('startup')) tags.push('tech');
  if (text.includes('health') || text.includes('medical') || text.includes('wellness')) tags.push('healthcare');
  if (text.includes('real estate') || text.includes('apartment') || text.includes('housing')) tags.push('real-estate');
  if (text.includes('hotel') || text.includes('hospitality')) tags.push('hospitality');
  
  // Location tags
  if (text.includes('downtown')) tags.push('downtown');
  if (text.includes('edmond')) tags.push('edmond');
  if (text.includes('norman')) tags.push('norman');
  if (text.includes('bricktown')) tags.push('bricktown');
  if (text.includes('midtown')) tags.push('midtown');
  
  return tags.slice(0, 5);
}

// Main backfill handler
export async function POST(request: NextRequest) {
  // 🛑 PAUSED: Scraping disabled to save costs
  return Response.json({ 
    error: 'Scraping paused to save costs. Re-enable by removing this early return.',
    paused: true 
  }, { status: 503 });

  // ============================================================================
  // BELOW CODE IS PAUSED - Remove early return above to re-enable
  // ============================================================================
  
  try {
    const body = await request.json().catch(() => ({}));
    const { monthsBack = 2, sourceName = 'OKC Chamber' } = body;
    
    console.log('🚀 RSS Backfill started');
    console.log(`📅 Fetching posts from past ${monthsBack} months`);
    console.log(`📰 Source: ${sourceName}`);

    // Map of source names to RSS URLs (LEGAL SOURCES ONLY)
    // Removed copyrighted news sources - only keeping development/economic development feeds
    const RSS_SOURCES: Record<string, string> = {
      'OKC Chamber': 'https://www.okcchamber.com/feed/',
      'City of OKC News': 'https://www.okc.gov/news/feed/',
      'Greater OKC Partnership': 'https://greateroklahomacity.com/news/feed/',
      'Downtown OKC Inc': 'https://www.downtownokc.com/news-updates/feed/',
      'i2E - Innovation to Enterprise': 'https://i2e.org/feed/',
    };

    const RSS_URL = RSS_SOURCES[sourceName] || 'https://www.okcchamber.com/feed/';
    
    // Fetch RSS feed
    const articles = await fetchRSS(RSS_URL);
    console.log(`📰 Found ${articles.length} total articles`);
    
    // Filter for OKC metro
    const okcArticles = filterOKCMetro(articles);
    console.log(`📍 Filtered to ${okcArticles.length} OKC metro articles`);
    
    // Filter for past 1-2 months
    const recentArticles = filterRecentArticles(okcArticles, monthsBack);
    console.log(`📅 Filtered to ${recentArticles.length} articles from past ${monthsBack} months`);
    
    let totalNew = 0;
    let totalDuplicates = 0;
    let totalErrors = 0;
    
    // Process each article
    for (const article of recentArticles) {
      try {
        // Check if already exists
        const exists = await articleExists(article.link);
        if (exists) {
          console.log(`   ⏭️  Skipping duplicate: ${article.title}`);
          totalDuplicates++;
          continue;
        }
        
        console.log(`   ✨ Processing new article: ${article.title}`);
        
        // Generate original insight (not rewriting)
        const aiSummary = await generateOriginalInsight(
          article.title, 
          article.contentSnippet || ''
        );
        
        // Extract metadata
        const category = categorizeArticle(article.title, article.contentSnippet || '');
        const location = extractLocation(article.title, article.contentSnippet || '');
        const tags = extractTags(article.title, article.contentSnippet || '');
        
        // Insert into Supabase
        const { error } = await supabaseAdmin
          .from('scraped_posts')
          .insert({
            source_url: article.link,
            source_name: sourceName,
            scraped_title: article.title,
            scraped_date: article.pubDate,
            ai_summary: aiSummary,
            ai_category: category,
            ai_location: location,
            ai_tags: tags,
            status: 'pending_photo',
            data_type: 'rss', // Mark as RSS source
          });
        
        if (error) {
          console.error(`   ❌ Error inserting article:`, error);
          totalErrors++;
        } else {
          console.log(`   ✅ Inserted: ${article.title}`);
          totalNew++;
        }
        
        // Rate limit: wait 500ms between OpenAI calls
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`   ❌ Error processing article:`, error);
        totalErrors++;
      }
    }

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalArticles: articles.length,
        okcArticles: okcArticles.length,
        recentArticles: recentArticles.length,
        totalNew,
        totalDuplicates,
        totalErrors,
      },
      message: `Backfilled ${totalNew} new articles from ${sourceName} (past ${monthsBack} months)`,
    };

    console.log('✅ OKC Chamber Backfill completed:', summary);

    return NextResponse.json(summary);
  } catch (error: unknown) {
    console.error('❌ Backfill error:', error);
    return NextResponse.json(
      { 
        error: 'Backfill failed', 
        details: getErrorMessage(error)
      },
      { status: 500 }
    );
  }
}

// Also allow GET for easy testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const monthsBack = parseInt(searchParams.get('months') || '2', 10);
  
  // Call POST handler logic
  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ monthsBack }),
  });
  
  return POST(mockRequest);
}

