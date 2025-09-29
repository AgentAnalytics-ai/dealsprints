# DealSprints

A modern, conversion-focused deal funnel platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Lightning Fast**: Edge-rendered on Vercel
- 📱 **Mobile First**: Responsive design with perfect Core Web Vitals
- 🎨 **VC-Grade UI**: Modern design system with premium feel
- 📧 **Email Integration**: Resend-powered lead capture
- 🏢 **Local SEO**: Dynamic city pages for local search
- ⚡ **Zero Database**: No infrastructure required
- 🎯 **Conversion Optimized**: Built for paid traffic and organic growth
- 🗺️ **Interactive Maps**: Google Maps integration for business discovery

## Quick Start

1. **Clone and install**:
   ```bash
   git clone <your-repo>
   cd dealsprints
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Add your API keys (see Environment Variables section)
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**:
   ```bash
   npx vercel
   ```

## Environment Variables

- `RESEND_API_KEY`: Your Resend API key for email sending
- `ADMIN_EMAIL`: Email address to receive leads
- `NEXT_PUBLIC_SITE_URL`: Your production URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key for interactive maps
- `GOOGLE_PLACES_API_KEY`: Google Places API key for business data

### Google Maps Setup

To enable the interactive business map:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
4. Create credentials (API Key)
5. Add the API key to your `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

## Project Structure

- `src/app/` - Next.js 14 app router pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and API integrations
- `public/` - Static assets

## Tab Functionality

The platform includes four main tabs:

1. **Free Business Ranking** - AI-powered business valuation and PDF reports
2. **Business Map** - Interactive map of OKC businesses (requires Google Maps API)
3. **Recently Sold** - Real transaction data from recent business sales
4. **Market Insights** - AI-powered market trends and analytics

## Development

- Built with Next.js 14 and TypeScript
- Styled with Tailwind CSS
- Uses React Google Maps API for interactive maps
- Email integration via Resend
- Edge runtime for optimal performance



