# Testing Checklist - OKC Scraper Transformation

## 🚨 Critical: Deploy First!

The cron job is still running the OLD code (showing 18 sources). You need to deploy the new code first.

## Pre-Deployment Checks

### 1. Verify Code Changes
- [ ] Confirm `src/app/api/cron/scrape-okc/route.ts` has only 5 RSS sources (not 18)
- [ ] Verify `DEVELOPMENT_RSS_SOURCES` array has 5 items
- [ ] Check that all copyrighted sources are removed
- [ ] Confirm AI function is `generateOriginalInsight` (not `rewriteSummary`)

### 2. Database Migration (Optional but Recommended)
```sql
-- Run this in Supabase SQL Editor
ALTER TABLE scraped_posts 
ADD COLUMN IF NOT EXISTS data_type TEXT DEFAULT 'rss';

-- Update existing records
UPDATE scraped_posts 
SET data_type = 'rss' 
WHERE data_type IS NULL;
```

### 3. Environment Variables
- [ ] Verify `CRON_SECRET` is set in Vercel environment variables
- [ ] Confirm OpenAI API key is configured
- [ ] Check Supabase credentials are set

## Deployment Steps

### 1. Deploy to Vercel
```bash
# Commit changes
git add .
git commit -m "Transform scraper to legal sources only"

# Deploy
git push origin main
# OR
vercel --prod
```

### 2. Verify Deployment
- [ ] Check Vercel dashboard - deployment successful
- [ ] Verify no build errors
- [ ] Check function logs for any errors

## Testing Steps

### Test 1: Manual Cron Trigger (Immediate)

**URL to test:**
```
https://dealsprints.com/api/cron/scrape-okc?secret=YOUR_CRON_SECRET
```

**Expected Results:**
- ✅ `"success": true`
- ✅ `"sources": { "rss": { "total": 5 } }` (NOT 18!)
- ✅ `"stats": { "rssScraped": X, "rssNew": Y }`
- ✅ Only 5 sources in logs (City of OKC, Greater OKC Partnership, Downtown OKC Inc, OKC Chamber, i2E)

**What to Check:**
1. Open browser to the cron URL
2. Check JSON response
3. Verify `sources.rss.total` is 5 (not 18)
4. Check console logs in Vercel dashboard
5. Verify no errors

### Test 2: Verify Legal Sources Only

**Check logs for:**
```
📰 Processing City of OKC News (government)...
📰 Processing Greater OKC Partnership (economic-development)...
📰 Processing Downtown OKC Inc (development)...
📰 Processing OKC Chamber (chamber)...
📰 Processing i2E - Innovation to Enterprise (innovation)...
```

**Should NOT see:**
- ❌ Journal Record
- ❌ The Oklahoman
- ❌ OKC Friday
- ❌ NonDoc
- ❌ Business Journal
- ❌ Oklahoma Gazette

### Test 3: Database Verification

**Check Supabase:**
```sql
-- Check recent posts
SELECT 
  source_name, 
  data_type,
  scraped_title,
  ai_summary,
  created_at
FROM scraped_posts
ORDER BY created_at DESC
LIMIT 10;
```

**Expected:**
- ✅ `source_name` should only be one of the 5 legal sources
- ✅ `data_type` should be 'rss' (or NULL for old records)
- ✅ `ai_summary` should be original insights (not rewrites)

### Test 4: AI Content Quality

**Check a few recent posts:**
- ✅ AI summaries should be original insights
- ✅ Should mention OKC neighborhoods/locations
- ✅ Should focus on business implications
- ✅ Should NOT be direct rewrites of news articles

### Test 5: Backfill Route

**Test URL:**
```
POST /api/admin/backfill-chamber
Body: { "monthsBack": 1, "sourceName": "OKC Chamber" }
```

**Expected:**
- ✅ Only legal sources in dropdown
- ✅ Works with new AI function
- ✅ Adds `data_type: 'rss'` to records

### Test 6: Feed Display

**Check:**
- [ ] Visit `/okc/feed`
- [ ] Verify posts still display correctly
- [ ] Check that new posts appear
- [ ] Verify categories and tags work

## Verification Checklist

### ✅ Success Criteria

1. **Source Count**
   - [ ] Cron shows 5 RSS sources (not 18)
   - [ ] No copyrighted sources in logs

2. **Content Quality**
   - [ ] AI generates original insights
   - [ ] Mentions OKC locations/neighborhoods
   - [ ] Focuses on business implications

3. **Database**
   - [ ] New posts have `data_type: 'rss'`
   - [ ] Only legal sources in `source_name`
   - [ ] No errors in inserts

4. **Performance**
   - [ ] Cron completes in < 5 minutes
   - [ ] No timeout errors
   - [ ] Rate limiting works (no 429 errors)

5. **Error Handling**
   - [ ] Graceful handling of failed sources
   - [ ] Proper error logging
   - [ ] No crashes

## Common Issues & Fixes

### Issue 1: Still Showing 18 Sources
**Cause:** Old code still deployed
**Fix:** 
- Verify deployment completed
- Check Vercel function logs
- Clear Vercel cache if needed

### Issue 2: No New Posts
**Cause:** All articles already in database
**Fix:**
- This is normal if sources haven't published new content
- Test with backfill route to verify functionality
- Check if sources are actually publishing new content

### Issue 3: Database Errors
**Cause:** Missing `data_type` column
**Fix:**
- Run database migration SQL
- Or make `data_type` optional in code (already done)

### Issue 4: AI Generation Errors
**Cause:** OpenAI API issues
**Fix:**
- Check OpenAI API key
- Verify rate limits
- Check API quota

## Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor cron job runs (check Vercel logs)
- [ ] Verify new posts are being added
- [ ] Check for any errors
- [ ] Monitor OpenAI API usage

### First Week
- [ ] Track success rate
- [ ] Monitor duplicate rate
- [ ] Check content quality
- [ ] Verify no legal issues

## Rollback Plan (If Needed)

If something breaks:

1. **Revert Code:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or Restore from Backup:**
   - Use Vercel deployment history
   - Restore previous deployment

3. **Database:**
   - `data_type` column is optional
   - Old code will work without it

## Success Indicators

✅ **Everything is working if:**
- Cron shows 5 sources (not 18)
- New posts are being added
- AI summaries are original insights
- No errors in logs
- Feed displays correctly
- Backfill route works

---

**Next Steps After Testing:**
1. Monitor for 24-48 hours
2. Review content quality
3. Plan implementation of public data parsers
4. Consider adding more legal sources if needed

