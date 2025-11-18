# Cleanup Guide: Remove Copyrighted Posts

## 🚨 The Problem

You're seeing old posts from **Journal Record** and other copyrighted sources in your review queue. These are from **before the transformation** - the new scraper is working correctly (only 5 legal sources), but old posts remain in the database.

## ✅ Solution: Cleanup Tool

I've created a cleanup tool to safely remove all copyrighted posts.

### Step 1: Preview What Will Be Deleted

1. Go to: `/admin/cleanup`
2. Select **"Preview (Dry Run)"** mode
3. Click **"Preview Cleanup"**
4. Review what will be deleted

### Step 2: Delete Copyrighted Posts

1. Select **"Delete (Permanent)"** mode
2. Click **"Delete Copyrighted Posts"**
3. Confirm the deletion
4. Done!

## What Gets Deleted

**Copyrighted Sources (REMOVED):**
- Journal Record (all categories)
- The Oklahoman
- OKC Friday
- NonDoc
- Oklahoma City Business Journal
- Oklahoma Gazette

## What Gets Kept

**Legal Sources (KEPT):**
- City of OKC News
- Greater OKC Partnership
- Downtown OKC Inc
- OKC Chamber
- i2E - Innovation to Enterprise

## Safety Features

- ✅ Preview mode shows exactly what will be deleted
- ✅ Only deletes copyrighted sources
- ✅ Keeps all legal sources
- ✅ Shows count by source
- ✅ Confirmation required for deletion

## After Cleanup

Once cleaned up:
- Review queue will only show legal sources
- No copyright concerns
- Ready to focus on government data scraping

---

## Next: Government Data Scraping

After cleanup, we can focus on implementing the government data scrapers we discussed:
- Building Permits
- Liquor Licenses
- Business Licenses
- Property Records
- Zoning Changes

These will give you **original content** from public data, not copyrighted news.

