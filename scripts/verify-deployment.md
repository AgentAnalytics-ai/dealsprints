# Quick Verification Guide

## 1. Check Current Deployment Status

**In Browser:**
```
https://dealsprints.com/api/cron/scrape-okc?secret=YOUR_SECRET
```

**Look for:**
- `"sources": { "rss": { "total": 5 } }` ← Should be 5, NOT 18!

## 2. Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Find `/api/cron/scrape-okc`
5. Check recent invocations
6. Look for log output showing 5 sources

**Should see:**
```
📰 Processing City of OKC News (government)...
📰 Processing Greater OKC Partnership (economic-development)...
📰 Processing Downtown OKC Inc (development)...
📰 Processing OKC Chamber (chamber)...
📰 Processing i2E - Innovation to Enterprise (innovation)...
```

**Should NOT see:**
- Journal Record
- The Oklahoman
- Any copyrighted sources

## 3. Quick Database Check

**In Supabase SQL Editor:**
```sql
-- Check recent posts and their sources
SELECT 
  source_name,
  COUNT(*) as count,
  MAX(created_at) as latest
FROM scraped_posts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY source_name
ORDER BY latest DESC;
```

**Expected sources:**
- City of OKC News
- Greater OKC Partnership
- Downtown OKC Inc
- OKC Chamber
- i2E - Innovation to Enterprise

## 4. Test Backfill Route

**In Admin Panel:**
1. Go to `/admin/backfill`
2. Check dropdown - should only show 5 legal sources
3. Run backfill for one source
4. Verify it works

## 5. Check Feed

**Visit:**
```
https://dealsprints.com/okc/feed
```

**Verify:**
- Posts still display
- New posts appear
- No errors

---

## If Something's Wrong

### Still showing 18 sources?
→ Old code is deployed. Check Vercel deployment status.

### No new posts?
→ Normal if sources haven't published new content. Test with backfill.

### Errors?
→ Check Vercel function logs for details.

