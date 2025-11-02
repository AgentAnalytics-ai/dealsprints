# 🚀 OKC Pulse - Phase 1 Launch Guide

**Status:** ✅ Ready to Deploy  
**Completed:** November 2, 2025  
**Type:** No-Database MVP (Mock Data)

---

## What We Built

Successfully pivoted DealSprints from B2B business valuation platform to **OKC Pulse** - Oklahoma City's feed of developments, openings, and verified business network.

### ✅ Completed Features

1. **Homepage** - Complete OKC Pulse landing page with:
   - Hero section with gradient background
   - Live stats (20 posts, 12 members, 8 verified)
   - Recent feed preview (6 latest posts)
   - Member directory preview (6 verified members)
   - Benefits section
   - Pricing overview (Free/Verified/Pro)

2. **OKC Feed** (`/okc/feed`)
   - Full feed with 20 curated OKC posts
   - Filterable by type (development/opening/expansion/event/data-insight)
   - Filterable by tags
   - Post cards with source attribution
   - Submit tip CTA

3. **Member Directory** (`/okc/members`)
   - 12 member profiles (mix of verified/pro/free)
   - Filterable by category, plan, search term
   - Member cards with badges
   - Stats overview

4. **Individual Profiles** (`/okc/members/[slug]`)
   - Full profile pages for each member
   - Logo, bio, contact info
   - Social links (Instagram, LinkedIn, Facebook)
   - Verified/Pro badges
   - Static generation for all 12 members

5. **Waitlist Page** (`/waitlist`)
   - Multi-purpose form (join network / submit tip / sponsor)
   - Plan selection (Free/Verified/Pro)
   - Submits to existing `/api/lead` endpoint
   - Success confirmation screen

6. **Updated Metadata & SEO**
   - Homepage metadata updated to OKC Pulse
   - Sitemap includes all member profiles
   - Schema.org structured data
   - Dynamic sitemap generation

7. **Email Integration**
   - Waitlist submissions sent via Resend
   - OKC Pulse-specific email template
   - Existing infrastructure reused

---

## File Structure

```
src/
├── lib/
│   └── data/
│       └── mockFeed.ts              ← 20 posts + 12 members (UPDATE WEEKLY)
├── components/
│   ├── feed/
│   │   ├── FeedCard.tsx            ← Post display component
│   │   └── FeedList.tsx            ← Feed with filters
│   └── members/
│       ├── MemberCard.tsx          ← Member card display
│       └── MemberGrid.tsx          ← Directory with filters
├── app/
│   ├── page.tsx                    ← NEW: OKC Pulse homepage
│   ├── layout.tsx                  ← UPDATED: OKC Pulse metadata
│   ├── sitemap.ts                  ← UPDATED: Includes members
│   ├── okc/
│   │   ├── feed/page.tsx          ← Feed page
│   │   └── members/
│   │       ├── page.tsx           ← Directory page
│   │       └── [slug]/page.tsx    ← Individual profiles
│   ├── waitlist/page.tsx          ← Waitlist signup
│   └── api/
│       └── lead/route.ts          ← UPDATED: OKC Pulse emails
```

---

## Mock Data Location

**File:** `src/lib/data/mockFeed.ts`

### To Update Weekly:

1. Edit `MOCK_POSTS` array - add new posts at top
2. Edit `MOCK_MEMBERS` array - add new members
3. Git commit and push
4. Vercel auto-deploys in ~2 minutes

### Example New Post:

```typescript
{
  id: '21', // Increment
  kind: 'opening',
  title: 'New coffee shop opens in Plaza District',
  location: 'Plaza District, OKC',
  date: '2024-11-08', // Today's date
  summary: 'Brief description...',
  source: 'Community Submission',
  tags: ['food-beverage', 'plaza-district'],
}
```

### Example New Member:

```typescript
{
  slug: 'my-business-okc',
  businessName: 'My Business Name',
  category: 'Food & Beverage',
  tagline: 'Short one-liner',
  plan: 'free', // or 'verified' or 'pro'
  logoUrl: '/logos/my-business.png',
  website: 'https://mybusiness.com',
  instagram: '@mybusiness',
  isActive: true,
}
```

---

## What Stayed the Same

