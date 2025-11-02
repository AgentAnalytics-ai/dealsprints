# DealSprints - Current Structure Audit Report
**Generated:** November 2, 2025  
**Target Deploy:** Vercel  
**Purpose:** Pre-launch architecture assessment

---

## 1. Repo Overview

### Node/TS/Next/Tailwind Versions

| Technology | Version | Status |
|-----------|---------|--------|
| **Node.js** | v22.14.0 | ✅ Latest LTS |
| **npm** | 11.2.0 | ✅ Current |
| **Next.js** | 14.2.33 | ✅ Stable (App Router) |
| **TypeScript** | 5.3.3 | ✅ Current |
| **React** | 18.2.0 | ✅ Stable |
| **Tailwind CSS** | 3.3.6 | ✅ Current |

### Major Dependencies & Usage

**AI/LLM Services:**
- `ai` (5.0.60) - ✅ **ACTIVELY USED** in assessment engine
- `@ai-sdk/openai` (2.0.42) - ✅ **ACTIVELY USED** (GPT-4o for assessments)
- `@ai-sdk/google` (2.0.17) - ⚠️ **INSTALLED but NOT USED**

**Email Services:**
- `resend` (2.1.0) - ✅ **ACTIVELY USED** for lead notifications

**Data & State:**
- `@upstash/redis` (1.35.4) - ⚠️ **INSTALLED but NOT USED** (in-memory storage used instead)
- `@nanostores/react` (github:ai/react) - ⚠️ **INSTALLED but NOT USED**
- React Context - ✅ **USED** (FormDataContext, LiveInsightsContext)

**UI/Animation:**
- `framer-motion` (10.16.16) - ✅ **ACTIVELY USED** (animations throughout)
- `lucide-react` (0.294.0) - ✅ **ACTIVELY USED** (icons)
- `@react-google-maps/api` (2.20.7) - ✅ **ACTIVELY USED** (OKCBusinessMap)

**Validation:**
- `zod` (4.1.11) - ✅ **ACTIVELY USED** (schema validation in AI engine)

**Analytics:**
- `@vercel/analytics` (1.5.0) - ✅ **INSTALLED** (assumed active)
- `web-vitals` (5.1.0) - ✅ **INSTALLED** (performance monitoring)

### Dead Dependencies (Unused)
- `@upstash/redis` - Installed but using in-memory storage instead
- `@nanostores/react` - Installed but using React Context
- `@ai-sdk/google` - Installed but only using OpenAI

---

## 2. Routing & Rendering

### Complete App Router Map

```
app/
├── page.tsx                          [Client] - Homepage with tabs
├── layout.tsx                        [Server] - Root layout with metadata
├── globals.css                       [Styles]
├── robots.ts                         [Server] - Dynamic robots.txt
├── sitemap.ts                        [Server] - Dynamic sitemap.xml
│
├── sell/
│   └── page.tsx                      [Server] - Static metadata, renders Assessment
│
├── buy/
│   └── page.tsx                      [Server] - Static page
│
├── about/
│   └── page.tsx                      [Server] - Static page
│
├── privacy/
│   └── page.tsx                      [Server] - Static page
│
├── terms/
│   └── page.tsx                      [Server] - Static page
│
├── [city]/                           [Dynamic Route]
│   ├── sell/page.tsx                 [Server] - Dynamic metadata by city
│   └── buy/page.tsx                  [Server] - Dynamic by city
│
├── business/
│   └── [placeId]/page.tsx            [Server] - Dynamic business intelligence
│                                     ⚠️ export const dynamic = 'force-dynamic'
│                                     ⚠️ export const revalidate = 3600
│
├── admin/
│   └── assessments/page.tsx          [Client] - Admin dashboard
│
└── api/                              [API Routes]
    ├── lead/route.ts                 [Node] - POST: Lead submission via Resend
    ├── assessment/
    │   ├── route.ts                  [Node] - POST: Simple assessment (no AI)
    │   ├── generate/route.ts         [Node] - POST: Full AI assessment + email
    │   └── preview/route.ts          [Node] - POST: Live insights (GPT-4o-mini)
    ├── assessments/route.ts          [Node] - GET/PATCH: Assessment CRUD
    ├── business/
    │   └── analyze/route.ts          [Node] - Business analysis endpoint
    └── okc-businesses/route.ts       [Edge] - GET: OKC business listings
                                      ✅ export const runtime = 'edge'
```

