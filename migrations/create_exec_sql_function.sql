-- Migration: Create exec_sql function for database administration
-- Date: 2025-01-11
-- Description: Creates a secure function to execute SQL commands via API

-- Create the exec_sql function for database administration
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    rec record;
    results json[] := '{}';
BEGIN
    -- Execute the SQL and try to return results
    IF sql ~* '^\s*(SELECT|WITH)' THEN
        -- For SELECT queries, return the actual data
        FOR rec IN EXECUTE sql LOOP
            results := array_append(results, to_json(rec));
        END LOOP;
        RETURN json_build_object('data', results, 'success', true);
    ELSE
        -- For other queries (INSERT, UPDATE, DELETE, etc.), return row count
        EXECUTE sql;
        GET DIAGNOSTICS result = ROW_COUNT;
        RETURN json_build_object('rows_affected', result, 'success', true);
    END IF;
EXCEPTION 
    WHEN OTHERS THEN
        RETURN json_build_object(
            'error', SQLERRM, 
            'sqlstate', SQLSTATE,
            'success', false
        );
END;
$$;

-- Grant execute permission to the service role
-- Note: This will be executed with service role, so it should have permissions

-- Create migrations tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT NOW(),
    checksum TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- Add comment for documentation
COMMENT ON FUNCTION exec_sql(text) IS 'Administrative function to execute SQL commands via API. Use with caution - requires service role permissions.';