# Realtor Dashboard

## Overview

The main product - a subscription-based dashboard for OKC realtors to track market intelligence and generate leads.

## Access

- **URL**: `/realtor/dashboard`
- **Requirements**: 
  - Authenticated user (Supabase Auth)
  - Active Stripe subscription
- **Middleware**: Automatically redirects to login if not authenticated

## Features

### 1. Lead Feed
- Displays market opportunities from `scraped_posts` table
- Filters: Type, value range, area, date range, impact type
- Lead scoring: Hot/Warm/Future classification
- View toggle: Map or List view

### 2. Interactive Map
- Google Maps integration
- Color-coded markers by lead type
- Impact circles showing development impact radius
- Click markers for lead details

### 3. Lead Management
- **Notes**: Add notes to leads (`/api/realtor/leads/[id]/notes`)
- **Status**: Track contact status (new, contacted, interested, closed)
- **Export**: CSV export (`/api/realtor/leads/export`)

### 4. Market Intelligence
- Impact analysis: Public housing, schools, parks, commercial
- Value change estimates
- Development status tracking
- Impact radius visualization

## API Endpoints

- `GET /api/realtor/leads` - Get filtered leads
- `GET /api/realtor/leads/[id]` - Get single lead
- `POST /api/realtor/leads/[id]/notes` - Add/update notes
- `GET /api/realtor/leads/export` - Export to CSV
- `GET /api/realtor/geocode` - Geocode addresses
- `GET /api/realtor/subscription-status` - Check subscription
- `POST /api/realtor/checkout` - Create Stripe checkout

## Components

- `RealtorMap.tsx` - Google Maps component
- `LeadNotes.tsx` - Notes and status component
- `SubscriptionGate.tsx` - Subscription required UI
