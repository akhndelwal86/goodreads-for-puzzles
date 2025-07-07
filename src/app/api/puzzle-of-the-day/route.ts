import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export interface PuzzleOfTheDay {
  id: string
  title: string
  brand: string
  pieces: number
  difficulty: string
  image: string
  description: string | null
  avgTime: string
  rating: number
  completions: number
  tags: string[]
  inStock: boolean
}

// Cache for 1 hour since puzzle of the day changes daily
export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    console.log('🌟 Fetching puzzle of the day...')
    
    const supabase = createServiceClient()
    
    // Get puzzles with basic info
    const { data: puzzles, error } = await supabase
      .from('puzzles')
      .select(`
        id,
        title,
        piece_count,
        description,
        image_url,
        approval_status,
        brands (
          name
        )
      `)
      .limit(5)
    
    console.log('📊 Query result:', { puzzles: puzzles?.length, error })
    
    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({ error: 'Database error', details: error }, { status: 500 })
    }
    
    if (!puzzles || puzzles.length === 0) {
      console.error('❌ No puzzles found in database')
      return NextResponse.json({ error: 'No puzzles in database' }, { status: 500 })
    }
    
    // Filter for approved puzzles
    const approvedPuzzles = puzzles.filter(p => p.approval_status === 'approved')
    console.log('✅ Approved puzzles:', approvedPuzzles.length)
    
    // Use approved puzzles if available, otherwise use any puzzle
    const puzzlesToUse = approvedPuzzles.length > 0 ? approvedPuzzles : puzzles
    
    // Use day-based selection
    const now = new Date()
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const selectedPuzzle = puzzlesToUse[dayOfYear % puzzlesToUse.length]
    
    console.log('🎯 Selected puzzle:', selectedPuzzle.title)
    
    // Get rating from puzzle_aggregates separately
    const { data: aggregateData } = await supabase
      .from('puzzle_aggregates')
      .select('avg_rating, review_count')
      .eq('id', selectedPuzzle.id)
      .single()
    
    console.log('📈 Aggregate data:', aggregateData)
    
    // Get completion stats from puzzle_logs
    const { data: completionStats } = await supabase
      .from('puzzle_logs')
      .select('solve_time_seconds')
      .eq('puzzle_id', selectedPuzzle.id)
      .eq('status', 'completed')
    
    const completionCount = completionStats?.length || 0
    const avgTimeMinutes = completionStats && completionStats.length > 0
      ? completionStats.reduce((sum, log) => sum + (log.solve_time_seconds || 0), 0) / completionStats.length / 60
      : 0
    
    // Get tags
    const { data: tagData } = await supabase
      .from('puzzle_tags')
      .select(`
        tags (
          name
        )
      `)
      .eq('puzzle_id', selectedPuzzle.id)
    
    const tags = tagData?.map(item => (item.tags as any)?.name).filter(Boolean) || []
    
    const puzzleOfTheDay: PuzzleOfTheDay = {
      id: selectedPuzzle.id,
      title: selectedPuzzle.title,
      brand: (selectedPuzzle.brands as any)?.[0]?.name || 'Unknown',
      pieces: selectedPuzzle.piece_count || 0,
      difficulty: getDifficultyFromPieceCount(selectedPuzzle.piece_count),
      image: selectedPuzzle.image_url || '/placeholder-puzzle.svg',
      description: selectedPuzzle.description,
      avgTime: formatCompletionTime(avgTimeMinutes),
      rating: aggregateData?.avg_rating || 0,
      completions: completionCount,
      tags: tags,
      inStock: true,
    }
    
    console.log('✅ Puzzle of the day fetched successfully')
    
    return NextResponse.json(puzzleOfTheDay, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      }
    })
    
  } catch (error) {
    console.error('❌ Error fetching puzzle of the day:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch puzzle of the day',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function formatCompletionTime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return 'No data'
  
  const hours = Math.floor(minutes / 60)
  
  if (hours === 0) {
    return `${minutes} min`
  } else if (hours < 2) {
    return `${hours}-${hours + 1} hours`
  } else {
    return `${hours}-${hours + 2} hours`
  }
}

function getDifficultyFromPieceCount(pieceCount: number | null): string {
  if (!pieceCount) return 'Unknown'
  if (pieceCount <= 300) return 'Easy'
  if (pieceCount <= 1000) return 'Medium'
  if (pieceCount <= 2000) return 'Hard'
  return 'Expert'
} 
