# Government Data Scraping Implementation Guide

## ✅ Structure Complete

The framework for government data scraping is **fully implemented**. The parsers are ready but need site-specific adjustments based on actual HTML structure.

## 🎯 Current Status

### ✅ What's Done:
- Complete scraper framework
- All 5 data source functions created
- AI insight generation for public data
- Database integration
- Error handling & rate limiting
- Type-safe TypeScript

### ⚠️ What Needs Site Inspection:
- HTML parsing logic (needs actual site structure)
- Each parser returns empty array until adjusted

## 📋 Implementation Steps

### Step 1: Inspect Government Sites

For each source, you need to:
1. Visit the actual URL
2. Inspect the HTML structure (right-click → Inspect)
3. Find where the data is displayed
4. Identify patterns (tables, divs, classes, etc.)

### Step 2: Adjust Parsers

Each parser function has a `TODO` comment. Update the parsing logic based on actual HTML.

---

## 🏗️ Building Permits (Highest Priority)

**URL:** `https://okc.gov/development-services/building-permits`

**Function:** `scrapeBuildingPermits()` (line ~375)

**What to Look For:**
- How are permits displayed? (table, cards, list?)
- What HTML elements contain: address, value, date, permit number?
- Are there filters or pagination?
- Is there an API or data export available?

**Example Implementation Pattern:**
```typescript
// After inspecting the site, you might find:
const permitRows = html.match(/<tr[^>]*class="permit-row"[^>]*>[\s\S]*?<\/tr>/gi);

for (const row of permitRows) {
  const address = row.match(/<td class="address">(.*?)<\/td>/)?.[1];
  const value = row.match(/<td class="value">\$([\d,]+)<\/td>/)?.[1];
  // ... extract other fields
  
  records.push({
    id: `permit-${permitNumber}`,
    type: 'permit',
    source: 'OKC Building Permits',
    title: `Building Permit: ${address}`,
    address,
    value: value ? parseFloat(value.replace(/,/g, '')) : undefined,
    date: new Date().toISOString(),
    rawData: { /* store original HTML/data */ },
    location: extractLocationFromAddress(address),
  });
}
```

---

## 🍺 Liquor Licenses (High Value)

**URL:** `https://able.ok.gov/licenses`

**Function:** `scrapeLiquorLicenses()` (line ~459)

**What to Look For:**
- License application listings
- Business name, location, application date
- Status (pending, approved, etc.)
- Filter by OKC area

**Value:** Early signal for new restaurants/bars before they open!

---

## 📄 Business Licenses

**URL:** `https://www.sos.ok.gov/corp/corpInquiryFind.aspx`

**Function:** `scrapeBusinessLicenses()` (line ~426)

**What to Look For:**
- May require form submission or API
- Check if OK SOS has public data export
- New LLCs, business registrations
- Filter by OKC zip codes

**Note:** This might need a different approach (API, CSV export, etc.)

---

## 🏘️ Property Records

**URL:** `https://oklahomacounty.org/assessor`

**Function:** `scrapePropertyRecords()` (line ~490)

**What to Look For:**
- Recent property sales
- Commercial transactions
- Buyer/seller names
- Sale prices
- Property addresses

**Value:** Early signal for major real estate deals

---

## 📐 Zoning Changes

**URL:** `https://www.okc.gov/planning`

**Function:** `scrapeZoningChanges()` (line ~520)

**What to Look For:**
- Planning commission agendas
- Zoning change requests
- Development applications
- Public hearing notices

**Value:** Early signal for future development

---

## 🚀 Quick Start: Enable One Source

To test with one source:

1. **Pick a source** (Building Permits recommended)
2. **Inspect the site** - visit the URL, inspect HTML
3. **Update the parser** - adjust `scrapeBuildingPermits()` function
4. **Enable it:**
   ```typescript
   {
     name: 'OKC Building Permits',
     type: 'permit',
     url: 'https://okc.gov/development-services/building-permits',
     enabled: true, // ← Change to true
     parser: 'parseBuildingPermits',
     rateLimitMs: 2000,
   },
   ```
5. **Test** - Run cron job, check logs
6. **Iterate** - Adjust parser based on results

---

## 💡 Pro Tips

### 1. Start with Building Permits
- Highest value (shows development before news)
- Usually well-structured (government sites)
- Clear data (address, value, date)

### 2. Use Browser DevTools
- Right-click → Inspect
- Find data elements
- Copy HTML structure
- Test selectors

### 3. Handle Edge Cases
- Missing data fields
- Different date formats
- Special characters
- Pagination

### 4. Test Incrementally
- Enable one source at a time
- Test with small date ranges first
- Verify data quality
- Then enable more sources

### 5. Check for APIs
- Some government sites have APIs
- Better than HTML scraping
- More reliable
- Check site documentation

---

## 📊 Expected Output

Once parsers are implemented, you'll get:

**Building Permit Example:**
```json
{
  "title": "Building Permit: 123 Main St, Bricktown",
  "address": "123 Main St",
  "value": 2500000,
  "location": "Bricktown, OKC",
  "ai_summary": "New $2.5M building permit filed in Bricktown suggests major development. This could indicate a new restaurant or retail space coming to the area, creating opportunities for contractors and suppliers.",
  "category": "development",
  "tags": ["okc", "bricktown", "development"]
}
```

**Liquor License Example:**
```json
{
  "title": "New Liquor License: The Bricktown Tavern",
  "businessName": "The Bricktown Tavern",
  "location": "Bricktown, OKC",
  "ai_summary": "New liquor license application for The Bricktown Tavern in Bricktown. This suggests a new restaurant or bar is planning to open, indicating continued growth in the Bricktown entertainment district.",
  "category": "opening",
  "tags": ["okc", "bricktown", "food-beverage"]
}
```

---

## 🔍 Debugging

### Check Logs:
- Vercel function logs show what's being scraped
- Look for parser warnings
- Check for HTML structure issues

### Test Parsers:
- Create a test script to run parsers individually
- Log raw HTML to see what you're working with
- Test selectors before full integration

### Common Issues:
- **No data found:** HTML structure changed or selector wrong
- **Wrong data:** Selector too broad, need more specific
- **Missing fields:** Handle optional fields gracefully
- **Rate limiting:** Increase delays if getting blocked

---

## ✅ Success Checklist

- [ ] Inspected actual government site HTML
- [ ] Updated parser function with correct selectors
- [ ] Tested parser returns correct data structure
- [ ] Enabled source in `PUBLIC_DATA_SOURCES`
- [ ] Ran cron job and verified data appears
- [ ] Checked AI insights are generated correctly
- [ ] Verified posts appear in review queue
- [ ] Tested with multiple records

---

## 🎯 Next Steps

1. **Start with Building Permits** - Highest value, usually easiest
2. **Then Liquor Licenses** - High value for restaurant intel
3. **Then Property Records** - Real estate deals
4. **Then Business Licenses** - New business openings
5. **Finally Zoning** - Future development signals

**Priority Order:**
1. Building Permits ⭐⭐⭐
2. Liquor Licenses ⭐⭐⭐
3. Property Records ⭐⭐
4. Business Licenses ⭐⭐
5. Zoning Changes ⭐

---

**The framework is ready - just need to adjust parsers based on actual site structure!**

