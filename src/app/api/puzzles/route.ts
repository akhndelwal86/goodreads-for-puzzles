import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { logger } from '@/lib/utils'
import type { CreatePuzzleRequest } from '@/lib/supabase'

// ============================
// POST /api/puzzles
// Create a new puzzle
// ============================
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreatePuzzleRequest = await request.json()
    const {
      title,
      brandId,
      pieceCount,
      imageUrl,
      theme,
      material,
      description,
      year
    } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    
    // Get the user's internal ID from their Clerk ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      logger.error('Failed to find user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Validate brand if provided
    if (brandId) {
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('id', brandId)
        .single()

      if (brandError || !brandData) {
        logger.error('Brand not found:', brandError)
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
      }
    }

    // Prepare the puzzle data
    const puzzleData = {
      title,
      brand_id: brandId,
      piece_count: pieceCount,
      image_url: imageUrl,
      theme,
      material,
      description,
      year,
      uploader_id: userData.id,
      approval_status: 'approved' // Auto-approve for now, can change later
    }

    // Create the puzzle
    const { data: newPuzzle, error: createError } = await supabase
      .from('puzzles')
      .insert(puzzleData)
      .select(`
        *,
        brand:brands(id, name)
      `)
      .single()

    if (createError) {
      logger.error('Failed to create puzzle:', createError)
      return NextResponse.json(
        { error: 'Failed to create puzzle' },
        { status: 500 }
      )
    }

    // Create corresponding puzzle_aggregates entry
    const { error: aggregateError } = await supabase
      .from('puzzle_aggregates')
      .insert({
        id: newPuzzle.id,
        title: newPuzzle.title,
        review_count: 0,
        loose_fit_count: 0,
        false_fit_count: 0,
        shape_versatility_count: 0,
        finish_count: 0,
        pick_test_count: 0
      })

    if (aggregateError) {
      logger.error('Failed to create puzzle aggregates:', aggregateError)
      // Don't fail the whole request for this
    }

    logger.success('Puzzle created successfully:', newPuzzle.id)

    // Transform the response to match our Puzzle type
    const response = {
      id: newPuzzle.id,
      title: newPuzzle.title,
      brand: newPuzzle.brand ? {
        id: newPuzzle.brand.id,
        name: newPuzzle.brand.name
      } : undefined,
      imageUrl: newPuzzle.image_url,
      pieceCount: newPuzzle.piece_count,
      theme: newPuzzle.theme,
      material: newPuzzle.material,
      description: newPuzzle.description,
      year: newPuzzle.year,
      createdAt: newPuzzle.created_at,
      updatedAt: newPuzzle.updated_at
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    logger.error('Error in POST /api/puzzles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================
// GET /api/puzzles
// Get all puzzles (with filtering and pagination)
// ============================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { userId } = await auth()
    
    // Parse filter parameters
    const search = searchParams.get('search')
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || []
    const pieceMin = parseInt(searchParams.get('pieceMin') || '0')
    const pieceMax = parseInt(searchParams.get('pieceMax') || '999999')
    const diffMin = parseInt(searchParams.get('diffMin') || '1')
    const diffMax = parseInt(searchParams.get('diffMax') || '5')
    const ratingMin = parseFloat(searchParams.get('ratingMin') || '1')
    const status = searchParams.get('status')?.split(',').filter(Boolean) || []
    const ratedOnly = searchParams.get('ratedOnly') === 'true'
    const sortBy = searchParams.get('sortBy') || 'recent'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServiceClient()

    // Get user's internal ID if authenticated
    let userInternalId: string | null = null
    if (userId) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', userId)
        .single()
      userInternalId = userData?.id || null
    }

    // Build the main query - always include puzzle_aggregates for sorting and filtering
    let baseQuery = supabase
      .from('puzzles')
      .select(`
        *,
        brand:brands(id, name),
        puzzle_aggregates(avg_rating, review_count)
      `)
      .eq('approval_status', 'approved')

    // Add user log join if user is authenticated
    if (userInternalId) {
      baseQuery = supabase
        .from('puzzles')
        .select(`
          *,
          brand:brands(id, name),
          puzzle_aggregates(avg_rating, review_count),
          user_log:puzzle_logs!left(status)
        `)
        .eq('approval_status', 'approved')
        .eq('user_log.user_id', userInternalId)
    }

    // Apply search filter
    if (search && search.trim()) {
      baseQuery = baseQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,theme.ilike.%${search}%`)
    }

    // Apply brand filter
    if (brands.length > 0) {
      baseQuery = baseQuery.in('brand_id', brands)
    }

    // Apply piece count range - moved to SQL level for better performance
    if (pieceMin > 0) {
      baseQuery = baseQuery.gte('piece_count', pieceMin)
    }
    if (pieceMax < 999999) {
      baseQuery = baseQuery.lte('piece_count', pieceMax)
    }

    // Apply difficulty range (based on piece count) - moved to SQL level
    if (diffMin > 1 || diffMax < 5) {
      const difficultyRanges = {
        1: [0, 300],      // Beginner
        2: [301, 500],    // Easy
        3: [501, 1000],   // Medium
        4: [1001, 2000],  // Hard
        5: [2001, 999999] // Expert
      }
      
      const minPieces = difficultyRanges[diffMin as keyof typeof difficultyRanges]?.[0] || 0
      const maxPieces = difficultyRanges[diffMax as keyof typeof difficultyRanges]?.[1] || 999999
      
      // Only apply if it's more restrictive than the piece count filter
      const effectiveMin = Math.max(minPieces, pieceMin)
      const effectiveMax = Math.min(maxPieces, pieceMax)
      
      baseQuery = baseQuery.gte('piece_count', effectiveMin).lte('piece_count', effectiveMax)
    }

    // Apply sorting - FIX THE SYNTAX ERROR HERE
    let orderColumn: string
    let ascending = sortOrder === 'asc'
    
    switch (sortBy) {
      case 'popular':
        // For sorting by aggregated data, we need to handle it differently
        // We'll sort in JavaScript after fetching since Supabase joined sorting is complex
        orderColumn = 'created_at'
        ascending = false // Default for now, will sort by review_count in JS
        break
      case 'rating':
        // Same for rating - sort in JavaScript
        orderColumn = 'created_at'
        ascending = false // Default for now, will sort by avg_rating in JS
        break
      case 'difficulty':
        orderColumn = 'piece_count'
        break
      case 'pieces':
        orderColumn = 'piece_count'
        break
      case 'recent':
      default:
        orderColumn = 'created_at'
        break
    }
    
    // Apply the safe ordering
    baseQuery = baseQuery.order(orderColumn, { ascending })

    // Execute the query with pagination
    const { data: puzzles, error: puzzleError } = await baseQuery
      .range(offset, offset + limit - 1)

    if (puzzleError) {
      logger.error('Failed to fetch puzzles:', puzzleError)
      return NextResponse.json(
        { error: 'Failed to fetch puzzles', details: puzzleError },
        { status: 500 }
      )
    }

    // Post-process filtering and sorting that can't be done efficiently in SQL
    let filteredPuzzles = puzzles || []

    // Filter by rating if specified
    if (ratingMin > 0) {
      filteredPuzzles = filteredPuzzles.filter((puzzle: any) => {
        const rating = puzzle.puzzle_aggregates?.avg_rating
        // Include unrated puzzles (NULL/undefined) OR puzzles that meet the rating requirement
        // This way, unrated puzzles are shown, and only low-rated puzzles are filtered out
        return rating === null || rating === undefined || rating >= ratingMin
      })
    }

    // Filter by "Rated Only" if specified
    if (ratedOnly) {
      filteredPuzzles = filteredPuzzles.filter((puzzle: any) => {
        const rating = puzzle.puzzle_aggregates?.avg_rating
        const reviewCount = puzzle.puzzle_aggregates?.review_count || 0
        // Only show puzzles that have actual reviews
        return rating !== null && rating !== undefined && reviewCount > 0
      })
    }

    // Handle status filtering for authenticated users
    if (userInternalId && status.length > 0) {
      if (status.includes('not-added')) {
        const puzzlesWithoutLogs = filteredPuzzles.filter((p: any) => !p.user_log)
        const otherStatuses = status.filter(s => s !== 'not-added')
        
        if (otherStatuses.length > 0) {
          const puzzlesWithMatchingStatus = filteredPuzzles.filter((p: any) => 
            p.user_log && otherStatuses.includes(p.user_log.status)
          )
          filteredPuzzles = [...puzzlesWithoutLogs, ...puzzlesWithMatchingStatus]
        } else {
          filteredPuzzles = puzzlesWithoutLogs
        }
      } else {
        // Only show puzzles with matching status
        filteredPuzzles = filteredPuzzles.filter((p: any) => 
          p.user_log && status.includes(p.user_log.status)
        )
      }
    }

    // Apply JavaScript-based sorting for complex cases
    if (sortBy === 'popular') {
      filteredPuzzles.sort((a: any, b: any) => {
        const aCount = a.puzzle_aggregates?.review_count || 0
        const bCount = b.puzzle_aggregates?.review_count || 0
        return ascending ? aCount - bCount : bCount - aCount
      })
    } else if (sortBy === 'rating') {
      filteredPuzzles.sort((a: any, b: any) => {
        const aRating = a.puzzle_aggregates?.avg_rating || 0
        const bRating = b.puzzle_aggregates?.avg_rating || 0
        return ascending ? aRating - bRating : bRating - aRating
      })
    }

    // Get available brands with puzzle counts for the sidebar
    const { data: brandsData, error: brandsError } = await supabase
      .from('brands')
      .select(`
        id,
        name,
        puzzles!inner(id)
      `)
      .eq('puzzles.approval_status', 'approved')

    const availableBrands = brandsData?.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
      count: brand.puzzles?.length || 0
    })).filter(brand => brand.count > 0) || []

    // Transform the puzzle response
    const transformedPuzzles = filteredPuzzles.map((puzzle: any) => ({
      id: puzzle.id,
      title: puzzle.title,
      brand: puzzle.brand ? {
        id: puzzle.brand.id,
        name: puzzle.brand.name
      } : undefined,
      imageUrl: puzzle.image_url,
      pieceCount: puzzle.piece_count,
      theme: puzzle.theme,
      material: puzzle.material,
      description: puzzle.description,
      year: puzzle.year,
      createdAt: puzzle.created_at,
      updatedAt: puzzle.updated_at,
      avgRating: puzzle.puzzle_aggregates?.avg_rating || null,
      reviewCount: puzzle.puzzle_aggregates?.review_count || 0,
      userStatus: puzzle.user_log?.status || null
    }))

    const response = {
      puzzles: transformedPuzzles,
      total: transformedPuzzles.length,
      brands: availableBrands,
      filters: {
        search,
        brands,
        pieceMin,
        pieceMax,
        diffMin,
        diffMax,
        ratingMin,
        status,
        ratedOnly,
        sortBy,
        sortOrder
      }
    }

    logger.success(`Retrieved ${transformedPuzzles.length} puzzles with filters`)
    return NextResponse.json(response)

  } catch (error) {
    logger.error('Error in GET /api/puzzles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 