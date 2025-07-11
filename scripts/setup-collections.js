// Setup Collections Data Script
// This script sets up the collections table and sample data using the Supabase client

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupCollections() {
  try {
    console.log('Setting up collections...')

    // First, check if collections table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['lists', 'collections'])

    console.log('Existing tables:', tables)

    // Step 1: Rename lists to collections if needed
    if (tables?.some(t => t.table_name === 'lists')) {
      console.log('Renaming lists table to collections...')
      // This needs to be done via raw SQL since it's a DDL operation
      const { error: renameError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE lists RENAME TO collections;
          ALTER TABLE list_items RENAME TO collection_items;
          ALTER TABLE collection_items RENAME COLUMN list_id TO collection_id;
        `
      })
      if (renameError) {
        console.log('Note: Table rename may have already been done or exec_sql not available')
      }
    }

    // Step 2: Create themes table and insert themes
    console.log('Creating collection themes...')
    
    const themes = [
      { name: 'art', display_name: 'Art & Paintings', description: 'Classic and modern artwork reproductions', icon_name: 'Palette', color_class: 'text-purple-600', sort_order: 1 },
      { name: 'nature', display_name: 'Nature & Landscapes', description: 'Beautiful natural scenes and landscapes', icon_name: 'Mountain', color_class: 'text-green-600', sort_order: 2 },
      { name: 'animals', display_name: 'Animals & Wildlife', description: 'Cute and wild animals from around the world', icon_name: 'Cat', color_class: 'text-orange-600', sort_order: 3 },
      { name: 'architecture', display_name: 'Architecture & Buildings', description: 'Stunning buildings and architectural wonders', icon_name: 'Building2', color_class: 'text-blue-600', sort_order: 4 },
      { name: 'fantasy', display_name: 'Fantasy & Sci-Fi', description: 'Magical and futuristic themed puzzles', icon_name: 'Sparkles', color_class: 'text-violet-600', sort_order: 5 },
      { name: 'vintage', display_name: 'Vintage & Retro', description: 'Classic puzzles from bygone eras', icon_name: 'Clock', color_class: 'text-amber-600', sort_order: 6 },
      { name: 'travel', display_name: 'Travel & Places', description: 'Famous destinations and travel spots', icon_name: 'MapPin', color_class: 'text-red-600', sort_order: 7 },
      { name: 'food', display_name: 'Food & Cuisine', description: 'Delicious food and culinary themes', icon_name: 'Coffee', color_class: 'text-yellow-600', sort_order: 8 },
      { name: 'seasonal', display_name: 'Seasonal & Holidays', description: 'Holiday and seasonal themed puzzles', icon_name: 'Snowflake', color_class: 'text-cyan-600', sort_order: 9 },
      { name: 'abstract', display_name: 'Abstract & Patterns', description: 'Geometric patterns and abstract designs', icon_name: 'Shapes', color_class: 'text-pink-600', sort_order: 10 }
    ]

    // Try to create themes table and insert data
    try {
      const { error: themesError } = await supabase
        .from('collection_themes')
        .upsert(themes, { onConflict: 'name' })
      
      if (themesError) {
        console.log('Themes insert error (may be normal if table doesn\'t exist yet):', themesError.message)
      } else {
        console.log('✓ Collection themes created')
      }
    } catch (err) {
      console.log('Themes table may not exist yet, will create with collections')
    }

    // Step 3: Insert sample collections
    console.log('Creating sample collections...')
    
    const sampleCollections = [
      {
        collection_type: 'official',
        name: 'Van Gogh Masterpieces',
        description: 'Complete collection of Van Gogh puzzle reproductions featuring his most famous works including Starry Night, Sunflowers, and Irises',
        theme: 'art',
        visibility: 'public',
        is_featured: true,
        creator_notes: 'Curated selection of the greatest Van Gogh artworks in puzzle form with premium quality reproductions',
        published_at: new Date().toISOString(),
        featured_at: new Date().toISOString(),
        followers_count: 127,
        likes_count: 89,
        total_pieces: 6000,
        completion_rate: 75.5
      },
      {
        collection_type: 'official',
        name: 'National Parks Collection',
        description: 'Stunning landscapes from Americas most beautiful national parks including Yellowstone, Grand Canyon, and Yosemite',
        theme: 'nature',
        visibility: 'public',
        is_featured: true,
        creator_notes: 'Breathtaking photography from iconic American national parks',
        published_at: new Date().toISOString(),
        featured_at: new Date().toISOString(),
        followers_count: 203,
        likes_count: 156,
        total_pieces: 8500,
        completion_rate: 82.3
      },
      {
        collection_type: 'official',
        name: 'Fantasy Realms',
        description: 'Epic fantasy artwork collection for adventure and magic lovers featuring dragons, castles, and mystical creatures',
        theme: 'fantasy',
        visibility: 'public',
        is_featured: true,
        creator_notes: 'Immerse yourself in magical worlds and epic adventures',
        published_at: new Date().toISOString(),
        featured_at: new Date().toISOString(),
        followers_count: 98,
        likes_count: 72,
        total_pieces: 4500,
        completion_rate: 68.9
      },
      {
        collection_type: 'brand',
        name: 'Ravensburger Classics',
        description: 'Timeless puzzles from the world-renowned Ravensburger collection featuring their most beloved designs',
        theme: 'vintage',
        visibility: 'public',
        is_featured: true,
        creator_notes: 'Premium quality puzzles from the masters of puzzling',
        published_at: new Date().toISOString(),
        featured_at: new Date().toISOString(),
        followers_count: 145,
        likes_count: 98,
        total_pieces: 7200,
        completion_rate: 91.2
      },
      {
        collection_type: 'official',
        name: 'Wildlife Safari',
        description: 'Amazing wildlife photography showcasing animals from around the globe in their natural habitats',
        theme: 'animals',
        visibility: 'public',
        is_featured: false,
        creator_notes: 'Professional wildlife photography from National Geographic contributors',
        published_at: new Date().toISOString(),
        followers_count: 67,
        likes_count: 45,
        total_pieces: 3600,
        completion_rate: 54.7
      },
      {
        collection_type: 'brand',
        name: 'White Mountain Favorites',
        description: 'Popular puzzle designs from White Mountain featuring Americana and nostalgic themes',
        theme: 'vintage',
        visibility: 'public',
        is_featured: false,
        creator_notes: 'Classic American scenes and nostalgic imagery',
        published_at: new Date().toISOString(),
        followers_count: 78,
        likes_count: 52,
        total_pieces: 4800,
        completion_rate: 63.4
      }
    ]

    try {
      const { data: collections, error: collectionsError } = await supabase
        .from('collections')
        .upsert(sampleCollections, { onConflict: 'name' })
        .select()
      
      if (collectionsError) {
        console.log('Collections insert error:', collectionsError.message)
        
        // Try alternative approach - check if we need to add columns first
        if (collectionsError.message.includes('column') && collectionsError.message.includes('does not exist')) {
          console.log('Collections table exists but missing columns. Manual intervention needed.')
          console.log('Please run the enhance_collections_schema.sql migration manually in Supabase dashboard.')
        }
      } else {
        console.log('✓ Sample collections created:', collections?.length || 0)
      }
    } catch (err) {
      console.log('Collections insertion error:', err.message)
    }

    console.log('Collections setup complete!')

  } catch (error) {
    console.error('Setup failed:', error)
  }
}

// Run the setup
setupCollections()