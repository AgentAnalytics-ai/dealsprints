# 🧹 Massive Cleanup Plan - Expert Assessment

## Expert Rating: 3/10 → Target: 9/10

**Current Issues:**
- Too many unused routes/pages
- Confusing navigation
- Legacy features mixed with new
- Unused components
- Unused API routes
- Dashboard tabs may be unnecessary

## 🎯 What We Actually Need (Productized)

### Core Product: OKC Realtor Intelligence Dashboard
- `/login` - Login page
- `/realtor/dashboard` - Main dashboard (NO TABS - just show everything)
- `/realtor/lead/[id]` - Lead detail page
- `/api/realtor/*` - Realtor API endpoints
- `/api/cron/scrape-okc` - Daily scraper

### Essential Only:
- `/api/stripe/webhook` - Payment processing
- `/api/auth/callback` - Auth callback

## ❌ DELETE These Routes/Pages

### Pages to Delete:
1. `/about` - Not needed (realtors don't care)
2. `/contact` - Not needed (use support email)
3. `/pricing` - Not needed (handled in Stripe)
4. `/signup` - Not needed (login handles both)
5. `/dashboard` - Old dashboard (use `/realtor/dashboard`)
6. `/okc/feed` - Legacy public feed (not main product)
7. `/okc/members` - Legacy member directory (not main product)
8. `/waitlist` - Not needed
9. `/welcome` - Not needed
10. `/privacy` - Not needed (can add later)
11. `/terms` - Not needed (can add later)
12. `/[city]/buy` - Old concept
13. `/[city]/sell` - Old concept
14. `/buy` - Old concept
15. `/sell` - Old concept

### Admin Pages to Delete (or keep minimal):
- `/admin/backfill` - Keep only if needed
- `/admin/cleanup` - Keep only if needed
- `/admin/published` - Keep only if needed
- `/admin/test-quality` - DELETE (testing only)
- Keep `/admin/review` if content moderation needed

### API Routes to Delete:
1. `/api/contact` - Not needed
2. `/api/lead` - Not needed (old lead capture)
3. `/api/feed/posts` - Legacy feed API
4. `/api/revalidate` - Not needed
5. `/api/stripe/checkout` - Use `/api/realtor/checkout` instead
6. `/api/stripe/checkout-anonymous` - Not needed
7. `/api/stripe/test` - DELETE (testing only)
8. Most `/api/admin/*` routes - Keep only essential ones

### Components to Delete:
1. `Assessment.tsx` - Old business analysis
2. `BusinessIntelligenceReport.tsx` - Old feature
3. `BusinessMarketplaceTab.tsx` - Old feature
4. `BusinessSearch.tsx` - Old feature
5. `FreeEvaluationTab.tsx` - Old feature
6. `MarketInsightsTab.tsx` - Old feature
7. `RecentlySoldTab.tsx` - Old feature
8. `SurveyForm.tsx` - Old feature
9. `LiveIndustryStats.tsx` - Old feature
10. `LiveInsightsPanel.tsx` - Old feature
11. `OKCBusinessMap.tsx` - Old map (use RealtorMap)
12. `feed/*` components - Legacy feed
13. `members/*` components - Legacy directory
14. `home/GetStartedButton.tsx` - Not needed

## ✅ Simplify Dashboard

### Remove Tabs - Just Show Everything
**Current:** 3 tabs (Impact Alerts, New Opportunities, Everything)
**Better:** Single view with smart filtering

**Why:**
- Tabs add complexity
- Realtors want to see everything at once
- Filters can handle categorization
- Simpler = better UX

### Dashboard Should Show:
- Map view (default)
- List view (toggle)
- Filters (type, impact, date, value)
- That's it - no tabs

## 📋 Cleanup Steps

### Phase 1: Fix Build Error ✅
- [x] Fix page.tsx syntax error

### Phase 2: Delete Unused Pages
- [ ] Delete `/about`
- [ ] Delete `/contact`
- [ ] Delete `/pricing`
- [ ] Delete `/signup`
- [ ] Delete `/dashboard`
- [ ] Delete `/okc/feed`
- [ ] Delete `/okc/members`
- [ ] Delete `/waitlist`
- [ ] Delete `/welcome`
- [ ] Delete `/privacy`
- [ ] Delete `/terms`
- [ ] Delete `/[city]/*` routes
- [ ] Delete `/buy` and `/sell`

### Phase 3: Delete Unused Components
- [ ] Delete old assessment components
- [ ] Delete old feed components
- [ ] Delete old member components
- [ ] Delete unused UI components

### Phase 4: Delete Unused API Routes
- [ ] Delete `/api/contact`
- [ ] Delete `/api/lead`
- [ ] Delete `/api/feed`
- [ ] Delete `/api/revalidate`
- [ ] Delete `/api/stripe/checkout` (use realtor version)
- [ ] Delete `/api/stripe/checkout-anonymous`
- [ ] Delete `/api/stripe/test`
- [ ] Clean up `/api/admin/*` routes

### Phase 5: Simplify Dashboard
- [ ] Remove tabs from dashboard
- [ ] Show everything in single view
- [ ] Improve filters
- [ ] Clean up UI

### Phase 6: Update Navigation
- [ ] Remove Header links to deleted pages
- [ ] Simplify Header (just logo + logout)
- [ ] Remove Footer (or minimal)

## 🎯 Final Structure (Clean)

```
src/app/
├── page.tsx                    # Redirect to login
├── login/
│   └── page.tsx                 # Login page
├── realtor/
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard (NO TABS)
│   └── lead/
│       └── [id]/
│           └── page.tsx        # Lead detail
├── auth/
│   └── callback/
│       └── route.ts            # Auth callback
└── api/
    ├── cron/
    │   └── scrape-okc/
    │       └── route.ts        # Daily scraper
    ├── realtor/
    │   ├── leads/
    │   ├── checkout/
    │   ├── geocode/
    │   └── subscription-status/
    └── stripe/
        └── webhook/
            └── route.ts        # Payment webhook
```

## 📊 Expert Rating After Cleanup

**Before:** 3/10
- Too many unused routes
- Confusing navigation
- Mixed legacy/new features
- Unnecessary complexity

**After:** 9/10
- Clean, focused product
- Simple navigation
- Only what's needed
- Professional UX
