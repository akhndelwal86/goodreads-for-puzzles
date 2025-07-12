-- Migration: Admin System Database Schema
-- Date: 2025-07-12
-- Description: Create tables and functions for admin dashboard system

-- Admin Sessions Table for authentication
CREATE TABLE admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    admin_username VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Admin Activity Log for audit trail
CREATE TABLE admin_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES admin_sessions(id) ON DELETE SET NULL,
    admin_username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'login', 'approve_puzzle', 'reject_puzzle', 'delete_user', etc.
    target_type VARCHAR(50), -- 'puzzle', 'user', 'feature_request', 'bug_report', etc.
    target_id UUID, -- ID of the affected entity
    details JSONB, -- Additional action details
    ip_address INET,
    user_agent TEXT,
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Puzzle Approval History for tracking approval decisions
CREATE TABLE puzzle_approval_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    puzzle_id UUID NOT NULL REFERENCES puzzles(id) ON DELETE CASCADE,
    admin_username VARCHAR(100) NOT NULL,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    rejection_reason TEXT,
    admin_notes TEXT,
    decision_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_username ON admin_sessions(admin_username);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_active ON admin_sessions(is_active) WHERE is_active = true;

CREATE INDEX idx_admin_activity_log_admin ON admin_activity_log(admin_username);
CREATE INDEX idx_admin_activity_log_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_log_target ON admin_activity_log(target_type, target_id);
CREATE INDEX idx_admin_activity_log_date ON admin_activity_log(performed_at DESC);

CREATE INDEX idx_puzzle_approval_history_puzzle ON puzzle_approval_history(puzzle_id);
CREATE INDEX idx_puzzle_approval_history_admin ON puzzle_approval_history(admin_username);
CREATE INDEX idx_puzzle_approval_history_status ON puzzle_approval_history(new_status);
CREATE INDEX idx_puzzle_approval_history_date ON puzzle_approval_history(decision_date DESC);

-- Function to clean up expired admin sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM admin_sessions 
    WHERE expires_at < NOW() OR is_active = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Function to get admin session info
