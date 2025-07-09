import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid puzzle ID format' }, { status: 400 })
    }

    const supabase = createServiceClient()
    
    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4')
    
    // First, get the current puzzle to find its brand
    const { data: currentPuzzle, error: currentPuzzleError } = await supabase
      .from('puzzles')
      .select('brand_id')
      .eq('id', id)
      .eq('approval_status', 'approved')
      .single()

    if (currentPuzzleError || !currentPuzzle || !currentPuzzle.brand_id) {
      return NextResponse.json({
        relatedPuzzles: [],
        brandName: null,
        total: 0
      })
    }

    // Get brand name
    const { data: brandData } = await supabase
      .from('brands')
      .select('name')
      .eq('id', currentPuzzle.brand_id)
      .single()

    const brandName = brandData?.name || null

    // Fetch related puzzles from the same brand, excluding the current puzzle
    const { data: relatedPuzzles, error: relatedError } = await supabase
      .from('puzzles')
      .select('id, title, piece_count, image_url, theme, difficulty, year_published')
      .eq('brand_id', currentPuzzle.brand_id)
      .eq('approval_status', 'approved')
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (relatedError || !relatedPuzzles) {
      return NextResponse.json({
        relatedPuzzles: [],
        brandName,
        total: 0
      })
    }

    // Get completion counts for each puzzle
    const puzzleIds = relatedPuzzles.map(p => p.id)
    let completionCounts: { [key: string]: number } = {}
    
    if (puzzleIds.length > 0) {
      const { data: completionData } = await supabase
        .from('puzzle_logs')
        .select('puzzle_id')
        .in('puzzle_id', puzzleIds)
        .eq('status', 'completed')

      if (completionData) {
        completionData.forEach(log => {
          completionCounts[log.puzzle_id] = (completionCounts[log.puzzle_id] || 0) + 1
        })
      }
    }

    // Get total count for the brand (excluding current puzzle)
    const { count: totalCount } = await supabase
      .from('puzzles')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', currentPuzzle.brand_id)
      .eq('approval_status', 'approved')
      .neq('id', id)

    // Format the response
    const formattedPuzzles = relatedPuzzles.map(puzzle => ({
      id: puzzle.id,
      title: puzzle.title,
      pieces: puzzle.piece_count,
      image: puzzle.image_url,
      theme: puzzle.theme,
      difficulty: puzzle.difficulty,
      yearPublished: puzzle.year_published,
      brand: brandName,
      rating: null,
      reviewCount: 0,
      timesCompleted: completionCounts[puzzle.id] || 0
    }))

    return NextResponse.json({
      relatedPuzzles: formattedPuzzles,
      brandName,
      total: totalCount || 0
    })

  } catch (error) {
    console.error('Error in related puzzles API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}