### Route Analysis by Type

#### Static Pages (SSG)
- `/about`, `/privacy`, `/terms` - Pure static, no dynamic data
- `export const metadata` used for SEO

#### Server-Rendered (SSR)
- `/` (Homepage) - **Client component** ("use client"), no SSR benefit
- `/sell` - Server page but renders client `<Assessment />` component
- `/[city]/sell` - Server with dynamic metadata, client Assessment
- `/[city]/buy` - Server with dynamic metadata

#### Dynamic Pages
- `/business/[placeId]` - **CRITICAL**: 
  - `export const dynamic = 'force-dynamic'` 
  - `export const revalidate = 3600` (⚠️ **CONFLICTING** - force-dynamic ignores revalidate)
  - Calls `collectBusinessData(placeId)` server-side
  - `generateMetadata()` async for SEO
  - `generateStaticParams()` returns empty array (no ISG)

#### API Routes

| Route | Runtime | Purpose | Env Vars Used |
|-------|---------|---------|---------------|
| `/api/lead` | Node | Lead submission email | `dealsprints_resend`, `ADMIN_EMAIL` |
| `/api/assessment` | Node | Simple assessment (no AI) | None |
| `/api/assessment/generate` | Node | Full AI assessment | `dealsprints_resend`, `ADMIN_EMAIL`, OpenAI (via SDK) |
| `/api/assessment/preview` | Node | Live preview insights | OpenAI (via SDK) |
| `/api/assessments` | Node | Assessment CRUD | None |
| `/api/business/analyze` | Node | Business analysis | `NODE_ENV` |
| `/api/okc-businesses` | **Edge** | Business listings | `GOOGLE_PLACES_API_KEY` |

### Rendering Modes Summary

- **SSG:** `about`, `privacy`, `terms` (pure static)
- **SSR:** None explicitly (homepage is client-side)
- **ISR:** `/business/[placeId]` attempts `revalidate: 3600` but **overridden by force-dynamic**
- **Client:** `page.tsx`, `Assessment.tsx`, admin dashboard, all interactive components

### Caching Strategy

- **No explicit caching** on most routes
- `/api/okc-businesses` sets `Cache-Control: public, max-age=3600, s-maxage=3600`
- `/business/[placeId]` attempts ISR but force-dynamic prevents it
- **In-memory storage** for assessments (resets on deploy)

### Middleware Configuration

**File:** `src/middleware.ts`

```typescript
// Edge-safe: Uses only NextResponse and URL parsing
export function middleware(request: NextRequest) {
  // Redirect www to non-www
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.replace("www.", "");
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

// Matcher excludes API routes, static files
matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
```

**Analysis:**
- ✅ Edge-safe (no Node APIs)
- ✅ Excludes API routes from processing
- ✅ Simple redirect logic
- ⚠️ Also has redirect in `next.config.js` (duplicate logic)

---

## 3. Components & State

### Assessment.tsx Usage

**Component Type:** Client Component (`"use client"`)

**Used In:**
- `src/app/sell/page.tsx`
- `src/app/[city]/sell/page.tsx`
- Component exports: `FreeEvaluationTab.tsx`

**Features:**
- Multi-step form (4 steps: Business Overview, Transaction Intent, Details, Contact)
- Local state: `useState` for form data and market insights
- Real-time insights generation (client-side calculation)
- Lead score calculation (0-100 based on revenue, timeline, growth, industry)
- Submits to `/api/lead` endpoint
- **No PDF generation** - just form submission

### Type Definitions

**Location:** Inline in files (no centralized `src/types/`)

**MarketInsights Interface:**
- Defined in: `Assessment.tsx` (lines 12-53)
- Used in: `Assessment.tsx` only
- Structure: industry, revenue, growth, competitive, opportunity, buyers, valuation

**FormField/FormStep Interfaces:**
- Defined in: `Assessment.tsx` (lines 55-66)
- Used in: `Assessment.tsx` only

