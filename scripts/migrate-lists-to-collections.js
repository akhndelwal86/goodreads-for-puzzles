// Migrate Lists to Collections
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateLists() {
  try {
    console.log('Starting lists to collections migration...')

    // Step 1: Check current lists structure
    const { data: existingLists, error: listsError } = await supabase
      .from('lists')
      .select('*')
      .limit(5)
    
    if (listsError) {
      console.log('Error querying lists:', listsError)
      return
    }

    console.log('Current lists structure (sample):', existingLists?.[0] || 'No lists found')

    // Step 2: Since we can't run DDL commands directly, let's work with the existing lists table
    // and create our collections by inserting/updating data with default values for new fields

    // First, let's create some official collections as new entries in the lists table
    const officialCollections = [
      {
        name: 'Van Gogh Masterpieces',
        description: 'Complete collection of Van Gogh puzzle reproductions featuring his most famous works including Starry Night, Sunflowers, and Irises. Curated selection of the greatest Van Gogh artworks in puzzle form with premium quality reproductions.',
        user_id: null, // Official collections have no user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'National Parks Collection',
        description: 'Stunning landscapes from Americas most beautiful national parks including Yellowstone, Grand Canyon, and Yosemite. Breathtaking photography from iconic American national parks.',
        user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Fantasy Realms',
        description: 'Epic fantasy artwork collection for adventure and magic lovers featuring dragons, castles, and mystical creatures. Immerse yourself in magical worlds and epic adventures.',
        user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Ravensburger Classics',
        description: 'Timeless puzzles from the world-renowned Ravensburger collection featuring their most beloved designs. Premium quality puzzles from the masters of puzzling.',
        user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Wildlife Safari',
        description: 'Amazing wildlife photography showcasing animals from around the globe in their natural habitats. Professional wildlife photography from National Geographic contributors.',
        user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'White Mountain Favorites',
        description: 'Popular puzzle designs from White Mountain featuring Americana and nostalgic themes. Classic American scenes and nostalgic imagery.',
        user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    // Insert the collections into the lists table
    const { data: insertedCollections, error: insertError } = await supabase
      .from('lists')
      .upsert(officialCollections, { onConflict: 'name' })
      .select()

    if (insertError) {
      console.log('Error inserting collections:', insertError)
    } else {
      console.log('✓ Inserted', insertedCollections?.length || 0, 'official collections')
    }

    // Step 3: Create themes table manually (since we can't run DDL)
    // We'll create this as a simple approach using API calls
    console.log('✓ Basic collections created in lists table')
    console.log('Note: Full schema migration with additional columns needs to be done manually in Supabase dashboard')
    console.log('Run the enhance_collections_schema.sql script in the Supabase SQL editor to complete the migration')

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrateLists()