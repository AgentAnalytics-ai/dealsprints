# 🔧 Codebase Reorganization Plan

## Current Problems (1/10 Rating)

### 1. **Documentation Chaos**
- 30+ markdown files in root directory
- Overlapping/conflicting documentation
- No clear entry point for understanding the system
- Multiple "README" style files with different purposes

### 2. **Unclear Product Identity**
- Started as business analysis platform
- Pivoted to OKC Pulse (news feed)
- Now has Realtor Dashboard
- Unclear what the main product is

### 3. **Code Organization Issues**
- Components scattered across root `components/` folder
- Unclear feature boundaries
- Mixed patterns (some old, some new)
- Hard to find related code

### 4. **API Route Confusion**
- 16 admin routes (many may be unused)
- Multiple Stripe endpoints
- Unclear which routes are active
- No API documentation

## Reorganization Strategy

### Phase 1: Documentation Consolidation ✅
1. Create `docs/` folder structure:
   ```
   docs/
   ├── README.md (main entry point)
   ├── architecture/
   │   ├── system-overview.md
   │   ├── data-flow.md
   │   └── api-reference.md
   ├── features/
   │   ├── realtor-dashboard.md
   │   ├── okc-feed.md
   │   └── admin-tools.md
   ├── setup/
   │   ├── getting-started.md
   │   ├── deployment.md
   │   └── environment-variables.md
   └── archive/
      └── (old docs moved here)
   ```

### Phase 2: Code Organization ✅
1. Reorganize components by feature:
   ```
   src/components/
   ├── shared/          (Header, Footer, Logo)
   ├── realtor/         (RealtorMap, LeadNotes, SubscriptionGate)
   ├── feed/            (FeedCard, FeedList, PaywallCard)
   ├── admin/           (PreviewModal)
   └── business/        (Assessment, BusinessIntelligenceReport)
   ```

2. Create feature modules:
   ```
   src/features/
   ├── realtor/
   │   ├── components/
   │   ├── hooks/
   │   ├── api/
   │   └── types.ts
   ├── feed/
   │   ├── components/
   │   ├── hooks/
   │   └── types.ts
   └── admin/
       ├── components/
       └── api/
   ```

### Phase 3: Clean Up ✅
1. Identify unused routes/components
2. Remove dead code
3. Consolidate duplicate utilities
4. Update imports

### Phase 4: Documentation ✅
1. Create clear README.md
2. Document API routes
3. Create architecture diagram
4. Add inline code comments

## Current Product State

### Main Product: **OKC Realtor Intelligence Dashboard**
- Subscription-based dashboard for OKC realtors
- Shows market intelligence (permits, licenses, developments)
- Interactive map with impact circles
- Lead management and notes

### Secondary Features:
- **OKC Feed**: Public feed of OKC developments (legacy)
- **Admin Tools**: Content moderation (legacy)
- **Business Analysis**: Unused/legacy features

## Next Steps

1. ✅ Create this plan
2. ⏳ Consolidate documentation
3. ⏳ Reorganize components
4. ⏳ Clean up unused code
5. ⏳ Create comprehensive README
6. ⏳ Document API routes
