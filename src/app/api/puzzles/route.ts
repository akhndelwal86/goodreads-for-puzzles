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
    const search = searchParams.get('search')
    const brandId = searchParams.get('brandId')
    const brandName = searchParams.get('brandName')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const supabase = createServiceClient()

    // Build the query
    let query = supabase
      .from('puzzles')
      .select(`
        *,
        brand:brands(id, name),
        puzzle_aggregates(avg_rating, review_count)
      `)
      .eq('approval_status', 'approved')

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,theme.ilike.%${search}%`)
    }

    // Apply brand filter
    if (brandId) {
      query = query.eq('brand_id', brandId)
    } else if (brandName) {
      query = query.eq('brand.name', brandName)
    }

    // Apply sorting
    const validSortFields = ['title', 'created_at', 'piece_count', 'year']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const ascending = sortOrder === 'asc'
    
    query = query.order(sortField, { ascending })

    // Apply pagination
    const { data: puzzles, error: puzzleError } = await query
      .range(offset, offset + limit - 1)

    if (puzzleError) {
      logger.error('Failed to fetch puzzles:', puzzleError)
      return NextResponse.json(
        { error: 'Failed to fetch puzzles' },
        { status: 500 }
      )
    }

    // Transform the response
    const response = (puzzles || []).map(puzzle => ({
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
      avgRating: puzzle.puzzle_aggregates?.avg_rating,
      reviewCount: puzzle.puzzle_aggregates?.review_count || 0
    }))

    logger.success(`Retrieved ${response.length} puzzles`)
    return NextResponse.json(response)

  } catch (error) {
    logger.error('Error in GET /api/puzzles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 