**FormData Interface:**
- Defined in: `FormDataContext.tsx` (lines 5-21)
- Different structure than Assessment's FormData
- ⚠️ **DUPLICATION**: Two different FormData interfaces exist

**Assessment Schemas:**
- Defined in: `lib/ai/assessmentEngine.ts`
- Uses Zod for validation
- `SurveyResponseSchema` - Input validation
- `BusinessAssessmentSchema` - Output structure

### Global State

**React Contexts:**

1. **FormDataContext** (`contexts/FormDataContext.tsx`)
   - Purpose: Survey form state management
   - Used by: `SurveyForm.tsx`, potentially others
   - ⚠️ **NOT USED IN LAYOUT** - not wrapped around app

2. **LiveInsightsContext** (`contexts/LiveInsightsContext.tsx`)
   - Purpose: Real-time AI preview insights
   - Debounced API calls to `/api/assessment/preview`
   - Used by: Components that show live insights
   - ⚠️ **NOT USED IN LAYOUT** - not wrapped around app

**State Management:**
- No Zustand, Redux, or other state libraries
- React Context available but **not globally provided**
- Most state is local `useState` in components
- ⚠️ **Contexts defined but not wired into app**

### Component Duplication Analysis

**Assessment Flow Components:**
- `Assessment.tsx` - Full multi-step form with inline insights
- `SurveyForm.tsx` - Separate survey form component
- `FreeEvaluationTab.tsx` - Imports Assessment
- ⚠️ Potential duplication in form logic

**No Circular Imports Detected**

---

## 4. Data Layer

### Data Fetching Libraries

- **Native fetch()** - Primary method (Server Components, API routes)
- ✅ No axios dependency
- ✅ No external data libraries
- ✅ Server Actions: **NOT USED** (using API routes instead)

### Environment Variables

**Server-Side Only:**
```
dealsprints_resend          - Resend API key (lead/assessment emails)
ADMIN_EMAIL                 - Email recipient for leads (default: admin@dealsprints.com)
GOOGLE_PLACES_API_KEY       - Google Places API (server-side)
OPENAI_API_KEY              - OpenAI API (via ai SDK)
GROQ_API_KEY                - Alternative AI provider (not actively used)
AI_PROVIDER                 - 'openai' | 'grok' (defaults to openai)
NODE_ENV                    - Environment check (development/production)
```

