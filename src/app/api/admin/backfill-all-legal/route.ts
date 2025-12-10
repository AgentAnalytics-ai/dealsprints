/**
 * Backfill All Legal Sources
 * Scans all legal RSS sources to get historical posts (target: ~20 posts)
 * Only uses legal development/economic development sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const dynamic = 'force-dynamic';

// Legal RSS sources (same as in cron)
const LEGAL_RSS_SOURCES = [
  {
    name: 'City of OKC News',
    url: 'https://www.okc.gov/news/feed/',
    type: 'government',
  },
  {
    name: 'Greater OKC Partnership',
    url: 'https://greateroklahomacity.com/news/feed/',
    type: 'economic-development',
  },
  {
    name: 'Downtown OKC Inc',
    url: 'https://www.downtownokc.com/news-updates/feed/',
    type: 'development',
  },
  {
    name: 'OKC Chamber',
    url: 'https://www.okcchamber.com/feed/',
    type: 'chamber',
  },
  {
    name: 'i2E - Innovation to Enterprise',
    url: 'https://i2e.org/feed/',
    type: 'innovation',
  },
];

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
    
    return items;
  } catch (error) {
    console.error(`❌ Error fetching RSS from ${url}:`, error);
    return [];
  }
}

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

async function articleExists(url: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('scraped_posts')
    .select('id')
    .eq('source_url', url)
    .limit(1);
  
  return (data?.length || 0) > 0;
}

function filterRecentArticles(items: RSSItem[], monthsBack: number = 3): RSSItem[] {
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

async function generateOriginalInsight(title: string, content: string, sourceType: string): Promise<string> {
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
          content: `Development/Economic News (${sourceType}):
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
    return content.substring(0, 280);
  }
}

function categorizeArticle(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  
  if (text.includes('arena') || text.includes('stadium') || text.includes('facility') || 
      text.includes('project') || text.includes('design') || text.includes('develop') || 
      text.includes('construction') || text.includes('build') || text.includes('building')) {
    return 'development';
  }
  
  if (text.includes('event') || text.includes('festival') || text.includes('conference')) {
    return 'event';
  }
  if (text.includes('program') || text.includes('launch') || text.includes('initiative')) {
    return 'event';
  }
  
  if (text.includes('opening') || text.includes('opens') || text.includes('now open')) {
    return 'opening';
  }
  
  if (text.includes('expan') || text.includes('adds') || text.includes('grow')) {
    return 'expansion';
  }
  
  if (text.includes('data') || text.includes('report') || text.includes('statistic')) {
    return 'data-insight';
  }
  
  return 'event';
}

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
  
  if (text.includes('Edmond')) return 'Edmond, OK';
  if (text.includes('Norman')) return 'Norman, OK';
  if (text.includes('Moore')) return 'Moore, OK';
  if (text.includes('Yukon')) return 'Yukon, OK';
  if (text.includes('Midwest City')) return 'Midwest City, OK';
  
  return 'Oklahoma City, OK';
}

function extractTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
  if (text.includes('okc') || text.includes('oklahoma city')) {
    tags.push('okc');
  }
  
  if (text.includes('retail') || text.includes('shop') || text.includes('store')) tags.push('retail');
  if (text.includes('restaurant') || text.includes('food') || text.includes('dining')) tags.push('food-beverage');
  if (text.includes('tech') || text.includes('software') || text.includes('startup')) tags.push('tech');
  if (text.includes('health') || text.includes('medical')) tags.push('healthcare');
  if (text.includes('real estate') || text.includes('apartment') || text.includes('housing')) tags.push('real-estate');
  if (text.includes('hotel') || text.includes('hospitality')) tags.push('hospitality');
  
  if (text.includes('downtown')) tags.push('downtown');
  if (text.includes('edmond')) tags.push('edmond');
  if (text.includes('norman')) tags.push('norman');
  if (text.includes('bricktown')) tags.push('bricktown');
  if (text.includes('midtown')) tags.push('midtown');
  
  return tags.slice(0, 5);
}

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
    const { targetCount = 20, monthsBack = 6 } = body; // Default to 6 months to find more content
    
    console.log('🚀 Backfilling all legal sources...');
    console.log(`🎯 Target: ${targetCount} new posts`);
    console.log(`📅 Looking back ${monthsBack} months`);

    const stats = {
      totalScraped: 0,
      totalNew: 0,
      totalDuplicates: 0,
      totalErrors: 0,
      bySource: {} as Record<string, { scraped: number; new: number; duplicates: number }>,
    };

    // Process each legal source
    for (const source of LEGAL_RSS_SOURCES) {
      try {
        console.log(`\n📰 Processing ${source.name}...`);
        
        // Rate limit between sources
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const articles = await fetchRSS(source.url);
        stats.totalScraped += articles.length;
        stats.bySource[source.name] = { scraped: articles.length, new: 0, duplicates: 0 };
        
        const okcArticles = filterOKCMetro(articles);
        const recentArticles = filterRecentArticles(okcArticles, monthsBack);
        
        console.log(`   📊 Stats: ${articles.length} total → ${okcArticles.length} OKC → ${recentArticles.length} recent (past ${monthsBack} months)`);
        
        if (articles.length === 0) {
          console.log(`   ⚠️  No articles found in RSS feed - feed may be empty or URL may be incorrect`);
        }
        
        // Process articles until we hit target
        for (const article of recentArticles) {
          if (stats.totalNew >= targetCount) {
            console.log(`   ✅ Reached target of ${targetCount} posts, stopping`);
            break;
          }
          
          try {
            const exists = await articleExists(article.link);
            if (exists) {
              stats.totalDuplicates++;
              stats.bySource[source.name].duplicates++;
              console.log(`   ⏭️  Duplicate: ${article.title.substring(0, 50)}...`);
              continue;
            }
            
            console.log(`   ✨ Processing: ${article.title.substring(0, 60)}...`);
            
            const aiSummary = await generateOriginalInsight(
              article.title,
              article.contentSnippet || '',
              source.type
            );
            
            const category = categorizeArticle(article.title, article.contentSnippet || '');
            const location = extractLocation(article.title, article.contentSnippet || '');
            const tags = extractTags(article.title, article.contentSnippet || '');
            
            const { error } = await supabaseAdmin
              .from('scraped_posts')
              .insert({
                source_url: article.link,
                source_name: source.name,
                scraped_title: article.title,
                scraped_date: article.pubDate,
                ai_summary: aiSummary,
                ai_category: category,
                ai_location: location,
                ai_tags: tags,
                status: 'pending_photo',
                data_type: 'rss',
              });
            
            if (error) {
              console.error(`   ❌ Error:`, error?.message || 'Unknown error');
              stats.totalErrors++;
            } else {
              stats.totalNew++;
              stats.bySource[source.name].new++;
              console.log(`   ✅ Saved (${stats.totalNew}/${targetCount})`);
            }
            
            // Rate limit between OpenAI calls
            await new Promise(resolve => setTimeout(resolve, 500));
            
          } catch (error) {
            console.error(`   ❌ Error processing article:`, error);
            stats.totalErrors++;
          }
        }
        
        if (stats.totalNew >= targetCount) break;
        
      } catch (error) {
        console.error(`❌ Error processing ${source.name}:`, error);
        stats.totalErrors++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      target: targetCount,
      stats,
      message: `Backfilled ${stats.totalNew} new posts from legal sources (target: ${targetCount})`,
    });

  } catch (error: unknown) {
    console.error('❌ Backfill error:', error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error) {
      errorMessage = String(error);
    }
    return NextResponse.json(
      { 
        error: 'Backfill failed', 
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// Also allow GET for easy testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetCount = parseInt(searchParams.get('target') || '20', 10);
  const monthsBack = parseInt(searchParams.get('months') || '3', 10);
  
  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ targetCount, monthsBack }),
  });
  
  return POST(mockRequest);
}