CREATE OR REPLACE FUNCTION get_admin_session_info(token TEXT)
RETURNS TABLE (
    session_id UUID,
    admin_username VARCHAR(100),
    expires_at TIMESTAMPTZ,
    is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.admin_username,
        s.expires_at,
        (s.expires_at > NOW() AND s.is_active) as is_valid
    FROM admin_sessions s
    WHERE s.session_token = token;
END;
$$;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_session_id UUID,
    p_admin_username VARCHAR(100),
    p_action VARCHAR(100),
    p_target_type VARCHAR(50) DEFAULT NULL,
    p_target_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO admin_activity_log (
        session_id,
        admin_username,
        action,
        target_type,
        target_id,
        details,
        ip_address,
        user_agent
    ) VALUES (
        p_session_id,
        p_admin_username,
        p_action,
        p_target_type,
        p_target_id,
        p_details,
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$;

-- Function to update puzzle approval status with logging
CREATE OR REPLACE FUNCTION update_puzzle_approval_status(
    p_puzzle_id UUID,
    p_admin_username VARCHAR(100),
    p_new_status VARCHAR(20),
    p_rejection_reason TEXT DEFAULT NULL,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    current_status VARCHAR(20);
    update_successful BOOLEAN := false;
BEGIN
    -- Get current status
    SELECT approval_status INTO current_status
    FROM puzzles
    WHERE id = p_puzzle_id;
    
    IF current_status IS NULL THEN
        RAISE EXCEPTION 'Puzzle not found with ID: %', p_puzzle_id;
    END IF;
    
    -- Update puzzle status
    UPDATE puzzles 
    SET approval_status = p_new_status,
        updated_at = NOW()
    WHERE id = p_puzzle_id;
    
    -- Log the approval decision
    INSERT INTO puzzle_approval_history (
        puzzle_id,
        admin_username,
        previous_status,
        new_status,
        rejection_reason,
        admin_notes
    ) VALUES (
        p_puzzle_id,
        p_admin_username,
        current_status,
        p_new_status,
        p_rejection_reason,
        p_admin_notes
    );
    
    update_successful := true;
    RETURN update_successful;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to update puzzle approval status: %', SQLERRM;
END;
$$;

-- Create a view for pending puzzles with user information
CREATE OR REPLACE VIEW admin_pending_puzzles AS
SELECT 
    p.id,
    p.title,
    p.piece_count,
    p.theme,
    p.material,
    p.description,
    p.image_url,
    p.approval_status,
    p.created_at,
    p.updated_at,
    b.name as brand_name,
    u.email as uploader_email,
    u.username as uploader_username,
    COALESCE(u.username, 'Unknown') as uploader_first_name,
    '' as uploader_last_name,
    COALESCE(pa.review_count, 0) as review_count,
    COALESCE(pa.avg_rating, 0) as avg_rating
FROM puzzles p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN users u ON p.uploader_id = u.id
LEFT JOIN puzzle_aggregates pa ON p.id = pa.id
WHERE p.approval_status = 'pending'
ORDER BY p.created_at ASC;

-- Create a view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM puzzles WHERE approval_status = 'pending') as pending_puzzles,
    (SELECT COUNT(*) FROM puzzles WHERE approval_status = 'approved') as approved_puzzles,
    (SELECT COUNT(*) FROM puzzles WHERE approval_status = 'rejected') as rejected_puzzles,
    (SELECT COUNT(*) FROM feature_requests WHERE status = 'submitted') as new_feature_requests,
    (SELECT COUNT(*) FROM bug_reports WHERE status = 'submitted') as new_bug_reports,
    (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week,
    (SELECT COUNT(*) FROM puzzles WHERE created_at > NOW() - INTERVAL '7 days') as new_puzzles_week,
    (SELECT COUNT(*) FROM admin_activity_log WHERE performed_at > NOW() - INTERVAL '24 hours') as admin_actions_today;

-- Add automatic cleanup of old admin sessions (optional, can be run via cron)
-- This would typically be called by a scheduled job
COMMENT ON FUNCTION cleanup_expired_admin_sessions() IS 'Removes expired and inactive admin sessions. Should be run periodically.';

-- Add comments for documentation
COMMENT ON TABLE admin_sessions IS 'Admin authentication sessions with expiration and activity tracking';
COMMENT ON TABLE admin_activity_log IS 'Comprehensive audit log of all admin actions';
COMMENT ON TABLE puzzle_approval_history IS 'History of puzzle approval decisions and reasoning';

COMMENT ON COLUMN admin_sessions.session_token IS 'Secure session token for admin authentication';
COMMENT ON COLUMN admin_sessions.admin_username IS 'Admin username (not stored in users table)';
COMMENT ON COLUMN admin_sessions.expires_at IS 'Session expiration timestamp';
COMMENT ON COLUMN admin_sessions.last_accessed_at IS 'Last time this session was used';

COMMENT ON COLUMN admin_activity_log.action IS 'Type of admin action performed';
COMMENT ON COLUMN admin_activity_log.target_type IS 'Type of entity affected (puzzle, user, etc.)';
COMMENT ON COLUMN admin_activity_log.target_id IS 'ID of the affected entity';
COMMENT ON COLUMN admin_activity_log.details IS 'Additional JSON details about the action';

COMMENT ON COLUMN puzzle_approval_history.rejection_reason IS 'Reason for rejection if applicable';
COMMENT ON COLUMN puzzle_approval_history.admin_notes IS 'Additional notes from admin';

-- Add automatic updated_at trigger for admin sessions
CREATE OR REPLACE FUNCTION update_admin_session_accessed()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_accessed_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_session_accessed_trigger
    BEFORE UPDATE ON admin_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_admin_session_accessed();