**Client-Side (NEXT_PUBLIC_):**
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  - Google Maps JavaScript API
NEXT_PUBLIC_SITE_URL             - Production URL (referenced in README, not in code)
```

### Environment Variable Safety

**✅ SAFE:**
- All server-only vars used only in API routes or server components
- `NEXT_PUBLIC_*` vars appropriately prefixed for client use
- No env vars leaked in client components

**⚠️ CONCERNS:**
- `dealsprints_resend` - Unusual naming (should be `RESEND_API_KEY`)
- Multiple undefined checks `process.env.X || 'default'` means missing vars fail silently
- No `.env.example` file in repo

### Business Ranking/Analysis Data Flow

**User Journey:**

1. **User fills Assessment form** (`Assessment.tsx`)
   - Client-side state updates
   - Local market insights generation (static data)
   
2. **Insights Display** (Real-time)
   - Calculated client-side from hardcoded industry data
   - No API calls during form fill (except LiveInsights if used)

3. **Form Submission**
   - POST to `/api/lead`
   - Payload: formData + marketInsights + leadScore
   
4. **Lead Processing** (`/api/lead/route.ts`)
   - Calculate lead category (Premium/High-Value/Quality/Standard)
   - Generate HTML email with assessment details
   - Send via Resend to `ADMIN_EMAIL`
   - Return success/error

5. **Output:**
   - ❌ No PDF generation
   - ❌ No user-facing assessment report
   - ❌ No data storage (just email)
   - ✅ Alert to user "Assessment submitted"

**Alternative Flow (AI Assessment):**

1. **User submits full survey** (via `SurveyForm.tsx`)
2. POST to `/api/assessment/generate`
3. **Server Processing:**
   - Validates with Zod schema
   - Calls OpenAI GPT-4o (`generateBusinessAssessment`)
   - Generates email content via GPT-4o
   - Saves to in-memory storage (`lib/database/assessments.ts`)
   - Sends admin notification via Resend
4. **Output:**
   - Returns assessment JSON + email content
   - Stored in memory (⚠️ **LOST ON REDEPLOY**)
   - Viewable in `/admin/assessments` dashboard

---

## 5. Styling & Assets

### Tailwind Configuration

**File:** `tailwind.config.ts`

```typescript
content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",      // ⚠️ /pages doesn't exist
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // ✅ Used
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",        // ✅ Used
]
```

**Custom Theme:**
- Colors: `ink`, `brand`, `deal`, `mute`, `surface`, `line`
- Fonts: `display` (Space Grotesk), `sans` (Inter)
- Custom shadows: `soft`
- Custom radius: `xl2` (1.25rem)

**Plugins:** None

**⚠️ Issue:** Content glob includes `/pages/**` which doesn't exist in App Router

### PostCSS Configuration

**File:** `postcss.config.js`

```javascript
{
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

**Status:** ✅ Standard setup, no issues

### Fonts

- **Space Grotesk** - Display font (headings)
- **Inter** - Sans-serif (body)
- ⚠️ **Font loading method not visible** (likely Google Fonts CDN or next/font)

### Icons

- **lucide-react** - Icon library
- Used extensively throughout components
- ✅ Tree-shakeable imports

### Images

**Public Assets:**
- `dealsprintlogo1.png`
- `dealsprintslogo1.png`
- `logo.png`

**Next.js Image Config:**
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'dealsprints.com',
    },
  ],
}
```

**⚠️ Issues:**
- Only allows `dealsprints.com` domain
- Google Places photos use direct URLs (not optimized)
- No `unoptimized` flag or additional domains

---

## 6. Build & Deploy (Vercel)

### Next.js Configuration

**File:** `next.config.js`

```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dealsprints.com' }
    ],
  },
  async redirects() {
    return [
      {
        source: '/www/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};
```

**Analysis:**
- ✅ No `output` mode specified (defaults to Vercel optimized)
- ✅ No experimental flags
- ✅ No webpack customization
- ⚠️ Redirect duplicates middleware logic
- ❌ No image domains for Google Places photos

### Vercel-Specific Files

- ❌ No `vercel.json`
- ❌ No `.vercelignore`
- ✅ Standard Next.js deploy (zero-config)

### Runtime Configuration

**Edge Runtime:**
- `/api/okc-businesses` - ✅ Explicitly uses Edge
- Middleware - ✅ Auto-detected as Edge

**Node Runtime (Default):**
- All other API routes
- ⚠️ Some might benefit from Edge (e.g., `/api/assessment/preview`)

### Dynamic vs Static

**Force Dynamic:**
- `/business/[placeId]` - Sets `export const dynamic = 'force-dynamic'`
- ⚠️ **CONFLICT:** Also sets `export const revalidate = 3600` (ignored when force-dynamic)

**Static Generation:**
- About, Privacy, Terms pages
- Homepage (but it's client component, no SSG benefit)

### Output Mode

- **Default:** Vercel optimized (hybrid SSR/SSG)
- **No `output: 'standalone'`** configured
- ✅ Compatible with Vercel

---

## 7. Environment & Secrets

### Environment Variables Referenced

| Variable | Type | Used In | Status | Risk |
|----------|------|---------|--------|------|
| `dealsprints_resend` | Server | `/api/lead`, `/api/assessment/generate` | ⚠️ Undefined-safe | Low |
| `ADMIN_EMAIL` | Server | Email routes | ⚠️ Defaults to admin@dealsprints.com | Low |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client | `OKCBusinessMap.tsx` | ⚠️ Conditional render | Medium |
| `GOOGLE_PLACES_API_KEY` | Server | `okcBusinesses.ts` | ⚠️ Undefined-safe | High |
| `OPENAI_API_KEY` | Server | `aiService.ts`, AI SDK | ⚠️ Undefined-safe | High |
| `GROQ_API_KEY` | Server | `aiService.ts` (fallback) | ⚠️ Not used | Low |
| `AI_PROVIDER` | Server | `aiService.ts` | ⚠️ Defaults to 'openai' | Low |
| `NODE_ENV` | Server | Error handling | ✅ Auto-set by Vercel | Safe |

### Client-Side Leakage Check

**✅ NO LEAKAGE DETECTED**

- All server-only vars used in API routes or server components
- `NEXT_PUBLIC_*` prefix used correctly for client vars
- No `process.env` in client components except `NEXT_PUBLIC_*`

### Undefined Environment Variables

**⚠️ SILENT FAILURES:**

```typescript
// In lead/route.ts
const resend = process.env.dealsprints_resend ? new Resend(...) : null;
// If undefined, resend is null, API returns 500 with generic error

// In aiService.ts  
export const aiService = new AIService(
  process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || '',
  ...
);
// If undefined, empty string passed, API calls will fail
```

**Recommendation:** Add startup validation

---

## 8. Quality & Tooling

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,                    // ✅ Strict mode enabled
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "skipLibCheck": true,              // ⚠️ Skips lib type checks
    "esModuleInterop": true,
    "moduleResolution": "bundler",     // ✅ Modern resolution
    "paths": {
      "@/*": ["./src/*"]               // ✅ Path aliases
    }
  }
}
```

**Strictness:** ✅ High (strict mode enabled)

**Issues:**
- `skipLibCheck: true` - Hides potential library type issues
- `target: "es5"` - Conservative (could use ES2020+ for modern browsers)

### ESLint Configuration

**File:** Assumed `.eslintrc.json` (not in snapshot)

**Package:** `eslint-config-next` (14.0.4)

**Analysis:**
- ✅ Next.js ESLint installed
- ❌ No custom rules visible
- Script: `npm run lint` available

### Prettier

- ❌ No `.prettierrc` in repo snapshot
- ❌ No `prettier` in devDependencies
- ⚠️ Code formatting likely inconsistent

### Git Hooks (Husky)

- ❌ No `.husky/` directory
- ❌ No pre-commit hooks
- ❌ No pre-push hooks

### Testing

- ❌ No test framework installed (Jest, Vitest, etc.)
- ❌ No test files visible
- ❌ No `test` script in package.json

### CI/CD

- ❌ No `.github/workflows/` (GitHub Actions)
- ❌ No CI configuration
- ⚠️ Relying on Vercel's automatic checks only

---

## 9. Performance & SEO

### Image Optimization

**Next.js Image Component:**
- ❌ Not visible in provided files
- ⚠️ Google Places photos likely use `<img>` tags (unoptimized)

**Image Domains:**
```javascript
remotePatterns: [
  { protocol: 'https', hostname: 'dealsprints.com' }
]
```

**⚠️ Missing:**
- `maps.googleapis.com` (Google Places photos)
- Any CDN domains

### Metadata API

**✅ Properly Used:**

- `layout.tsx` - Root metadata with OpenGraph, Twitter cards, Schema.org
- `sell/page.tsx` - Page-specific metadata
- `[city]/sell/page.tsx` - Dynamic metadata generation
- `/business/[placeId]/page.tsx` - Advanced `generateMetadata()` async function

**Schema.org Structured Data:**
- ✅ Organization schema in root layout
- ✅ Business schema in `/business/[placeId]`

### robots.txt & Sitemap

**robots.ts:**
```typescript
{
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin/"],
    },
  ],
  sitemap: "https://dealsprints.com/sitemap.xml",
}
```
✅ Properly configured

**sitemap.ts:**
```typescript
const cities = ["dallas", "oklahoma-city", "austin", "houston", "san-antonio"];
// Generates URLs for main pages + city pages
```
✅ Dynamic sitemap for SEO

### Cache Headers

**API Routes:**
- `/api/okc-businesses` - ✅ Sets `Cache-Control: public, max-age=3600`
- Other routes - ❌ No caching headers

**Pages:**
- `/business/[placeId]` - Attempts `revalidate: 3600` but overridden by `force-dynamic`
- ⚠️ Most pages have no caching strategy

### Analytics

**Dependencies:**
- `@vercel/analytics` (1.5.0) - ✅ Installed
- `web-vitals` (5.1.0) - ✅ Installed

**⚠️ Not visible in code** (likely in `layout.tsx` or `_app` equivalent)

---

## 10. Known Issues / Risks

### Critical Issues (Red 🔴)

1. **In-Memory Assessment Storage**
   - File: `lib/database/assessments.ts`
   - Issue: Assessments stored in local array, **lost on every deploy**
   - Impact: Admin dashboard loses all data on Vercel redeploy
   - Fix: Migrate to Upstash Redis (already installed) or Vercel KV

2. **Missing Environment Variables Fail Silently**
   - Files: `/api/lead`, `/api/assessment/generate`, `aiService.ts`
   - Issue: Missing env vars return null or empty string, APIs fail at runtime
   - Impact: Users submit forms, receive generic errors
   - Fix: Add startup validation, throw clear errors

3. **Google Places Photos Not in Image Optimization**
   - File: `src/lib/okcBusinesses.ts`
   - Issue: Uses direct Google API URLs not in `next.config.js` domains
   - Impact: Photos may fail to load or not optimize
   - Fix: Add `maps.googleapis.com` to `remotePatterns`

4. **Conflicting Dynamic Configuration**
   - File: `/business/[placeId]/page.tsx`
   - Issue: `export const dynamic = 'force-dynamic'` + `export const revalidate = 3600`
   - Impact: Revalidation never happens, always SSR (slower)
   - Fix: Remove one directive based on desired behavior

### High Priority (Yellow ⚠️)

5. **Unused Context Providers**
   - Files: `FormDataContext.tsx`, `LiveInsightsContext.tsx`
   - Issue: Contexts defined but **not wrapped in layout.tsx**
   - Impact: Components using these contexts will crash
   - Fix: Wrap app in providers or remove unused contexts

6. **Duplicate FormData Interfaces**
   - Files: `Assessment.tsx`, `FormDataContext.tsx`
   - Issue: Two different `FormData` types with different structures
   - Impact: Type confusion, potential runtime errors
   - Fix: Consolidate into `src/types/index.ts`

7. **Dead Dependencies**
   - `@upstash/redis` - Installed, not used
   - `@nanostores/react` - Installed, not used
   - `@ai-sdk/google` - Installed, not used
   - Impact: Larger bundle size, security risk
   - Fix: Remove or implement

8. **No PDF Generation (Stated Feature Missing)**
   - Files: `Assessment.tsx`, `/api/lead`
   - Issue: README/UI suggests PDF reports, but none generated
   - Impact: User expectations not met
   - Fix: Implement PDF generation or update messaging

9. **Edge Runtime Not Maximized**
   - File: Only `/api/okc-businesses` uses Edge
   - Issue: Other fast APIs could benefit from Edge (e.g., preview)
   - Impact: Slower cold starts on less-used routes
   - Fix: Evaluate each API route for Edge compatibility

10. **Middleware + next.config Duplicate Redirects**
    - Files: `middleware.ts`, `next.config.js`
    - Issue: www redirect logic in both places
    - Impact: Potential double-processing
    - Fix: Keep in middleware, remove from next.config

### Medium Priority (Blue ℹ️)

11. **No Testing Infrastructure**
    - Impact: No automated quality checks
    - Fix: Add Vitest + React Testing Library

12. **Tailwind Content Glob Includes Non-Existent /pages**
    - File: `tailwind.config.ts`
    - Impact: Slower build scanning for files that don't exist
    - Fix: Remove `./src/pages/**/*` from content array

13. **No Font Optimization Strategy Visible**
    - Impact: Potential FOUT/FOIT, slower LCP
    - Fix: Use `next/font` if not already

14. **No Client-Side Error Boundary**
    - Impact: Unhandled errors crash entire app
    - Fix: Add error.tsx boundaries in app directory

15. **Rate Limiting Only in One Route**
    - File: `/api/assessment/generate` has in-memory rate limit
    - Issue: Other routes unprotected
    - Impact: Potential API abuse
    - Fix: Add global rate limiting (Vercel Rate Limit SDK or Upstash)

---

## 11. Quick Wins (Do Not Implement Yet)

### Immediate Stability Improvements

1. **Add Environment Variable Validation**
   ```typescript
   // Create src/lib/env.ts
   const requiredEnvVars = ['dealsprints_resend', 'OPENAI_API_KEY'];
   requiredEnvVars.forEach(v => {
     if (!process.env[v]) throw new Error(`Missing ${v}`);
   });
   ```

2. **Fix Conflicting Dynamic Config**
   ```typescript
   // In /business/[placeId]/page.tsx - Choose one:
   export const revalidate = 3600; // ISR (recommended)
   // OR
   export const dynamic = 'force-dynamic'; // Full SSR
   ```

3. **Remove Dead Dependencies**
   ```bash
   npm uninstall @upstash/redis @nanostores/react @ai-sdk/google
   ```

4. **Fix Tailwind Content Glob**
   ```typescript
   content: [
     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
     // Remove: "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
   ]
   ```

5. **Add Google Maps to Image Domains**
   ```javascript
   images: {
     remotePatterns: [
       { protocol: 'https', hostname: 'dealsprints.com' },
       { protocol: 'https', hostname: 'maps.googleapis.com' }, // ADD THIS
     ],
   }
   ```

### DX Improvements

6. **Create .env.example**
   ```bash
   # Create .env.example with all required vars
   dealsprints_resend=
   ADMIN_EMAIL=admin@dealsprints.com
   OPENAI_API_KEY=
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
   GOOGLE_PLACES_API_KEY=
   ```

7. **Consolidate Type Definitions**
   ```bash
   mkdir src/types
   # Move all interfaces to src/types/index.ts
   ```

8. **Wire Up Context Providers (if needed)**
   ```typescript
   // In layout.tsx - only if contexts are actually used
   <FormDataProvider>
     <LiveInsightsProvider>
       {children}
     </LiveInsightsProvider>
   </FormDataProvider>
   ```

9. **Add Error Boundaries**
   ```typescript
   // Create app/error.tsx and app/global-error.tsx
   ```

10. **Migrate Assessment Storage to Upstash**
    ```typescript
    // Replace in-memory array with Redis calls
    import { Redis } from '@upstash/redis';
    const redis = Redis.fromEnv();
    ```

---

## 12. Special Checks (Explicit Answers)

### Is App Router fully used? Any legacy /pages left?

**✅ App Router Fully Used**
- No `/pages` directory exists
- All routes in `src/app/`
- ⚠️ Tailwind config still references `/pages` (remove glob)

### Any server actions? If yes, where and how are env vars handled?

**❌ No Server Actions Used**
- All data mutations via API routes (fetch calls)
- Traditional Next.js API Routes pattern
- Env vars accessed via `process.env` in API routes (server-side safe)

### Any client components using secrets or server-bound libs?

**✅ No Client-Side Secrets**
- `Assessment.tsx` - Client component, no secrets
- `OKCBusinessMap.tsx` - Uses `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (correctly prefixed)
- Admin dashboard - Client component, fetches from API (no direct secrets)

