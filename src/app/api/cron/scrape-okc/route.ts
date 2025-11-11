/**
 * Vercel Cron: OKC Content Scraper
 * Runs daily at 6am CT
 * Scrapes RSS feeds, AI rewrites, saves to Supabase
 */

import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Vercel Cron secret for security
const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-key-here';

// RSS Sources
const RSS_SOURCES = [
  {
    name: 'Journal Record',
    url: 'https://journalrecord.com/feed/',
  },
  {
    name: 'The Oklahoman',
    url: 'https://www.oklahoman.com/business/feed/',
  },
  {
    name: 'OKC Friday',
    url: 'https://www.okcfriday.com/feed/',
  },
  // OKC Talk doesn't have a public RSS feed, but these others do:
  // Add more as you find them
];

// OKC Metro cities to filter for
const OKC_METRO_KEYWORDS = [
  'Oklahoma City', 'OKC', 'Edmond', 'Norman', 'Moore', 
  'Yukon', 'Midwest City', 'Del City', 'Mustang', 
  'The Village', 'Nichols Hills', 'Bricktown', 'Midtown',
  'Plaza District', 'Downtown OKC'
];

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  content?: string;
}

// Fetch and parse RSS feed
async function fetchRSS(url: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Simple RSS parsing - ES5 compatible
    const items: RSSItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(text)) !== null) {
      const itemXml = match[1];
      const title = (itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || 
                    itemXml.match(/<title>(.*?)<\/title>/))?.[1] || '';
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
    console.error(`Error fetching RSS from ${url}:`, error);
    return [];
  }
}

// Filter for OKC metro articles
function filterOKCMetro(items: RSSItem[]): RSSItem[] {
  return items.filter(item => {
    const searchText = `${item.title} ${item.contentSnippet}`.toLowerCase();
    return OKC_METRO_KEYWORDS.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
  });
}

// Check if article already exists in database
async function articleExists(url: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('scraped_posts')
    .select('id')
    .eq('source_url', url)
    .limit(1);
  
  return (data?.length || 0) > 0;
}

// AI rewrite article summary
async function rewriteSummary(title: string, content: string): Promise<string> {
  try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `You rewrite news as a local OKC business insider. Write 2-3 sentences maximum. Always mention the specific neighborhood or area. Use original words, be conversational but professional.`
        },
        {
          role: 'user',
          content: `Rewrite this article:\n\nTitle: ${title}\n\nContent: ${content}\n\nWrite your rewrite now (2-3 sentences):`
        }
      ],
      temperature: 0.7,
    });

    return result.text;
  } catch (error) {
    console.error('AI rewrite error:', error);
    return content.substring(0, 280); // Fallback: truncate original
  }
}

// Categorize article type
function categorizeArticle(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  
  if (text.includes('open') || text.includes('opening') || text.includes('opens')) {
    return 'opening';
  }
  if (text.includes('expan') || text.includes('adds') || text.includes('grow')) {
    return 'expansion';
  }
  if (text.includes('develop') || text.includes('construction') || text.includes('build')) {
    return 'development';
  }
  if (text.includes('event') || text.includes('festival') || text.includes('conference')) {
    return 'event';
  }
  if (text.includes('data') || text.includes('report') || text.includes('statistic')) {
    return 'data-insight';
  }
  
  return 'opening'; // Default
}

// Extract location from text
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
  
  return 'Oklahoma City, OK';
}

// Extract tags from content
function extractTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
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
  
  return tags.slice(0, 5); // Max 5 tags
}

// Main cron handler
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const { searchParams } = new URL(request.url);
    const providedSecret = searchParams.get('secret');
    
    if (providedSecret !== CRON_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 OKC Scraper started at', new Date().toISOString());

    let totalScraped = 0;
    let totalNew = 0;
    let totalDuplicates = 0;

    // Process each RSS source
    for (const source of RSS_SOURCES) {
      console.log(`📰 Fetching ${source.name}...`);
      
      // Fetch RSS feed
      const articles = await fetchRSS(source.url);
      totalScraped += articles.length;
      console.log(`   Found ${articles.length} articles`);
      
      // Filter for OKC metro
      const okcArticles = filterOKCMetro(articles);
      console.log(`   Filtered to ${okcArticles.length} OKC metro articles`);
      
      // Process each article
      for (const article of okcArticles) {
        // Check if already exists
        const exists = await articleExists(article.link);
        if (exists) {
          console.log(`   ⏭️  Skipping duplicate: ${article.title}`);
          totalDuplicates++;
          continue;
        }
        
        console.log(`   ✨ Processing new article: ${article.title}`);
        
        // AI rewrite summary
        const aiSummary = await rewriteSummary(
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
            source_name: source.name,
            scraped_title: article.title,
            scraped_date: article.pubDate,
            ai_summary: aiSummary,
            ai_category: category,
            ai_location: location,
            ai_tags: tags,
            status: 'pending_photo',
          });
        
        if (error) {
          console.error(`   ❌ Error inserting article:`, error);
        } else {
          console.log(`   ✅ Inserted: ${article.title}`);
          totalNew++;
        }
        
        // Rate limit: wait 500ms between OpenAI calls
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalScraped,
        totalNew,
        totalDuplicates,
        sources: RSS_SOURCES.length,
      },
      message: `Scraped ${totalScraped} articles, added ${totalNew} new, skipped ${totalDuplicates} duplicates`,
    };

    console.log('✅ OKC Scraper completed:', summary);

    // TODO: Send email notification if new articles found
    // if (totalNew > 0) {
    //   await sendNotificationEmail(totalNew);
    // }

    return Response.json(summary);

  } catch (error) {
    console.error('❌ OKC Scraper error:', error);
    return Response.json(
      { 
        error: 'Scraper failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

