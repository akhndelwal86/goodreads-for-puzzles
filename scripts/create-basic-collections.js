// Create Basic Collections with Existing Schema
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createBasicCollections() {
  try {
    console.log('Creating basic collections with existing schema...')

    // Use the existing lists table structure
    const basicCollections = [
      {
        name: 'Van Gogh Masterpieces',
        description: 'Complete collection of Van Gogh puzzle reproductions featuring his most famous works including Starry Night, Sunflowers, and Irises',
        user_id: null, // Official collections have no user
        type: 'official',
        slug: 'van-gogh-masterpieces'
      },
      {
        name: 'National Parks Collection',
        description: 'Stunning landscapes from Americas most beautiful national parks including Yellowstone, Grand Canyon, and Yosemite',
        user_id: null,
        type: 'official',
        slug: 'national-parks-collection'
      },
      {
        name: 'Fantasy Realms',
        description: 'Epic fantasy artwork collection for adventure and magic lovers featuring dragons, castles, and mystical creatures',
        user_id: null,
        type: 'official',
        slug: 'fantasy-realms'
      },
      {
        name: 'Ravensburger Classics',
        description: 'Timeless puzzles from the world-renowned Ravensburger collection featuring their most beloved designs',
        user_id: null,
        type: 'brand',
        slug: 'ravensburger-classics'
      },
      {
        name: 'Wildlife Safari',
        description: 'Amazing wildlife photography showcasing animals from around the globe in their natural habitats',
        user_id: null,
        type: 'official',
        slug: 'wildlife-safari'
      },
      {
        name: 'White Mountain Favorites',
        description: 'Popular puzzle designs from White Mountain featuring Americana and nostalgic themes',
        user_id: null,
        type: 'brand',
        slug: 'white-mountain-favorites'
      }
    ]

    // Insert the collections
    const { data: insertedCollections, error: insertError } = await supabase
      .from('lists')
      .insert(basicCollections)
      .select()

    if (insertError) {
      console.log('Error inserting collections:', insertError)
      
      // If there's a conflict, try updating instead
      if (insertError.code === '23505') { // Unique constraint violation
        console.log('Collections may already exist, trying individual inserts...')
        
        for (const collection of basicCollections) {
          const { data, error } = await supabase
            .from('lists')
            .upsert(collection, { onConflict: 'slug' })
            .select()
          
          if (error) {
            console.log(`Error with ${collection.name}:`, error.message)
          } else {
            console.log(`✓ ${collection.name} created/updated`)
          }
        }
      }
    } else {
      console.log('✓ Successfully inserted', insertedCollections?.length || 0, 'collections')
      insertedCollections?.forEach(collection => {
        console.log(`  - ${collection.name} (${collection.type})`)
      })
    }

    // Now let's check what we have
    const { data: allCollections, error: queryError } = await supabase
      .from('lists')
      .select('name, type, description')
      .order('created_at', { ascending: false })

    if (queryError) {
      console.log('Error querying collections:', queryError)
    } else {
      console.log('\nCurrent collections in database:')
      allCollections?.forEach((collection, index) => {
        console.log(`${index + 1}. ${collection.name} (${collection.type || 'custom'})`)
      })
    }

  } catch (error) {
    console.error('Failed to create collections:', error)
  }
}

createBasicCollections()