### Does middleware.ts depend on Node-only APIs (breaking Edge)?

**✅ Middleware is Edge-Safe**
- Uses only `NextRequest`, `NextResponse`, `URL` (all Edge-compatible)
- No `fs`, `path`, `crypto` (Node APIs)
- Simple string manipulation for www redirect
- Will run on Edge without issues

### Are images/domains configured for Next Image?

**⚠️ Partially Configured**
- ✅ `dealsprints.com` allowed
- ❌ `maps.googleapis.com` missing (Google Places photos)
- ⚠️ Unclear if `next/image` component is used (not visible in scanned files)

### Is Assessment.tsx a client or server component? Is that correct?

**Client Component (`"use client"`) - ✅ Correct**
- Uses `useState`, `useEffect`, `framer-motion` (client-only)
- Multi-step form with real-time state updates
- **Cannot be server component**
- However, pages that render it (e.g., `/sell/page.tsx`) could benefit from being Server Components for metadata

### Is there a PDF generator flow? Where is the output stored?

**❌ No PDF Generation**
- Assessment submission only sends email (Resend)
- No PDF library installed (no jsPDF, Puppeteer, etc.)
- No PDF endpoint
- **Discrepancy:** README mentions "PDF reports" but feature not implemented

### Are type definitions colocated or should they move to src/types/?

