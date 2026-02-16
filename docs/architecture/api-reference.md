# API Reference

## Realtor API (`/api/realtor/*`)

### `GET /api/realtor/leads`
Get filtered leads for realtor dashboard.

**Query Parameters:**
- `type`: Filter by data type (permit, license, liquor, property, zoning)
- `minValue`: Minimum value filter
- `maxValue`: Maximum value filter
- `area`: Area filter
- `startDate`: Start date filter
- `endDate`: End date filter
- `impactType`: Impact type filter

**Response:**
```json
{
  "leads": [
    {
      "id": "string",
      "type": "permit",
      "title": "string",
      "address": "string",
      "value": 100000,
      "date": "2025-01-01",
      "summary": "string",
      "location": "string",
      "source": "string",
      "sourceUrl": "string",
      "tags": ["string"],
      "impact_type": "public_housing",
      "impact_radius": 0.5,
      "impact_value_change": "+5%",
      "development_status": "planned"
    }
  ],
  "total": 100
}
```

### `GET /api/realtor/leads/[id]`
Get single lead details.

**Response:** Single lead object (same structure as above)

### `POST /api/realtor/leads/[id]/notes`
Add or update notes on a lead.

**Body:**
```json
{
  "note": "string",
  "contact_status": "new" | "contacted" | "interested" | "closed"
}
```

### `GET /api/realtor/leads/export`
Export leads to CSV.

**Query Parameters:** Same as `/api/realtor/leads`

**Response:** CSV file download

### `GET /api/realtor/geocode`
Geocode an address to coordinates.

**Query Parameters:**
- `address`: Address string

**Response:**
```json
{
  "lat": 35.4676,
  "lng": -97.5164
}
```

### `GET /api/realtor/subscription-status`
Check current user's subscription status.

**Response:**
```json
{
  "hasAccess": true,
  "isActive": true,
  "subscriptionId": "sub_xxx",
  "customerId": "cus_xxx",
  "plan": "realtor",
  "status": "active",
  "currentPeriodEnd": "2025-02-01T00:00:00Z",
  "cancelAtPeriodEnd": false
}
```

### `POST /api/realtor/checkout`
Create Stripe checkout session.

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

## Cron API (`/api/cron/*`)

### `GET /api/cron/scrape-okc`
Daily scraper job (triggered by Vercel Cron).

**No parameters** - runs automatically at 6am UTC

**Process:**
1. Scrapes RSS feeds
2. Scrapes public data sources
3. AI analysis and categorization
4. Saves to `scraped_posts` table

## Stripe API (`/api/stripe/*`)

### `POST /api/stripe/webhook`
Stripe webhook handler for subscription events.

**Events Handled:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### `POST /api/stripe/checkout`
Create Stripe checkout session (general).

## Admin API (`/api/admin/*`)

**Note**: Many admin routes exist but may be unused. Main ones:

### `GET /api/admin/pending-posts`
Get posts pending review.

### `POST /api/admin/publish-post`
Publish a post.

### `POST /api/admin/reject-post`
Reject a post.

## Auth API (`/api/auth/*`)

### `GET /api/auth/callback`
Supabase auth callback handler.
