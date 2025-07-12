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
      approval_status: 'pending' // Requires admin approval
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
    const collection = searchParams.get('collection')

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
    let selectClause = `
      *,
      brand:brands(id, name),
      puzzle_aggregates(avg_rating, review_count)
    `
    
    // Add user logs if needed
    if (userInternalId && (status.length > 0 || status.includes('not-added'))) {
      selectClause += `,
      user_logs:puzzle_logs!left(id, status, user_id)`
    }
    
    // Add collection filtering if needed
    if (collection) {
      selectClause += `,
      list_items!inner(list_id)`
    }

    let baseQuery = supabase
      .from('puzzles')
      .select(selectClause)
      .eq('approval_status', 'approved')

    // Apply user log filter if needed
    if (userInternalId && (status.length > 0 || status.includes('not-added'))) {
      baseQuery = baseQuery.eq('user_logs.user_id', userInternalId)
    }
    
    // Apply collection filter
    if (collection) {
      baseQuery = baseQuery.eq('list_items.list_id', collection)
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

    // Apply category filter (maps to theme field)
    if (categories.length > 0) {
      const categoryConditions = categories.map(category => `theme.ilike.%${category}%`).join(',')
      baseQuery = baseQuery.or(categoryConditions)
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
      const pieceRanges: number[][] = []
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

    // --- NEW: Get total count before pagination ---
    let countQuery = supabase
      .from('puzzles')
      .select('id', { count: 'exact', head: true })
      .eq('approval_status', 'approved')
    // Apply the same filters as baseQuery (except pagination)
    if (search && search.trim()) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,theme.ilike.%${search}%`)
    }
    if (brands.length > 0) {
      const isUUID = brands[0]?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      if (isUUID) {
        countQuery = countQuery.in('brand_id', brands)
      } else {
        const { data: brandData } = await supabase
          .from('brands')
          .select('id')
          .in('name', brands)
        const brandIds = brandData?.map(b => b.id) || []
        if (brandIds.length > 0) {
          countQuery = countQuery.in('brand_id', brandIds)
        }
      }
    }
    if (themes.length > 0) {
      const themeConditions = themes.map(theme => `theme.ilike.%${theme}%`).join(',')
      countQuery = countQuery.or(themeConditions)
    }
    if (categories.length > 0) {
      const categoryConditions = categories.map(category => `theme.ilike.%${category}%`).join(',')
      countQuery = countQuery.or(categoryConditions)
    }
    if (pieceMin > 0) {
      countQuery = countQuery.gte('piece_count', pieceMin)
    }
    if (pieceMax < 999999) {
      countQuery = countQuery.lte('piece_count', pieceMax)
    }
    if (difficulties.length > 0) {
      const difficultyRanges = {
        'easy': [0, 500],
        'medium': [501, 1000],
        'hard': [1001, 2000],
        'expert': [2001, 999999]
      }
      const pieceRanges: number[][] = []
      difficulties.forEach(diff => {
        const range = difficultyRanges[diff as keyof typeof difficultyRanges]
        if (range) {
          pieceRanges.push(range)
        }
      })
      if (pieceRanges.length > 0) {
        const minPiece = Math.min(...pieceRanges.map(r => r[0]))
        const maxPiece = Math.max(...pieceRanges.map(r => r[1]))
        countQuery = countQuery.gte('piece_count', minPiece).lte('piece_count', maxPiece)
      }
    }
    // --- END countQuery filters ---
    const { count: totalCount, error: countError } = await countQuery
    if (countError) {
      logger.error('Failed to count puzzles:', countError)
    }

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
      filteredPuzzles = filteredPuzzles.filter((puzzle: unknown) => {
        const aggregates = (puzzle as Record<string, unknown>).puzzle_aggregates as { avg_rating?: number }
        const rating = aggregates?.avg_rating
        // Only include puzzles that have a rating AND meet the minimum threshold
        return rating !== null && rating !== undefined && rating >= ratingMin
      })
    }

    // Filter by "Rated Only" if specified
    if (ratedOnly) {
      filteredPuzzles = filteredPuzzles.filter((puzzle: unknown) => {
        const aggregates = (puzzle as Record<string, unknown>).puzzle_aggregates as { avg_rating?: number, review_count?: number }
        const rating = aggregates?.avg_rating
        const reviewCount = aggregates?.review_count || 0
        return rating !== null && rating !== undefined && reviewCount > 0
      })
    }

    // Handle status filtering for authenticated users (FIXED)
    if (userInternalId && status.length > 0) {
      if (status.includes('not-added')) {
        // Show puzzles without logs
        const puzzlesWithoutLogs = filteredPuzzles.filter((p: unknown) => 
          !((p as Record<string, unknown>).user_logs) || ((p as Record<string, unknown>).user_logs as unknown[]).length === 0
        )
        
        const otherStatuses = status.filter(s => s !== 'not-added')
        if (otherStatuses.length > 0) {
          const puzzlesWithMatchingStatus = filteredPuzzles.filter((p: unknown) => 
            ((p as Record<string, unknown>).user_logs as unknown[]) && ((p as Record<string, unknown>).user_logs as unknown[]).length > 0 && 
            ((p as Record<string, unknown>).user_logs as unknown[]).some((log: unknown) => otherStatuses.includes((log as { status: string }).status))
          )
          filteredPuzzles = [...puzzlesWithoutLogs, ...puzzlesWithMatchingStatus]
        } else {
          filteredPuzzles = puzzlesWithoutLogs
        }
      } else {
        // Only show puzzles with matching status
        filteredPuzzles = filteredPuzzles.filter((p: unknown) => 
          ((p as Record<string, unknown>).user_logs as unknown[]) && ((p as Record<string, unknown>).user_logs as unknown[]).length > 0 &&
          ((p as Record<string, unknown>).user_logs as unknown[]).some((log: unknown) => status.includes((log as { status: string }).status))
        )
      }
    }

    // Apply JavaScript-based sorting for complex cases
    if (sortBy === 'popular') {
      filteredPuzzles.sort((a: unknown, b: unknown) => {
        const aCount = ((a as Record<string, unknown>).puzzle_aggregates as { review_count?: number })?.review_count || 0
        const bCount = ((b as Record<string, unknown>).puzzle_aggregates as { review_count?: number })?.review_count || 0
        return ascending ? aCount - bCount : bCount - aCount
      })
    } else if (sortBy === 'rating') {
      filteredPuzzles.sort((a: unknown, b: unknown) => {
        const aRating = ((a as Record<string, unknown>).puzzle_aggregates as { avg_rating?: number })?.avg_rating || 0
        const bRating = ((b as Record<string, unknown>).puzzle_aggregates as { avg_rating?: number })?.avg_rating || 0
        return ascending ? aRating - bRating : bRating - aRating
      })
    }

    // Get available brands with puzzle counts for the sidebar
    const { data: brandsData } = await supabase
      .from('brands')
      .select(`
        id,
        name,
        puzzles!inner(id)
      `)
      .eq('puzzles.approval_status', 'approved')

    // Helper type guards
    function hasAggregates(obj: unknown): obj is { avg_rating?: number; review_count?: number } {
      return typeof obj === 'object' && obj !== null &&
        ('avg_rating' in obj || 'review_count' in obj);
    }
    function hasUserLogs(obj: unknown): obj is { status: string } {
      return typeof obj === 'object' && obj !== null && 'status' in obj
    }

    const availableBrands: Array<{ id: string; name: string; count: number }> = brandsData?.map((brand: unknown) => {
      const b = brand as Record<string, unknown>
      return {
        id: b.id as string,
        name: b.name as string,
        count: Array.isArray(b.puzzles) ? b.puzzles.length : 0
      }
    }).filter((brand) => brand.count > 0) || []

    // Transform the puzzle response
    const transformedPuzzles = filteredPuzzles.map((puzzle: unknown) => {
      const p = puzzle as Record<string, unknown>
      const aggregates = hasAggregates(p.puzzle_aggregates) ? p.puzzle_aggregates as Record<string, unknown> : undefined
      const userLogs = Array.isArray(p.user_logs) ? p.user_logs : []
      let avgRating: number | null = null
      let reviewCount: number = 0
      if (aggregates) {
        const agg = aggregates as { avg_rating?: number, review_count?: number }
        if (typeof agg.avg_rating === 'number') {
          avgRating = agg.avg_rating
        }
        if (typeof agg.review_count === 'number') {
          reviewCount = agg.review_count
        }
      }
      return {
        id: p.id as string,
        title: p.title as string,
        brand: p.brand ? {
          id: (p.brand as { id: string }).id,
          name: (p.brand as { name: string }).name
        } : undefined,
        imageUrl: p.image_url as string,
        pieceCount: p.piece_count as number,
        theme: p.theme as string,
        material: p.material as string,
        description: p.description as string,
        year: p.year as number,
        createdAt: p.created_at as string,
        updatedAt: p.updated_at as string,
        avgRating,
        reviewCount,
        userStatus: userLogs.length > 0 && hasUserLogs(userLogs[0]) ? (userLogs[0] as { status: string }).status : null
      }
    })

    const response = {
      puzzles: transformedPuzzles,
      total: totalCount ?? transformedPuzzles.length,
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

    // logger.success(`Retrieved ${transformedPuzzles.length} puzzles with filters (total: ${totalCount})`)
    return NextResponse.json(response)

  } catch (error) {
    logger.error('Error in GET /api/puzzles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 