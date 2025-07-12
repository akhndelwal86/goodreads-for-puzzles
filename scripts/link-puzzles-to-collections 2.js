// Link Puzzles to Collections
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function linkPuzzlesToCollections() {
  try {
    console.log('Linking puzzles to collections...')

    // Get available puzzles
    const { data: puzzles, error: puzzlesError } = await supabase
      .from('puzzles')
      .select('id, title, brand, piece_count')
      .eq('approval_status', 'approved')
      .limit(20)

    if (puzzlesError) {
      console.log('Error fetching puzzles:', puzzlesError)
      return
    }

    console.log('Available puzzles:', puzzles?.length || 0)

    // Get collections
    const { data: collections, error: collectionsError } = await supabase
      .from('lists')
      .select('id, name, slug')
      .eq('type', 'custom')
      .is('user_id', null)

    if (collectionsError) {
      console.log('Error fetching collections:', collectionsError)
      return
    }

    console.log('Available collections:', collections?.length || 0)

    if (!puzzles || !collections) {
      console.log('No puzzles or collections found')
      return
    }

    // Create mappings based on collection names
    const mappings = [
      {
        collection: 'van-gogh-masterpieces',
        puzzleKeywords: ['van gogh', 'art', 'painting', 'starry']
      },
      {
        collection: 'national-parks-collection',
        puzzleKeywords: ['national', 'park', 'landscape', 'mountain', 'nature']
      },
      {
        collection: 'fantasy-realms',
        puzzleKeywords: ['fantasy', 'dragon', 'castle', 'magic', 'wizard']
      },
      {
        collection: 'ravensburger-classics',
        puzzleKeywords: ['ravensburger']
      },
      {
        collection: 'wildlife-safari',
        puzzleKeywords: ['animal', 'wildlife', 'safari', 'tiger', 'lion', 'elephant']
      }
    ]

    // Link puzzles to collections
    for (const mapping of mappings) {
      const collection = collections.find(c => c.slug === mapping.collection)
      if (!collection) {
        console.log(`Collection not found: ${mapping.collection}`)
        continue
      }

      // Find matching puzzles
      const matchingPuzzles = puzzles.filter(puzzle => 
        mapping.puzzleKeywords.some(keyword => 
          puzzle.title.toLowerCase().includes(keyword) || 
          (puzzle.brand && puzzle.brand.toLowerCase().includes(keyword))
        )
      )

      if (matchingPuzzles.length === 0) {
        // If no specific matches, add some random puzzles
        const randomPuzzles = puzzles.slice(0, 3)
        console.log(`No specific matches for ${collection.name}, adding random puzzles:`, randomPuzzles.length)
        
        for (const puzzle of randomPuzzles) {
          const { data, error } = await supabase
            .from('list_items')
            .insert({
              list_id: collection.id,
              puzzle_id: puzzle.id,
              added_at: new Date().toISOString()
            })
          
          if (error && error.code !== '23505') { // Ignore unique constraint violations
            console.log(`Error linking ${puzzle.title} to ${collection.name}:`, error.message)
          } else {
            console.log(`✓ Linked: ${puzzle.title} → ${collection.name}`)
          }
        }
      } else {
        console.log(`Found ${matchingPuzzles.length} matching puzzles for ${collection.name}`)
        
        for (const puzzle of matchingPuzzles.slice(0, 5)) { // Max 5 per collection
          const { data, error } = await supabase
            .from('list_items')
            .insert({
              list_id: collection.id,
              puzzle_id: puzzle.id,
              added_at: new Date().toISOString()
            })
          
          if (error && error.code !== '23505') { // Ignore unique constraint violations
            console.log(`Error linking ${puzzle.title} to ${collection.name}:`, error.message)
          } else {
            console.log(`✓ Linked: ${puzzle.title} → ${collection.name}`)
          }
        }
      }
    }

    // Check final result
    const { data: linkedItems, error: linkedError } = await supabase
      .from('list_items')
      .select(`
        list_id,
        lists(name),
        puzzles(title)
      `)

    if (linkedError) {
      console.log('Error checking linked items:', linkedError)
    } else {
      console.log('\nLinked puzzles summary:')
      const collectionCounts = {}
      linkedItems?.forEach(item => {
        const collectionName = item.lists?.name || 'Unknown'
        collectionCounts[collectionName] = (collectionCounts[collectionName] || 0) + 1
      })
      
      Object.entries(collectionCounts).forEach(([collection, count]) => {
        console.log(`  ${collection}: ${count} puzzles`)
      })
    }

  } catch (error) {
    console.error('Failed to link puzzles:', error)
  }
}

linkPuzzlesToCollections()