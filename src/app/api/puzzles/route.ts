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
    const ratingMin = parseFloat(searchParams.get('ratingMin') || '0')
    const status = searchParams.get('status')?.split(',').filter(Boolean) || []
    const themes = searchParams.get('themes')?.split(',').filter(Boolean) || []
    const difficulties = searchParams.get('difficulties')?.split(',').filter(Boolean) || []
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
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

    // Add user log join if user is authenticated and status filtering is needed
    if (userInternalId && (status.length > 0 || status.includes('not-added'))) {
      baseQuery = supabase
        .from('puzzles')
        .select(`
          *,
          brand:brands(id, name),
          puzzle_aggregates(avg_rating, review_count),
          user_logs:puzzle_logs!left(id, status, user_id)
        `)
        .eq('approval_status', 'approved')
        .eq('user_logs.user_id', userInternalId)
    }

    // Apply search filter
    if (search && search.trim()) {
      baseQuery = baseQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,theme.ilike.%${search}%`)
    }

    // Apply brand filter - handle both names and IDs
    if (brands.length > 0) {
      // Check if we're dealing with UUIDs (IDs) or names
      const isUUID = brands[0]?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      
      if (isUUID) {
        // Filter by brand IDs directly
        baseQuery = baseQuery.in('brand_id', brands)
      } else {
        // Convert brand names to IDs first
        const { data: brandData } = await supabase
          .from('brands')
          .select('id')
          .in('name', brands)
        
        const brandIds = brandData?.map(b => b.id) || []
        if (brandIds.length > 0) {
          baseQuery = baseQuery.in('brand_id', brandIds)
        }
      }
    }

    // Apply theme filter
    if (themes.length > 0) {
      const themeConditions = themes.map(theme => `theme.ilike.%${theme}%`).join(',')
      baseQuery = baseQuery.or(themeConditions)
    }

    // Apply piece count range
    if (pieceMin > 0) {
      baseQuery = baseQuery.gte('piece_count', pieceMin)
    }
    if (pieceMax < 999999) {
      baseQuery = baseQuery.lte('piece_count', pieceMax)
    }

    // Apply difficulty filter using piece count ranges
    if (difficulties.length > 0) {
      const difficultyRanges = {
        'easy': [0, 500],        // Easy: 0-500 pieces
        'medium': [501, 1000],   // Medium: 501-1000 pieces  
        'hard': [1001, 2000],    // Hard: 1001-2000 pieces
        'expert': [2001, 999999] // Expert: 2000+ pieces
      }
      
      let pieceRanges: number[][] = []
      difficulties.forEach(diff => {
        const range = difficultyRanges[diff as keyof typeof difficultyRanges]
        if (range) {
          pieceRanges.push(range)
        }
      })
      
      if (pieceRanges.length > 0) {
        // Create OR conditions for each difficulty range
        const minPiece = Math.min(...pieceRanges.map(r => r[0]))
        const maxPiece = Math.max(...pieceRanges.map(r => r[1]))
        baseQuery = baseQuery.gte('piece_count', minPiece).lte('piece_count', maxPiece)
      }
    }

    // Apply sorting
    let orderColumn: string
    let ascending = sortOrder === 'asc'
    
    switch (sortBy) {
      case 'popular':
        orderColumn = 'created_at'
        ascending = false // Will sort by review_count in JavaScript
        break
      case 'rating':
        orderColumn = 'created_at'
        ascending = false // Will sort by avg_rating in JavaScript
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

    let filteredPuzzles = puzzles || []

    // Filter by rating if specified (FIXED LOGIC)
    if (ratingMin > 0) {
      filteredPuzzles = filteredPuzzles.filter((puzzle: any) => {
        const rating = puzzle.puzzle_aggregates?.avg_rating
        // Only include puzzles that have a rating AND meet the minimum threshold
        return rating !== null && rating !== undefined && rating >= ratingMin
      })
    }

    // Filter by "Rated Only" if specified
    if (ratedOnly) {
      filteredPuzzles = filteredPuzzles.filter((puzzle: any) => {
        const rating = puzzle.puzzle_aggregates?.avg_rating
        const reviewCount = puzzle.puzzle_aggregates?.review_count || 0
        return rating !== null && rating !== undefined && reviewCount > 0
      })
    }

    // Handle status filtering for authenticated users (FIXED)
    if (userInternalId && status.length > 0) {
      if (status.includes('not-added')) {
        // Show puzzles without logs
        const puzzlesWithoutLogs = filteredPuzzles.filter((p: any) => 
          !p.user_logs || p.user_logs.length === 0
        )
        
        const otherStatuses = status.filter(s => s !== 'not-added')
        if (otherStatuses.length > 0) {
          const puzzlesWithMatchingStatus = filteredPuzzles.filter((p: any) => 
            p.user_logs && p.user_logs.length > 0 && 
            p.user_logs.some((log: any) => otherStatuses.includes(log.status))
          )
          filteredPuzzles = [...puzzlesWithoutLogs, ...puzzlesWithMatchingStatus]
        } else {
          filteredPuzzles = puzzlesWithoutLogs
        }
      } else {
        // Only show puzzles with matching status
        filteredPuzzles = filteredPuzzles.filter((p: any) => 
          p.user_logs && p.user_logs.length > 0 &&
          p.user_logs.some((log: any) => status.includes(log.status))
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
      userStatus: puzzle.user_logs && puzzle.user_logs.length > 0 ? puzzle.user_logs[0].status : null
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
        themes,
        difficulties,
        categories,
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