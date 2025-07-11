// Create collection_follows table for following/bookmarking collections
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createCollectionFollowsTable() {
  try {
    console.log('Creating collection_follows table...')

    // Create the table with SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS collection_follows (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
          followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          -- Ensure a user can only follow a collection once
          UNIQUE(user_id, list_id)
        );

        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_collection_follows_user_id ON collection_follows(user_id);
        CREATE INDEX IF NOT EXISTS idx_collection_follows_list_id ON collection_follows(list_id);
        CREATE INDEX IF NOT EXISTS idx_collection_follows_followed_at ON collection_follows(followed_at);

        -- Add RLS (Row Level Security) policies
        ALTER TABLE collection_follows ENABLE ROW LEVEL SECURITY;

        -- Users can only see their own follows
        CREATE POLICY "Users can view their own follows" ON collection_follows
          FOR SELECT USING (auth.uid()::text IN (
            SELECT clerk_id FROM users WHERE id = collection_follows.user_id
          ));

        -- Users can only insert their own follows
        CREATE POLICY "Users can follow collections" ON collection_follows
          FOR INSERT WITH CHECK (auth.uid()::text IN (
            SELECT clerk_id FROM users WHERE id = collection_follows.user_id
          ));

        -- Users can only delete their own follows
        CREATE POLICY "Users can unfollow collections" ON collection_follows
          FOR DELETE USING (auth.uid()::text IN (
            SELECT clerk_id FROM users WHERE id = collection_follows.user_id
          ));
      `
    })

    if (error) {
      // If exec_sql doesn't exist, try direct SQL execution
      console.log('exec_sql function not available, trying direct approach...')
      
      // Create table directly
      const { error: createError } = await supabase
        .from('collection_follows')
        .select('*')
        .limit(1)

      if (createError) {
        console.log('Table does not exist, creating manually...')
        // For now, just log the SQL that needs to be run
        console.log(`
Please run this SQL in your Supabase SQL editor:

CREATE TABLE IF NOT EXISTS collection_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, list_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_follows_user_id ON collection_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_follows_list_id ON collection_follows(list_id);
CREATE INDEX IF NOT EXISTS idx_collection_follows_followed_at ON collection_follows(followed_at);

ALTER TABLE collection_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own follows" ON collection_follows
  FOR SELECT USING (auth.uid()::text IN (
    SELECT clerk_id FROM users WHERE id = collection_follows.user_id
  ));

CREATE POLICY "Users can follow collections" ON collection_follows
  FOR INSERT WITH CHECK (auth.uid()::text IN (
    SELECT clerk_id FROM users WHERE id = collection_follows.user_id
  ));

CREATE POLICY "Users can unfollow collections" ON collection_follows
  FOR DELETE USING (auth.uid()::text IN (
    SELECT clerk_id FROM users WHERE id = collection_follows.user_id
  ));
        `)
      } else {
        console.log('✓ collection_follows table already exists')
      }
    } else {
      console.log('✓ collection_follows table created successfully')
    }

  } catch (error) {
    console.error('Failed to create collection_follows table:', error)
  }
}

createCollectionFollowsTable()