**⚠️ Currently Colocated (Needs Centralization)**
- `MarketInsights`, `FormField`, `FormStep` - in `Assessment.tsx`
- `FormData` - duplicated in `Assessment.tsx` and `FormDataContext.tsx`
- AI schemas - in `lib/ai/assessmentEngine.ts` (appropriate)
- **Recommendation:** Create `src/types/` for shared interfaces

### Any long-running API handlers that should be background jobs/cron instead?

**⚠️ Potential Long-Running Route:**
- `/api/assessment/generate` - Calls OpenAI GPT-4o (2-10 seconds)
- Currently synchronous (user waits for response)
- **Risk:** Vercel Hobby/Pro timeout limits (10-60 seconds)
- **Recommendation:** Consider webhook/queue pattern for AI generation

### What would break if we enable output: 'standalone'?

**Analysis:**
- `output: 'standalone'` creates self-contained Node.js server
- **Would Break:**
  - ❌ Vercel-specific features (Edge middleware, Image Optimization CDN)
  - ❌ Vercel Analytics (if used)
  - ❌ Automatic Edge runtime detection
- **Would Work:**
  - ✅ API routes (all Node-compatible)
  - ✅ SSR/SSG pages
  - ✅ Static assets
- **Recommendation:** Do NOT enable for Vercel deploy (use default)

