-- Market Intelligence Fields
-- Add impact classification fields to scraped_posts table

ALTER TABLE scraped_posts 
ADD COLUMN IF NOT EXISTS impact_type TEXT CHECK (impact_type IN ('positive', 'negative', 'mixed')) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS impact_radius NUMERIC DEFAULT NULL,
ADD COLUMN IF NOT EXISTS impact_value_change NUMERIC DEFAULT NULL,
ADD COLUMN IF NOT EXISTS development_status TEXT CHECK (development_status IN ('planned', 'approved', 'in_progress', 'completed')) DEFAULT NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scraped_posts_impact_type ON scraped_posts(impact_type) WHERE impact_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_scraped_posts_development_status ON scraped_posts(development_status) WHERE development_status IS NOT NULL;

-- Comments for documentation
COMMENT ON COLUMN scraped_posts.impact_type IS 'Property value impact: positive (schools, parks), negative (public housing), mixed (commercial)';
COMMENT ON COLUMN scraped_posts.impact_radius IS 'Impact radius in miles (typically 0.5-2 miles)';
COMMENT ON COLUMN scraped_posts.impact_value_change IS 'Estimated % change in property values within impact radius';
COMMENT ON COLUMN scraped_posts.development_status IS 'Development status: planned, approved, in_progress, completed';
