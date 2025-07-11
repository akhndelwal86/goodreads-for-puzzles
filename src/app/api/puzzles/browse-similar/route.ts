import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const puzzleId = searchParams.get('puzzleId')
    
    if (!puzzleId) {
      return NextResponse.json({ error: 'puzzleId is required' }, { status: 400 })
    }

    // Basic validation - just check it's not empty and has reasonable length
    if (puzzleId.length < 8 || puzzleId.length > 100) {
      return NextResponse.json({ error: 'Invalid puzzle ID format' }, { status: 400 })
    }

    const supabase = createServiceClient()
    
    // First, get the current puzzle details
    const { data: currentPuzzle, error: currentPuzzleError } = await supabase
      .from('puzzles')
      .select('piece_count, theme, material')
      .eq('id', puzzleId)
      .eq('approval_status', 'approved')
      .single()

    if (currentPuzzleError) {
      return NextResponse.json({ error: `Puzzle query error: ${currentPuzzleError.message}` }, { status: 404 })
    }

    if (!currentPuzzle) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 })
    }

    const { piece_count, theme, material } = currentPuzzle

    // Get counts for similar puzzles (excluding the current puzzle)
    
    // 1. Same Material Count (using material instead of difficulty)
    let sameMaterialCount = 0
    if (material) {
      const { count } = await supabase
        .from('puzzles')
        .select('*', { count: 'exact', head: true })
        .eq('material', material)
        .eq('approval_status', 'approved')
        .neq('id', puzzleId)
      
      sameMaterialCount = count || 0
    }

    // 2. Same Piece Count 
    const { count: samePieceCountCount } = await supabase
      .from('puzzles')
      .select('*', { count: 'exact', head: true })
      .eq('piece_count', piece_count)
      .eq('approval_status', 'approved')
      .neq('id', puzzleId)

    // 3. Same Theme Count
    let sameThemeCount = 0
    if (theme) {
      const { count } = await supabase
        .from('puzzles')
        .select('*', { count: 'exact', head: true })
        .eq('theme', theme)
        .eq('approval_status', 'approved')
        .neq('id', puzzleId)
      
      sameThemeCount = count || 0
    }

    const response = {
      currentPuzzle: {
        material,
        pieceCount: piece_count,
        theme
      },
      similarities: [
        {
          type: 'material',
          label: `${material || 'Same'} Material`,
          description: `${material || 'Similar'} material puzzles`,
          count: sameMaterialCount,
          filterKey: 'material',
          filterValue: material,
          enabled: !!material && sameMaterialCount > 0
        },
        {
          type: 'piece_count',
          label: `${piece_count}-Piece Puzzles`,
          description: `Other ${piece_count}-piece puzzles`,
          count: samePieceCountCount || 0,
          filterKey: 'piece_count',
          filterValue: piece_count,
          enabled: (samePieceCountCount || 0) > 0
        },
        {
          type: 'theme',
          label: `${theme || 'Similar'} Theme`,
          description: `More ${theme || 'similar themed'} puzzles`,
          count: sameThemeCount,
          filterKey: 'theme',
          filterValue: theme,
          enabled: !!theme && sameThemeCount > 0
        }
      ]
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in browse-similar API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}