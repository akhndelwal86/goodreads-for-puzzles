// Create Collections with Valid Types
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createSimpleCollections() {
  try {
    console.log('Creating collections with valid types...')

    // Use only valid types that are likely allowed (based on existing data)
    const simpleCollections = [
      {
        name: 'Van Gogh Masterpieces',
        description: 'Complete collection of Van Gogh puzzle reproductions featuring his most famous works',
        user_id: null,
        type: 'custom', // Using 'custom' since that's what we see in existing data
        slug: 'van-gogh-masterpieces'
      },
      {
        name: 'National Parks Collection',
        description: 'Stunning landscapes from Americas most beautiful national parks',
        user_id: null,
        type: 'custom',
        slug: 'national-parks-collection'
      },
      {
        name: 'Fantasy Realms',
        description: 'Epic fantasy artwork collection for adventure and magic lovers',
        user_id: null,
        type: 'custom',
        slug: 'fantasy-realms'
      },
      {
        name: 'Ravensburger Classics',
        description: 'Timeless puzzles from the world-renowned Ravensburger collection',
        user_id: null,
        type: 'custom',
        slug: 'ravensburger-classics'
      },
      {
        name: 'Wildlife Safari',
        description: 'Amazing wildlife photography showcasing animals from around the globe',
        user_id: null,
        type: 'custom',
        slug: 'wildlife-safari'
      }
    ]

    // Insert collections one by one to handle any errors gracefully
    for (const collection of simpleCollections) {
      const { data, error } = await supabase
        .from('lists')
        .insert(collection)
        .select()
      
      if (error) {
        if (error.code === '23505') { // Unique constraint
          console.log(`Collection '${collection.name}' already exists`)
        } else {
          console.log(`Error creating '${collection.name}':`, error.message)
        }
      } else {
        console.log(`✓ Created: ${collection.name}`)
      }
    }

    // Check final result
    const { data: allCollections, error: queryError } = await supabase
      .from('lists')
      .select('name, type, description')
      .order('created_at', { ascending: false })

    if (queryError) {
      console.log('Error querying collections:', queryError)
    } else {
      console.log('\nAll collections in database:')
      allCollections?.forEach((collection, index) => {
        console.log(`${index + 1}. ${collection.name} (${collection.type})`)
      })
      console.log(`\nTotal: ${allCollections?.length || 0} collections`)
    }

  } catch (error) {
    console.error('Failed to create collections:', error)
  }
}

createSimpleCollections()