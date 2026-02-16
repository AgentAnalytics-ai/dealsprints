# System Overview

## Product: OKC Realtor Intelligence Dashboard

A subscription-based platform that provides OKC realtors with market intelligence and lead generation.

## Core Components

### 1. Data Collection (`/api/cron/scrape-okc`)
- **Trigger**: Vercel Cron (daily at 6am UTC)
- **Sources**: 
  - RSS feeds (City news, Chamber, Downtown OKC)
  - Public data (permits, licenses, property records)
- **Processing**: 
  - AI categorization and summarization
  - Impact analysis (public housing, schools, etc.)
  - Geocoding addresses
- **Storage**: Supabase `scraped_posts` table

### 2. Realtor Dashboard (`/realtor/dashboard`)
- **Access**: Requires auth + Stripe subscription
- **Features**:
  - Lead feed with filters
  - Interactive map with impact circles
  - Lead notes and status tracking
  - CSV export
  - Market intelligence visualization

### 3. Authentication & Authorization
- **Auth Provider**: Supabase Auth
- **Payment Provider**: Stripe
- **Middleware**: Protects `/realtor/*` routes
- **Subscription Check**: Validates active Stripe subscription

## Data Flow

```
Daily Cron Job
    ↓
Scrape RSS Feeds & Public Data
    ↓
AI Analysis & Categorization
    ↓
Save to Supabase (scraped_posts)
    ↓
Realtor Dashboard Queries Data
    ↓
Display Leads + Map
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Maps**: Google Maps API
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Vercel
