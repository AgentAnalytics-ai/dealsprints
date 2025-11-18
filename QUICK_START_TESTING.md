# 🚀 Quick Start: Testing Your Transformation

## ⚠️ CRITICAL: Deploy First!

Your cron job is still showing **18 sources** - that means the OLD code is running. You need to deploy the new code first.

---

## Step 1: Deploy to Vercel (5 minutes)

```bash
# Option A: Via Git (Recommended)
git add .
git commit -m "Transform scraper to legal sources only"
git push origin main

# Option B: Via Vercel CLI
vercel --prod
```

**Wait for deployment to complete** (check Vercel dashboard)

---

## Step 2: Quick Verification (2 minutes)

### Test the Cron Job

Open in browser:
```
https://dealsprints.com/api/cron/scrape-okc?secret=YOUR_CRON_SECRET
```

### ✅ What You Should See:

```json
{
  "success": true,
  "sources": {
    "rss": {
      "total": 5,    ← MUST BE 5, NOT 18!
      "processed": 5
    }
  },
  "stats": {
    "rssScraped": 20,
    "rssNew": 3,
    "rssDuplicates": 17
  }
}
```

### ❌ If You Still See:

```json
{
  "sources": 18  ← OLD CODE! Need to deploy
}
```

**Fix:** Check Vercel deployment status, wait for it to complete, or clear cache.

---

## Step 3: Verify Sources (1 minute)

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Find `/api/cron/scrape-okc`
3. Click on latest invocation
4. Check logs

### ✅ Should See:
```
📰 Processing City of OKC News (government)...
📰 Processing Greater OKC Partnership (economic-development)...
📰 Processing Downtown OKC Inc (development)...
📰 Processing OKC Chamber (chamber)...
📰 Processing i2E - Innovation to Enterprise (innovation)...
```

### ❌ Should NOT See:
- Journal Record
- The Oklahoman
- Any copyrighted sources

---

## Step 4: Database Check (2 minutes)

### Run in Supabase SQL Editor:

```sql
-- Check recent posts
SELECT 
  source_name,
  COUNT(*) as count,
  MAX(created_at) as latest
FROM scraped_posts
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY source_name
ORDER BY latest DESC;
```

### ✅ Expected Sources:
- City of OKC News
- Greater OKC Partnership
- Downtown OKC Inc
- OKC Chamber
- i2E - Innovation to Enterprise

---

## Step 5: Test Feed Display (1 minute)

Visit: `https://dealsprints.com/okc/feed`

**Verify:**
- ✅ Posts display correctly
- ✅ No errors
- ✅ New posts appear (if any were added)

---

## Step 6: Test Backfill (2 minutes)

1. Go to `/admin/backfill`
2. Check dropdown - should only show 5 legal sources
3. Select "OKC Chamber"
4. Click "Run Backfill"
5. Verify it works

---

## ✅ Success Checklist

- [ ] Cron shows **5 sources** (not 18)
- [ ] Vercel logs show only legal sources
- [ ] Database has posts from legal sources only
- [ ] Feed displays correctly
- [ ] Backfill route works
- [ ] No errors in logs

---

## 🐛 Troubleshooting

### Problem: Still showing 18 sources
**Solution:** 
- Check Vercel deployment completed
- Wait 2-3 minutes for propagation
- Clear browser cache
- Check you're hitting production URL

### Problem: No new posts
**Solution:**
- Normal if sources haven't published new content
- Test with backfill route to verify functionality
- Check if sources are actually active

### Problem: Errors in logs
**Solution:**
- Check OpenAI API key is set
- Verify Supabase credentials
- Check CRON_SECRET matches
- Review error messages in Vercel logs

---

## 📊 What to Monitor

### First 24 Hours:
- [ ] Check cron runs successfully
- [ ] Monitor for new posts
- [ ] Watch for errors
- [ ] Verify content quality

### First Week:
- [ ] Track success rate
- [ ] Monitor duplicate rate
- [ ] Review AI-generated insights
- [ ] Check for any issues

---

## 🎯 Next Steps After Testing

1. **Monitor for 24-48 hours** - Ensure stability
2. **Review content quality** - Check AI insights are good
3. **Plan public data parsers** - When ready to implement
4. **Consider more sources** - If you find other legal development feeds

---

## 📞 Need Help?

If something's not working:
1. Check Vercel function logs
2. Review error messages
3. Verify environment variables
4. Check database connection

**Most common issue:** Old code still deployed - just wait for deployment to complete!

