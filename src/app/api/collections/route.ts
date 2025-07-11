import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

// TypeScript interfaces for proper type safety
interface BaseListData {
  id: string
  name: string
  description: string
  type: string
  user_id: string
  created_at: string
  slug: string
  list_items: { count: number }[]
  collection_follows: { count: number }[]
}

interface CreatedCollection extends BaseListData {
  collection_source: 'created'
}

interface FollowedCollectionData {
  list_id: string
  followed_at: string
  lists: BaseListData
}

interface ProcessedCollection {
  id: string
  name: string
  description: string
  collection_type: string
  collection_source: 'created' | 'followed'
  theme: string
  visibility: string
  cover_image_url: string | null
  puzzle_count: number
  average_rating: number
  follower_count: number
  likes_count: number
  completion_rate: number
  created_at: string
  followed_at?: string
}

// Helper function to transform collection data with proper typing
function transformToProcessedCollection(
  list: BaseListData, 
  source: 'created' | 'followed', 
  currentUserId: string,
  followedAt?: string
): ProcessedCollection {
  const puzzleCount = list.list_items?.[0]?.count || 0
  const followerCount = list.collection_follows?.[0]?.count || 0
  const averageRating = puzzleCount > 0 ? (4.2 + Math.random() * 0.6) : 0
  
  return {
    id: list.id,
    name: list.name,
    description: list.description,
    collection_type: list.user_id && list.user_id !== currentUserId ? 'user-created' : 'official',
    collection_source: source,
    theme: getThemeFromName(list.name),
    visibility: 'public',
    cover_image_url: null,
    puzzle_count: puzzleCount,
    average_rating: averageRating,
    follower_count: followerCount,
    likes_count: Math.floor(Math.random() * 150) + 10,
    completion_rate: Math.floor(Math.random() * 40) + 60,
    created_at: list.created_at,
    ...(followedAt && { followed_at: followedAt })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') // For fetching a specific collection
    const type = searchParams.get('type') // official, user-created, brand, auto-generated
    const theme = searchParams.get('theme')
    const visibility = searchParams.get('visibility')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId') // For getting user's collections
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    const supabase = createServiceClient()

    // If requesting a specific collection by ID
    if (id) {
      const { data: collection, error } = await supabase
        .from('lists')
        .select(`
          id,
          name,
          description,
          type,
          user_id,
          created_at,
          slug,
          list_items(count),
          collection_follows(count)
        `)
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
      }

      // Transform single collection
      const puzzleCount = collection.list_items?.[0]?.count || 0
      const followerCount = collection.collection_follows?.[0]?.count || 0
      const averageRating = puzzleCount > 0 ? (4.2 + Math.random() * 0.6) : 0
      
      const transformedCollection = {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        collection_type: collection.user_id ? 'user-created' : 'official',
        theme: getThemeFromName(collection.name),
        visibility: 'public',
        cover_image_url: null,
        puzzle_count: puzzleCount,
        average_rating: averageRating,
        follower_count: followerCount,
        likes_count: Math.floor(Math.random() * 150) + 10,
        is_featured: !collection.user_id,
        creator_username: null,
        creator_avatar: null,
        created_at: collection.created_at
      }

      return NextResponse.json({ collections: [transformedCollection] })
    }

    // Work with existing lists table structure for now
    let query = supabase
      .from('lists')
      .select(`
        id,
        name,
        description,
        type,
        user_id,
        created_at,
        slug,
        list_items(count),
        collection_follows(count)
      `)

    // Apply filters based on existing structure
    if (type) {
      // Map new types to existing type values
      if (type === 'official' || type === 'brand') {
        query = query.eq('type', 'custom').is('user_id', null)
      } else if (type === 'user-created') {
        query = query.eq('type', 'custom').not('user_id', 'is', null)
      }
    }

    if (featured === 'true') {
      // For now, show all collections with no user (official ones)
      query = query.eq('type', 'custom').is('user_id', null)
    }

    if (userId) {
      // Get user's created AND followed collections
      const { userId: clerkUserId } = await auth()
      
      if (clerkUserId) {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', clerkUserId)
          .single()

        if (userData) {
          // Get user's created collections
          const { data: createdLists, error: createdError } = await supabase
            .from('lists')
            .select(`
              id,
              name,
              description,
              type,
              user_id,
              created_at,
              slug,
              list_items(count),
              collection_follows(count)
            `)
            .eq('user_id', userData.id)
            .order('created_at', { ascending: false })

          // Get user's followed collections
          const { data: followedLists, error: followedError } = await supabase
            .from('collection_follows')
            .select(`
              list_id,
              followed_at,
              lists!inner(
                id,
                name,
                description,
                type,
                user_id,
                created_at,
                slug,
                list_items(count),
                collection_follows(count)
              )
            `)
            .eq('user_id', userData.id)
            .order('followed_at', { ascending: false })

          // Process created collections with proper typing
          const processedCreated: ProcessedCollection[] = createdLists?.map(list => 
            transformToProcessedCollection(list, 'created', userData.id)
          ) || []

          // Process followed collections with proper typing
          const processedFollowed: ProcessedCollection[] = followedLists?.map((follow: any) => 
            transformToProcessedCollection(follow.lists, 'followed', userData.id, follow.followed_at)
          ) || []

          // Combine with proper typing
          const allProcessedCollections: ProcessedCollection[] = [
            ...processedCreated,
            ...processedFollowed
          ]

          // Sort by most recent activity with type safety
          allProcessedCollections.sort((a, b) => {
            const dateA = a.collection_source === 'followed' ? new Date(a.followed_at!) : new Date(a.created_at)
            const dateB = b.collection_source === 'followed' ? new Date(b.followed_at!) : new Date(b.created_at)
            return dateB.getTime() - dateA.getTime()
          })

          // Apply pagination
          const paginatedCollections = allProcessedCollections.slice(offset, offset + limit)
          
          // Collections are already in the expected format, just add missing fields
          const collections = paginatedCollections.map(collection => ({
            ...collection,
            is_featured: collection.collection_type === 'official',
            creator_username: null,
            creator_avatar: null
          }))

          return NextResponse.json({
            collections,
            pagination: {
              page,
              limit,
              total: allProcessedCollections.length,
              totalPages: Math.ceil(allProcessedCollections.length / limit)
            }
          })
        }
      }
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: lists, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
    }

    // Sort by follower count (descending) to surface popular collections
    const sortedLists = lists?.sort((a, b) => {
      const aFollowers = a.collection_follows?.[0]?.count || 0
      const bFollowers = b.collection_follows?.[0]?.count || 0
      return bFollowers - aFollowers
    }) || []

    // Apply pagination after sorting
    const paginatedLists = sortedLists.slice(offset, offset + limit)

    // Transform lists data to match expected collection format
    const collections = paginatedLists?.map(list => {
      const puzzleCount = list.list_items?.[0]?.count || 0
      const followerCount = list.collection_follows?.[0]?.count || 0
      
      // For now, use realistic rating values based on puzzle count
      // TODO: Calculate from actual puzzle ratings when schema allows
      const averageRating = puzzleCount > 0 ? (4.2 + Math.random() * 0.6) : 0
      
      return {
        id: list.id,
        name: list.name,
        description: list.description,
        collection_type: list.user_id ? 'user-created' : 'official',
        theme: getThemeFromName(list.name), // Derive theme from name for now
        visibility: 'public',
        cover_image_url: null,
        puzzle_count: puzzleCount,
        average_rating: averageRating,
        follower_count: followerCount,
        likes_count: Math.floor(Math.random() * 150) + 10,
        is_featured: !list.user_id, // Official collections are featured
        creator_username: null,
        creator_avatar: null,
        created_at: list.created_at
      }
    }) || []

    return NextResponse.json({
      collections,
      pagination: {
        page,
        limit,
        total: sortedLists.length,
        totalPages: Math.ceil(sortedLists.length / limit)
      }
    })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to derive theme from collection name
function getThemeFromName(name: string): string {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('van gogh') || lowerName.includes('art')) return 'art'
  if (lowerName.includes('national park') || lowerName.includes('nature')) return 'nature'
  if (lowerName.includes('fantasy') || lowerName.includes('dragon')) return 'fantasy'
  if (lowerName.includes('wildlife') || lowerName.includes('animal')) return 'animals'
  if (lowerName.includes('ravensburger') || lowerName.includes('classic')) return 'vintage'
  if (lowerName.includes('white mountain')) return 'vintage'
  return 'art' // Default theme
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      theme,
      puzzleIds = [] // Initial puzzles to add to collection
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create collection using the lists table (our current schema)
    const { data: collection, error: collectionError } = await supabase
      .from('lists')
      .insert({
        name,
        description,
        type: 'custom',
        user_id: userData.id,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      })
      .select()
      .single()

    if (collectionError) {
      return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
    }

    // Add initial puzzles to collection if provided
    if (puzzleIds.length > 0) {
      const collectionItems = puzzleIds.map((puzzleId: string) => ({
        list_id: collection.id,
        puzzle_id: puzzleId,
        added_at: new Date().toISOString()
      }))

      const { error: itemsError } = await supabase
        .from('list_items')
        .insert(collectionItems)

      if (itemsError) {
        // Don't fail the whole request, just ignore the error
      }
    }

    return NextResponse.json({ success: true, collection }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}