✅ Domain: dealsprints.com  
✅ Vercel deployment  
✅ Resend email integration  
✅ Tailwind design system  
✅ Google Maps API (for future use)  
✅ All environment variables  
✅ Footer component  
✅ Build configuration

---

## What Changed

🔄 Homepage (App Router - server component now)  
🔄 Metadata (OKC Pulse branding)  
🔄 Sitemap (includes member profiles)  
🔄 Email templates (OKC Pulse styling)  

---

## Deployment Checklist

### Pre-Deploy

- [x] Mock data has 20+ real OKC posts
- [x] Mock data has 10+ member profiles
- [x] All routes tested locally
- [x] Email integration tested
- [x] Metadata updated

### Deploy to Vercel

```bash
git add .
git commit -m "Pivot to OKC Pulse Phase 1"
git push
```

Vercel will auto-deploy in ~2 minutes.

### Post-Deploy Verification

1. Visit `https://dealsprints.com` - Should show OKC Pulse homepage
2. Visit `/okc/feed` - Should show 20 posts with filters
3. Visit `/okc/members` - Should show member directory
4. Visit `/okc/members/revive-medspa-okc` - Should show profile
5. Visit `/waitlist` - Should show signup form
6. Submit waitlist form - Should receive email at `ADMIN_EMAIL`
7. Check `/sitemap.xml` - Should include all member profiles

### If Issues:

- Check Vercel logs for build errors
- Verify `dealsprints_resend` env var is set
- Verify `ADMIN_EMAIL` env var is set
- Clear browser cache if seeing old content

---

## Next Steps (Phase 2 - When Ready)

### When to Add Database:

- When manually updating `mockFeed.ts` becomes painful (50+ posts)
- When you have 100+ waitlist signups
- When you want to let members edit their own profiles

### Migration Path:

1. Add Supabase to project
2. Create tables: `posts`, `members`, `submissions`
3. Import mock data as seed data
4. Replace `MOCK_POSTS` with `supabase.from('posts').select()`
5. Add admin CMS for easy editing

### When to Add Payments:

- When members are asking for verified badges
- When you have 20+ serious member inquiries
- Estimated: 2-3 weeks after Phase 1 launch

### When to Add Automation:

- Content scraping - Only when you have 3+ reliable sources
- Weekly digest email - When list reaches 200+ subscribers
- Top-10 algorithm - When you have 100+ posts to choose from

---

## Maintenance

### Weekly (5 minutes):

1. Add 5-10 new posts to `mockFeed.ts`
2. Add any new member signups from waitlist
3. Git commit and push
4. Vercel auto-deploys

### Monthly:

- Review analytics (Vercel Analytics)
- Update member statuses (free → verified if paid)
- Respond to waitlist submissions

---

## Key Decisions Made

1. **No database yet** - Validate concept first, add complexity later
2. **Mock data in code** - Easy to version control, fast deploys
3. **Reuse existing infrastructure** - Keep domain, Vercel, email setup
4. **Server components** - Homepage is now SSR-compatible (faster)
5. **Static generation** - Member profiles pre-rendered for speed

---

## Performance

- **Homepage:** Static (regenerates on build)
- **Feed:** ISR - revalidates hourly
- **Members:** ISR - revalidates hourly  
- **Individual profiles:** Static - generated at build time
- **Waitlist:** Client-side form

---

## Analytics to Watch

- Homepage visits
- `/okc/feed` page views
- `/okc/members` page views
- Waitlist conversion rate
- Verified member click-through

---

## Support

If you need to:
- **Add a post manually:** Edit `src/lib/data/mockFeed.ts`
- **Add a member:** Edit `MOCK_MEMBERS` in same file
- **Change pricing:** Edit `/okc/members/page.tsx` and `/waitlist/page.tsx`
- **Update email template:** Edit `src/app/api/lead/route.ts`
- **Change metadata:** Edit `src/app/layout.tsx`

---

## 🎉 Success Metrics for Phase 1

- 100+ waitlist signups = Validated concept
- 10+ verified member requests = Time to add Stripe
- 200+ feed page views/week = Time to automate content
- 50+ posts manually managed = Time to add database

---

**Built with:** Next.js 14, TypeScript, Tailwind CSS, Resend  
**Deploy time:** ~2 hours  
**Maintenance:** ~5 min/week  
**Ready to scale:** Add Supabase + Stripe when validated

