// Check Database Structure
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  try {
    console.log('Checking database structure...')

    // Try to query existing tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('exec_sql', { sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" })

    if (tablesError) {
      console.log('Tables query error:', tablesError)
      
      // Try a simpler approach - directly query a known table
      const { data: puzzles, error: puzzlesError } = await supabase
        .from('puzzles')
        .select('id')
        .limit(1)
      
      if (puzzlesError) {
        console.log('Puzzles query error:', puzzlesError)
      } else {
        console.log('✓ Puzzles table exists and accessible')
      }

      // Check if lists table exists
      const { data: lists, error: listsError } = await supabase
        .from('lists')
        .select('id')
        .limit(1)
      
      if (listsError) {
        console.log('Lists query error:', listsError.message)
        
        // Check if collections table exists
        const { data: collections, error: collectionsError } = await supabase
          .from('collections')
          .select('id')
          .limit(1)
        
        if (collectionsError) {
          console.log('Collections query error:', collectionsError.message)
        } else {
          console.log('✓ Collections table exists and accessible')
        }
      } else {
        console.log('✓ Lists table exists and accessible')
      }

    } else {
      console.log('Available tables:', tables)
    }

  } catch (error) {
    console.error('Check failed:', error)
  }
}

checkDatabase()