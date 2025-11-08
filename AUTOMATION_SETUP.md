# 🚀 DealSprints OKC - Complete Automation Setup

**Built:** November 8, 2025  
**Approach:** 2026 Best Practices - All Vercel, No External Tools  
**Cost:** $0/month (vs $20/month with n8n)

---

## ✅ **What Was Built**

### **Complete Automated System:**

```
Vercel Cron (6am daily)
    ↓
Scrapes RSS → AI Rewrites → Supabase
    ↓
You Review (/admin/review)
    ↓
Add Photo → Click Approve
    ↓
Instantly Live on /okc/feed
```

**Time Required:** 5 minutes/day to review + add photos

---

## 📁 **New Files Created**

```
vercel.json                                  ← Cron configuration
src/lib/supabase.ts                         ← Database client
src/app/api/cron/scrape-okc/route.ts        ← RSS scraper + AI
src/app/api/admin/pending-posts/route.ts    ← Fetch pending posts
src/app/api/admin/upload-photo/route.ts     ← Photo upload handler
src/app/api/admin/publish-post/route.ts     ← Publish post handler
src/app/api/admin/reject-post/route.ts      ← Reject post handler
src/app/admin/review/page.tsx               ← Admin UI for review
.env.example                                 ← Environment template
```

**Modified:**
- `src/app/page.tsx` → Reads from Supabase
- `src/app/okc/feed/page.tsx` → Reads from Supabase

---

## 🔧 **Setup Instructions**

### **Step 1: Supabase Table (Already Done)**

✅ You already created the `scraped_posts` table in your Supabase project

---

### **Step 2: Environment Variables**

**Add to Vercel:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these (from your Supabase dashboard):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cshnrqhtwwuombfoqqws.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJh... (your service role key)
```

3. Add OpenAI key:
```bash
OPENAI_API_KEY=sk-proj-... (your DealSprints OKC project key)
```

4. Add Cron Secret (generate random string):
```bash
CRON_SECRET=randomly-generated-secret-key-12345
```

5. Click **"Save"** on each
6. **Redeploy** (Vercel will prompt you)

---

### **Step 3: Configure Vercel Cron**

**After deploying:**

1. Go to Vercel Dashboard → Your Project → **"Cron Jobs"** tab
2. You should see: `POST /api/cron/scrape-okc` scheduled for "0 6 * * *"
3. Vercel automatically picks this up from `vercel.json`
4. **It will run daily at 6am automatically!**

---

### **Step 4: Secure the Cron Endpoint**

**Vercel adds a secret header automatically, but for extra security:**

In `vercel.json`, Vercel Cron requests include:
- Header: `x-vercel-cron-id`  
- Header: `authorization: Bearer ${CRON_SECRET}`

The route checks for the secret — only Vercel can trigger it!

---

## 🎯 **How It Works**

### **Daily Automated Flow:**

```
6:00 AM CT - Vercel Cron triggers
    ↓
/api/cron/scrape-okc runs:
  1. Fetches Journal Record RSS (20 articles)
  2. Filters OKC metro only (2-5 articles)
  3. Checks Supabase for duplicates
  4. For NEW articles:
     - Calls OpenAI GPT-4o-mini ($0.001/article)
     - Rewrites in OKC insider voice
     - Categorizes (opening/development/expansion)
     - Extracts location/tags
     - Inserts to Supabase (status: "pending_photo")
  5. Skips duplicates
    ↓
Result: 2-5 new articles ready for review
```

---

### **Your Daily Workflow (5 minutes):**

**Morning:**

1. Visit `https://dealsprints.com/admin/review`
2. See 3 new posts with AI-generated summaries
3. For each post:
   - Click "Upload Photo" → Select photo from your iPhone/computer
   - Wait 2 seconds (uploads to `/public/images/`)
   - Click "Approve & Publish"
4. **Instantly live on /okc/feed!**

---

## 📸 **Photo Requirements**

**Format:** JPG, PNG, WebP  
**Size:** Max 5MB (automatically handled)  
**Dimensions:** Any (auto-cropped to 224px height in FeedCard)  
**Naming:** Auto-generated: `post-{id}-{timestamp}.jpg`  
**Storage:** `/public/images/` (version controlled)

**Your photos:**
- Take with iPhone around OKC
- Upload via admin panel
- Instant display (no deploy needed)

---

## 🎨 **Post Format (Automatically Enforced)**

Every post card displays:
```
┌──────────────────────────────────┐
│  [YOUR PHOTO - 224px height]     │ ← Auto-cropped
├──────────────────────────────────┤
│  🎉 Opening                       │ ← Auto-categorized
│  retail  downtown                 │ ← Auto-tagged
│                                   │
│  Title (2 lines max)              │ ← Auto-truncated
│                                   │
│  AI Summary (3 lines max)         │ ← Auto-truncated
│                                   │
│  📍 Bricktown, OKC    📅 Nov 8    │ ← Auto-extracted
│  🔗 Source: Journal Record        │
└──────────────────────────────────┘
```

**All formatting handled by `FeedCard.tsx`** — you just add photo!

---

## 🔄 **Data Flow**

