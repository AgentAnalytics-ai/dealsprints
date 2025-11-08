# ⚡ Quick Start - DealSprints OKC Automation

**You asked for:** Fully automated system where you just take photos  
**You got:** Complete Vercel-native automation (no n8n needed!)

---

## 🎯 **Your New Workflow**

### **Daily (100% Automated):**
```
6:00 AM → Vercel Cron scrapes RSS
6:01 AM → AI rewrites 3 articles
6:02 AM → Saves to Supabase (pending_photo)
✅ DONE - No manual work!
```

### **You (5 Minutes Total):**
```
9:00 AM → Visit /admin/review
9:01 AM → Upload 3 photos (drag & drop)
9:04 AM → Click "Approve" on each
9:05 AM → LIVE on /okc/feed!
```

---

## 🚀 **Deploy in 3 Commands**

```bash
# 1. Commit
git add .
git commit -m "Launch automated content system"

# 2. Push
git push

# 3. Add env vars in Vercel (see DEPLOY_NOW.md)
```

**That's it!** Site deploys in 2 minutes.

---

## 📋 **Must-Do Before Deploy**

**In Vercel → Settings → Environment Variables, add:**

1. `NEXT_PUBLIC_SUPABASE_URL` = `https://cshnrqhtwwuombfoqqws.supabase.co`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
3. `SUPABASE_SERVICE_ROLE_KEY` = Your service key
4. `OPENAI_API_KEY` = Your OpenAI key
5. `CRON_SECRET` = Random string (any password)

**5 variables = System works!**

---

## ✅ **What Works Automatically**

- ✅ Daily scraping (6am)
- ✅ AI rewriting (GPT-4o-mini)
- ✅ Duplicate detection
- ✅ Auto-categorization
- ✅ Auto-location extraction
- ✅ Auto-tagging
- ✅ Consistent formatting
- ✅ Photo upload UI
- ✅ One-click publishing
- ✅ ISR cache updates

---

## 📸 **Your Photo Workflow**

### **Weekly (20 minutes):**
1. Drive around OKC (Bricktown, Midtown, Edmond)
2. Take photos of developments/openings
3. Store in folder on computer

### **Daily (3 minutes):**
1. Visit `/admin/review`
2. Drag photos from folder
3. Drop on posts
4. Click approve

**Photos automatically:**
- Saved to `/public/images/`
- Resized/optimized
- Displayed at 224px height
- Cropped to fit card

---

## 💰 **Total Cost**

```
Monthly: $3 (just OpenAI)
Yearly: $36
```

**vs manual work:** Saves 3 hours/week = $600/month in time!

---

## 🎉 **You're Done!**

**No n8n complexity**  
**No external tools**  
**All in your codebase**  
**$0 extra infrastructure cost**

**Just deploy and start using it!** 🚀

See `DEPLOY_NOW.md` for detailed steps!

