#!/bin/bash

# Test Script for OKC Cron Scraper
# Usage: ./scripts/test-cron.sh

echo "🧪 Testing OKC Cron Scraper"
echo "=========================="
echo ""

# Get cron secret from environment or prompt
if [ -z "$CRON_SECRET" ]; then
  read -p "Enter CRON_SECRET: " CRON_SECRET
fi

# Get base URL (default to production)
BASE_URL="${BASE_URL:-https://dealsprints.com}"
ENDPOINT="$BASE_URL/api/cron/scrape-okc?secret=$CRON_SECRET"

echo "📍 Testing endpoint: $BASE_URL/api/cron/scrape-okc"
echo ""

# Make request
echo "⏳ Running cron job..."
RESPONSE=$(curl -s "$ENDPOINT")

# Check if response is valid JSON
if ! echo "$RESPONSE" | jq . > /dev/null 2>&1; then
  echo "❌ Error: Invalid JSON response"
  echo "$RESPONSE"
  exit 1
fi

# Parse response
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
SOURCES_RSS=$(echo "$RESPONSE" | jq -r '.sources.rss.total // .stats.sources // 0')
RSS_SCRAPED=$(echo "$RESPONSE" | jq -r '.stats.rssScraped // .stats.totalScraped // 0')
RSS_NEW=$(echo "$RESPONSE" | jq -r '.stats.rssNew // .stats.totalNew // 0')
RSS_DUPLICATES=$(echo "$RESPONSE" | jq -r '.stats.rssDuplicates // .stats.totalDuplicates // 0')
MESSAGE=$(echo "$RESPONSE" | jq -r '.message // "No message"')

echo "📊 Results:"
echo "  Success: $SUCCESS"
echo "  RSS Sources: $SOURCES_RSS"
echo "  Articles Scraped: $RSS_SCRAPED"
echo "  New Articles: $RSS_NEW"
echo "  Duplicates: $RSS_DUPLICATES"
echo "  Message: $MESSAGE"
echo ""

# Validation
echo "✅ Validation:"
if [ "$SUCCESS" = "true" ]; then
  echo "  ✓ Cron job succeeded"
else
  echo "  ❌ Cron job failed"
  exit 1
fi

if [ "$SOURCES_RSS" = "5" ]; then
  echo "  ✓ Correct number of sources (5 legal sources)"
else
  echo "  ⚠️  Warning: Expected 5 sources, got $SOURCES_RSS"
  echo "     This might indicate old code is still running"
fi

if [ "$RSS_SCRAPED" -gt 0 ]; then
  echo "  ✓ Articles were scraped"
else
  echo "  ⚠️  Warning: No articles scraped (sources might be empty)"
fi

echo ""
echo "📋 Full Response:"
echo "$RESPONSE" | jq .