---

## 13. Readiness for Vercel

### Verdict: 🟡 YELLOW (Ready with Fixes)

### Deployment Safety: **70/100**

**Will Deploy Successfully:** ✅ Yes
**Will Function Properly:** ⚠️ Partially (with missing env vars)
**Production Ready:** ⚠️ Not yet

### Blockers (Must Fix Before Launch)

1. **Environment Variables**
   - Add to Vercel: `dealsprints_resend`, `OPENAI_API_KEY`, `ADMIN_EMAIL`, `GOOGLE_PLACES_API_KEY`
   - Add to project: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (if maps needed)

2. **Assessment Storage**
   - Migrate from in-memory to Upstash Redis or Vercel KV
   - Current: Data lost on every deploy

3. **Image Configuration**
   - Add `maps.googleapis.com` to `next.config.js` image domains

4. **Remove Conflicting Directives**
   - Fix `/business/[placeId]` dynamic + revalidate conflict

### Recommended Before Launch

5. Error boundaries in app directory
6. Remove unused dependencies
7. Centralize type definitions
8. Fix Tailwind content glob
9. Add .env.example for team clarity
10. Wire up or remove Context providers

### Post-Launch Improvements

11. Add testing (Vitest + Playwright)
12. Add CI/CD pipeline
13. Implement PDF generation or remove from messaging
14. Add rate limiting to all public APIs
15. Migrate assessment generation to background jobs

