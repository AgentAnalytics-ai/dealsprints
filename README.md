# DealSprints - OKC Realtor Intelligence Platform

> **Current State**: Subscription-based market intelligence dashboard for OKC realtors

## 🎯 What This Is

**DealSprints** is a **paid subscription platform** that provides OKC realtors with:
- **Market Intelligence**: Real-time tracking of permits, licenses, developments
- **Impact Analysis**: Visual impact circles showing how developments affect property values
- **Lead Generation**: Automated lead scoring (Hot/Warm/Future)
- **Interactive Maps**: Google Maps integration with geocoded addresses

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Data Collection                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Vercel Cron (Daily 6am)                         │   │
│  │  → Scrapes RSS feeds (City News, Chamber, etc.) │   │
│  │  → Scrapes public data (permits, licenses)      │   │
│  │  → AI analysis & categorization                  │   │
│  │  → Saves to Supabase `scraped_posts` table      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Realtor Dashboard (Paid)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  /realtor/dashboard                              │   │
│  │  → Requires: Auth + Stripe Subscription         │   │
│  │  → Shows: Leads, Map, Filters, Stats           │   │
│  │  → Features: Notes, Export, Impact Circles      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── app/
│   ├── realtor/              # Realtor dashboard (main product)
│   │   ├── dashboard/        # Main dashboard page
│   │   └── lead/[id]/        # Individual lead detail
│   ├── api/
│   │   ├── cron/scrape-okc/  # Daily scraper (Vercel Cron)
│   │   └── realtor/          # Realtor API endpoints
│   └── okc/feed/             # Public feed (legacy)
│
├── components/
│   ├── realtor/              # Realtor-specific components
│   ├── feed/                 # Feed components (legacy)
│   └── shared/               # Shared UI components
│
└── lib/
    ├── subscription.ts       # Stripe subscription checks
    ├── supabase.ts           # Database client
    └── errorHandler.ts        # Error utilities
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLIC_KEY=your_stripe_public
STRIPE_PRICE_ID=your_price_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# OpenAI (for AI analysis)
OPENAI_API_KEY=your_openai_key

# Resend (for emails)
RESEND_API_KEY=your_resend_key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Deploy
```bash
npm run deploy:quick
```

## 🔑 Key Features

### Realtor Dashboard (`/realtor/dashboard`)
- **Authentication**: Supabase Auth
- **Subscription Gating**: Stripe subscription required
- **Lead Feed**: Filterable list of market opportunities
- **Interactive Map**: Google Maps with impact circles
- **Lead Management**: Notes, status tracking, CSV export
- **Market Intelligence**: Impact analysis (public housing, schools, etc.)

### Data Scraper (`/api/cron/scrape-okc`)
- **Runs Daily**: Vercel Cron at 6am UTC
- **Sources**: City news, chamber, permits, licenses
- **AI Processing**: Categorization and impact analysis
- **Storage**: Supabase `scraped_posts` table

## 📊 Database Schema

### `scraped_posts` (Main Table)
```sql
- id, source_url, source_name
- scraped_title, scraped_date
- ai_summary, ai_category, ai_location, ai_tags
- data_type, data_value, data_address
- impact_type, impact_radius, impact_value_change
- status, published_at, created_at
```

### `members` (User Accounts)
```sql
- user_id (Supabase Auth)
- stripe_customer_id, stripe_subscription_id
- plan, is_verified, is_active
```

### `lead_notes` (Realtor Notes)
```sql
- id, lead_id, user_id
- note, contact_status, created_at
```

## 🔐 Authentication & Authorization

- **Auth**: Supabase Auth (email/password)
- **Middleware**: Protects `/realtor/*` routes
- **Subscription Check**: Stripe subscription required
- **Session**: Cookie-based sessions

## 📚 Documentation

- **Setup**: See `docs/setup/getting-started.md`
- **API**: See `docs/architecture/api-reference.md`
- **Features**: See `docs/features/realtor-dashboard.md`

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Maps**: Google Maps API
- **AI**: OpenAI (GPT-4o-mini)
- **Deployment**: Vercel
- **Email**: Resend

## 📝 Legacy Features

These exist but are not the main product:
- **OKC Feed** (`/okc/feed`): Public feed of developments
- **Admin Tools** (`/admin/*`): Content moderation
- **Business Analysis**: Unused legacy features

## 🐛 Known Issues

- TypeScript type issues with Stripe (using `as any` workarounds)
- Supabase client options in middleware (using type assertions)
- Many markdown docs in root (being consolidated)

## 📞 Support

For issues or questions, see the documentation in `docs/` folder.
