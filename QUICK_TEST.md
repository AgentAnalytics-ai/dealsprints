# Quick Test: November Posts

## Option 1: Test API Endpoint (Works Immediately)

**URL:**
```
https://dealsprints.com/api/admin/test-november
```

**What it shows:**
- Total posts from November
- Breakdown by source
- Recent posts with full details
- Flags copyrighted sources

**Example Response:**
```json
{
  "success": true,
  "summary": {
    "totalPosts": 25,
    "sources": 5,
    "hasCopyrightedSources": false
  },
  "bySource": [
    {
      "source": "City of OKC News",
      "count": 5,
      "isLegal": true
    },
    {
      "source": "i2E Innovation",
      "count": 20,
      "isLegal": true
    }
  ],
  "recentPosts": [
    {
      "title": "...",
      "source": "...",
      "summary": "...",
      "isLegal": true
    }
  ]
}
```

## Option 2: Deploy Full Dashboard

**To make `/admin/test-quality` work:**

1. **Deploy to Vercel:**
   ```bash
   git add .
   git commit -m "Add content quality testing tool"
   git push origin main
   ```

2. **Wait for deployment** (2-3 minutes)

3. **Visit:** `/admin/test-quality`

## Option 3: Test Locally

**If running locally:**
```bash
npm run dev
```

Then visit: `http://localhost:3000/admin/test-quality`

---

## What to Look For

### ✅ Good Results:
- Posts from November exist
- Only legal sources (City of OKC, Greater OKC Partnership, etc.)
- AI summaries are original insights
- OKC-specific locations mentioned

### ⚠️ Issues:
- Copyrighted sources still appearing → Use cleanup tool
- No posts → Sources haven't published new content
- Low quality → Review AI prompts

---

**Start with Option 1 (API endpoint) - it works immediately!**

