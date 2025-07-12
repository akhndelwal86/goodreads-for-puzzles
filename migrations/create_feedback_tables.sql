-- Migration: Create Feature Requests and Bug Reports Tables
-- Date: 2025-01-12
-- Description: Add tables to store user feedback - feature requests and bug reports

-- Feature Requests Table
CREATE TABLE feature_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'puzzle-tracking', 'social-features', 'discovery', 'collections', 
        'mobile-app', 'notifications', 'other'
    )),
    description TEXT NOT NULL,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    alternative_solutions TEXT,
    user_type VARCHAR(100),
    priority VARCHAR(20) NOT NULL CHECK (priority IN (
        'nice-to-have', 'helpful', 'important', 'critical'
    )),
    additional_context TEXT,
    user_email VARCHAR(255),
    willing_to_test BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN (
        'submitted', 'reviewing', 'planned', 'in-development', 'completed', 'rejected'
    )),
    admin_notes TEXT,
    votes_count INTEGER DEFAULT 0,
    implementation_effort VARCHAR(20) CHECK (implementation_effort IN (
        'small', 'medium', 'large', 'extra-large'
    )),
    target_version VARCHAR(20),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Bug Reports Table  
CREATE TABLE bug_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    steps_to_reproduce TEXT NOT NULL,
    expected_behavior TEXT NOT NULL,
    actual_behavior TEXT NOT NULL,
    device VARCHAR(20) NOT NULL CHECK (device IN ('desktop', 'mobile', 'tablet')),
    browser VARCHAR(100) NOT NULL,
    operating_system VARCHAR(100) NOT NULL,
    puzzlr_page VARCHAR(200) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    user_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN (
        'submitted', 'confirmed', 'in-progress', 'fixed', 'duplicate', 'cannot-reproduce', 'wont-fix'
    )),
    admin_notes TEXT,
    resolution_notes TEXT,
    duplicate_of UUID REFERENCES bug_reports(id),
    priority_score INTEGER DEFAULT 0, -- Calculated based on severity + frequency
    assigned_to VARCHAR(100), -- Could be team member name
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_feature_requests_status ON feature_requests(status);
CREATE INDEX idx_feature_requests_category ON feature_requests(category);
CREATE INDEX idx_feature_requests_priority ON feature_requests(priority);
CREATE INDEX idx_feature_requests_submitted_at ON feature_requests(submitted_at DESC);
CREATE INDEX idx_feature_requests_votes ON feature_requests(votes_count DESC);

CREATE INDEX idx_bug_reports_status ON bug_reports(status);
CREATE INDEX idx_bug_reports_severity ON bug_reports(severity);
CREATE INDEX idx_bug_reports_device ON bug_reports(device);
CREATE INDEX idx_bug_reports_submitted_at ON bug_reports(submitted_at DESC);
CREATE INDEX idx_bug_reports_priority_score ON bug_reports(priority_score DESC);

-- Feature Request Votes Table (for future voting system)
CREATE TABLE feature_request_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feature_request_id UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
    user_email VARCHAR(255), -- For guest voting
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- For authenticated users
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(feature_request_id, user_email, user_id) -- Prevent duplicate votes
);

CREATE INDEX idx_feature_votes_request ON feature_request_votes(feature_request_id);
CREATE INDEX idx_feature_votes_user ON feature_request_votes(user_id) WHERE user_id IS NOT NULL;

-- Create a view for feature requests with vote counts
CREATE OR REPLACE VIEW feature_requests_with_stats AS
SELECT 
    fr.*,
    COALESCE(COUNT(frv.id), 0) as actual_votes_count
FROM feature_requests fr
LEFT JOIN feature_request_votes frv ON fr.id = frv.feature_request_id
GROUP BY fr.id;

-- Create a view for bug report statistics
CREATE OR REPLACE VIEW bug_reports_stats AS
SELECT 
    severity,
    status,
    COUNT(*) as count,
    AVG(priority_score) as avg_priority_score
FROM bug_reports 
GROUP BY severity, status;

-- Add comments for documentation
COMMENT ON TABLE feature_requests IS 'User-submitted feature requests and enhancement suggestions';
COMMENT ON TABLE bug_reports IS 'User-reported bugs and issues with the platform';
COMMENT ON TABLE feature_request_votes IS 'User votes on feature requests for prioritization';

COMMENT ON COLUMN feature_requests.category IS 'Category of feature: puzzle-tracking, social-features, discovery, etc.';
COMMENT ON COLUMN feature_requests.priority IS 'User-specified importance: nice-to-have, helpful, important, critical';
COMMENT ON COLUMN feature_requests.status IS 'Current status in development pipeline';
COMMENT ON COLUMN feature_requests.implementation_effort IS 'Estimated development effort (set by admin)';

COMMENT ON COLUMN bug_reports.severity IS 'Impact level: low, medium, high, critical';
COMMENT ON COLUMN bug_reports.frequency IS 'How often the bug occurs';
COMMENT ON COLUMN bug_reports.priority_score IS 'Calculated priority based on severity and frequency';
COMMENT ON COLUMN bug_reports.duplicate_of IS 'Reference to original bug report if this is a duplicate';

-- Add automatic updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feature_requests_updated_at 
    BEFORE UPDATE ON feature_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bug_reports_updated_at 
    BEFORE UPDATE ON bug_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();