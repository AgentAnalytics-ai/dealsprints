# Public Data Scraping Guide

## Overview
This guide explains how to implement scrapers for public government data sources like liquor licenses, court records, and building permits.

## Legal Sources (100% Legal to Scrape)

### ✅ Liquor Licenses - ABLE Commission
**URL:** https://able.ok.gov/licenses
**Status:** Public records, legal to scrape
**Implementation:**
1. Visit https://able.ok.gov/licenses
2. Inspect the HTML structure
3. Look for:
   - Search form fields
   - Results table/list
   - License details (name, address, type, date)
4. Implement parser to extract:
   - Business name
   - Address (filter for OKC area)
   - License type
   - Issue date
   - Status

**Example Record:**
```typescript
{
  id: 'able-license-12345',
  title: 'New Liquor License: The Bar Name',
  value: 'License #12345 - Restaurant/Bar',
  address: '123 Main St, Oklahoma City, OK',
  date: '2025-11-15',
  source: 'ABLE Liquor Licenses'
}
```

### ✅ Court Records - OSCN
**URL:** https://www.oscn.net/dockets/
**Status:** Public court records, legal to scrape
**Implementation:**
1. Check if OSCN has an API or RSS feed
2. If not, inspect docket search page
3. Look for:
   - Recent filings list
   - Case numbers
   - Parties involved
   - Filing dates
   - Case types
4. Filter for:
   - Oklahoma County cases
   - Business-related cases (if relevant)
   - Recent filings (last 30 days)

**Example Record:**
```typescript
{
  id: 'oscn-case-2025-12345',
  title: 'New Court Filing: Business Name v. Party',
  value: 'Case #CV-2025-12345 - Contract Dispute',
  address: 'Oklahoma County District Court',
  date: '2025-11-18',
  source: 'Oklahoma County Court Records'
}
```

### ✅ Building Permits - OKC.gov
**URL:** https://okc.gov/development-services/building-permits
**Status:** Public records, legal to scrape
**Implementation:**
1. Check if OKC has a public permit database/API
2. Look for:
   - Permit search interface
   - Recent permits list
   - Permit details (address, type, value, date)
3. Filter for:
   - Commercial permits (business-related)
   - Recent permits (last 30 days)
   - High-value permits ($50k+)

**Example Record:**
```typescript
{
  id: 'okc-permit-2025-12345',
  title: 'New Building Permit: $250k Commercial Project',
  value: 'Permit #2025-12345 - Commercial Construction - $250,000',
  address: '456 Commerce St, Oklahoma City, OK',
  date: '2025-11-17',
  source: 'OKC Building Permits'
}
```

## Implementation Steps

### Step 1: Inspect the Website
1. Visit the public data source URL
2. Open browser DevTools (F12)
3. Inspect the HTML structure
4. Look for:
   - Data tables
   - Lists/divs with class names
   - Form submission requirements
   - API endpoints (check Network tab)

### Step 2: Test Manual Scraping
1. Use browser console to test selectors
2. Try fetching the page with `fetch()`
3. Parse HTML with regex or DOM methods
4. Extract sample data

### Step 3: Implement Parser
1. Add parsing logic to the scraper function
2. Extract required fields:
   - `id`: Unique identifier
   - `title`: Human-readable title
   - `value`: Data value/details
   - `address`: Location
   - `date`: Record date
3. Filter for OKC area
4. Filter for recent records (last 30 days)

### Step 4: Test & Enable
1. Test the scraper manually
2. Check for errors
3. Verify data quality
4. Enable in `PUBLIC_DATA_SOURCES` array:
   ```typescript
   {
     name: 'ABLE Liquor Licenses',
     type: 'liquor',
     url: 'https://able.ok.gov/licenses',
     enabled: true, // ← Change to true
     parser: 'parseLiquorLicenses',
     rateLimitMs: 2000,
   }
   ```

## Best Practices

### ✅ DO:
- Respect rate limits (2-3 seconds between requests)
- Use proper User-Agent headers
- Filter for relevant data (OKC area, recent dates)
- Handle errors gracefully
- Log what you're doing
- Only scrape public data

### ❌ DON'T:
- Scrape too frequently (respectful rate limiting)
- Bypass security measures
- Scrape private/personal data
- Overload government servers
- Ignore robots.txt (if present)

## Quick Start: Enable Easiest Sources

The easiest sources to implement are those with:
1. **Simple HTML tables** (easier to parse)
2. **No form submission required** (direct access)
3. **Recent data visible** (no deep searching needed)

### Recommended Order:
1. **ABLE Liquor Licenses** - Usually has a searchable list
2. **OKC Building Permits** - May have a public database
3. **Court Records** - May require form submission

## Testing

Test scrapers individually:
```bash
# Test liquor license scraper
curl "https://dealsprints.com/api/cron/scrape-okc?secret=YOUR_SECRET"
# Check logs for scraper output
```

Or create a test endpoint:
```typescript
// src/app/api/admin/test-scraper/route.ts
export async function GET() {
  const records = await scrapeLiquorLicenses('https://able.ok.gov/licenses', 'ABLE Liquor Licenses');
  return Response.json({ records });
}
```

## Need Help?

1. **Inspect the actual website** - Use browser DevTools
2. **Check for APIs** - Look in Network tab for API calls
3. **Test with curl/Postman** - See what the server returns
4. **Start simple** - Get basic data first, refine later

## Legal Reminder

✅ **100% Legal:**
- Public government records
- Public court filings
- Public license data
- Public permit information

❌ **NOT Legal:**
- Private personal information
- Copyrighted content
- Paywalled data
- Data requiring authentication