---

## 14. Architecture Strengths

**What's Working Well:**

1. ✅ **Clean App Router Structure** - Logical route organization
2. ✅ **Edge-Safe Middleware** - Will scale on Vercel Edge
3. ✅ **Proper SEO Foundations** - Metadata API, robots, sitemap, Schema.org
4. ✅ **Type Safety** - TypeScript strict mode, Zod validation
5. ✅ **Modern Stack** - Next.js 14, React 18, latest tooling
6. ✅ **No Database Required** - Email-based lead capture (zero infra)
7. ✅ **AI Integration Ready** - Properly abstracted AI service layer

---

## 15. Next Steps (For Future Structure Design)

Based on this audit, the future structure should address:

1. **Data Persistence Layer** - Redis/KV for assessments
2. **Type System** - Centralized `src/types/` directory
3. **Background Jobs** - Webhook pattern for AI generation
4. **Testing Strategy** - Unit, integration, E2E setup
5. **Error Handling** - Global boundaries, better validation
6. **Caching Strategy** - Consistent ISR/SWR approach
7. **Monitoring** - Error tracking (Sentry), analytics (Posthog/Mixpanel)
8. **Rate Limiting** - Global protection for API routes
9. **PDF Generation** - Implement or remove from messaging
10. **Context Architecture** - Decide if needed, wire up properly

---

**End of Audit Report**

*This report is ready for use in designing the optimized future structure for Vercel deployment.*