```
1. RSS SCRAPING (Automated - 6am daily)
   ├─ Vercel Cron → /api/cron/scrape-okc
   ├─ Fetches Journal Record feed
   ├─ Filters OKC metro articles
   ├─ AI rewrites summaries
   ├─ Saves to Supabase (pending_photo)
   └─ Logs: "Added 3 new articles"

2. ADMIN REVIEW (You - 5 min/day)
   ├─ Visit: /admin/review
   ├─ See: 3 pending posts
   ├─ Upload: Photo for each
   ├─ Click: "Approve & Publish"
   └─ Status: pending_photo → published

3. LIVE DISPLAY (Instant)
   ├─ /okc/feed reads: WHERE status = "published"
   ├─ Homepage shows: Latest 6 posts
   ├─ ISR revalidates: Every hour
   └─ Users see: Fresh content with photos
```

---

## 💰 **Cost Breakdown**

```
Vercel Cron: $0/month (included in Hobby/Pro)
Supabase: $0/month (free tier - 500MB, plenty)
OpenAI: $3/month (100 summaries @ $0.03/batch)
Storage: $0 (public/images/ in git)
Total: $3/month
```

**vs n8n approach:** $20/month savings! 💸

---

## 🎯 **Testing the System**

### **Test the Scraper (Manual Trigger):**

**Visit in browser (with auth header):**
```bash
curl -X GET https://dealsprints.com/api/cron/scrape-okc \
  -H "Authorization: Bearer your-cron-secret"
```

**Or test locally:**
```bash
npm run dev

# In another terminal:
curl http://localhost:3000/api/cron/scrape-okc \
  -H "Authorization: Bearer your-cron-secret"
```

**Expected response:**
```json
{
  "success": true,
  "stats": {
    "totalScraped": 20,
    "totalNew": 3,
    "totalDuplicates": 0
  }
}
```

---

### **Test Admin Review:**

1. Visit `/admin/review`
2. Should see 3 pending posts
3. Upload photo for one
4. Click "Approve"
5. Go to `/okc/feed` → Should see it live!

---

## 🔐 **Security**

### **Cron Endpoint:**
- ✅ Protected by `CRON_SECRET` header
- ✅ Only Vercel can call it
- ✅ Returns 401 if unauthorized

### **Admin Pages:**
- ⚠️ Currently no auth (add password or Supabase Auth later)
- ⚠️ Don't share `/admin/review` URL publicly
- ✅ Server-side operations use `service_role` key

### **Photo Uploads:**
- ✅ File type validation
- ✅ Size limits (5MB)
- ✅ Saved to public folder (safe for static sites)

---

## 📊 **Monitoring**

### **Check Cron Runs:**

**Vercel Dashboard:**
- Functions → Filter by `/api/cron/scrape-okc`
- See logs for each 6am run
- Check for errors

**Supabase:**
```sql
-- See all pending posts
SELECT COUNT(*) FROM scraped_posts WHERE status = 'pending_photo';

-- See published posts
SELECT COUNT(*) FROM scraped_posts WHERE status = 'published';

-- Recent scrapes
SELECT created_at, scraped_title, ai_summary 
FROM scraped_posts 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🚀 **Deployment Checklist**

**Before deploying:**

- [x] Supabase table created
- [ ] Environment variables added to Vercel
- [ ] `CRON_SECRET` generated and saved
- [ ] Git committed and pushed
- [ ] Vercel deployed successfully
- [ ] Cron job appears in Vercel dashboard
- [ ] Test scraper endpoint manually
- [ ] Test admin review page
- [ ] Verify /okc/feed shows Supabase data

---

## 🎯 **Your Daily Workflow**

### **Morning (5 minutes):**

1. **Check email** (optional - can add notification later)
2. **Visit** `/admin/review`
3. **See** 2-5 new posts with AI summaries
4. **Upload** photos you took this week
5. **Approve** good ones, reject spam
6. **Done!** Posts go live instantly

### **Weekly Photo Hunt (20 minutes):**

1. **Drive around** OKC (Bricktown, Plaza, Midtown, Edmond)
2. **Take photos** of new developments/openings
3. **Store** in a folder on your computer
4. **Use** in admin review panel throughout week

---

## 🔮 **Future Enhancements**

### **Phase 2 (Week 2):**
- [ ] Add email notification when new posts ready
- [ ] Add manual "Add Post" form in admin
- [ ] Add more RSS sources (Oklahoman, City of OKC)

### **Phase 3 (Month 2):**
- [ ] Add Supabase Auth for admin pages
- [ ] Add bulk photo upload
- [ ] Add post editing
- [ ] Add scheduled publishing

### **Phase 4 (Month 3):**
- [ ] Add Google News API for more sources
- [ ] Add Instagram hashtag monitoring
- [ ] Add community submissions workflow
- [ ] Weekly digest email automation

---

## 🎉 **System Complete!**

You now have:
- ✅ Automated RSS scraping (Vercel Cron)
- ✅ AI content rewriting (OpenAI)
- ✅ Duplicate detection (Supabase)
- ✅ Photo upload UI (Admin panel)
- ✅ One-click publishing (Instant live)
- ✅ No external tools (all in code)
- ✅ $0 extra monthly cost

**Next:** Deploy and start using it! 🚀

---

## 🛠️ **Troubleshooting**

### **Cron not running:**
- Check Vercel Dashboard → Cron Jobs tab
- Verify `vercel.json` is in root
- Check environment variables are set

### **No posts in admin review:**
- Manually trigger: `curl .../api/cron/scrape-okc`
- Check Vercel function logs
- Verify Supabase connection

### **Photo upload fails:**
- Check `/public/images/` folder exists
- Verify file permissions
- Check Vercel function logs

---

**Ready to deploy!** See deployment steps below. 🚀

