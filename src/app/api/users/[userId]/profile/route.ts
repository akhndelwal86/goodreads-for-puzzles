import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/users/[userId]/profile - Get user profile with stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabaseService = createServiceClient()
    const { userId: targetUserId } = await params

    // Get user data
    const { data: user, error: userError } = await supabaseService
      .from('users')
      .select('*')
      .eq('clerk_id', targetUserId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user puzzle stats
    const { data: puzzleStats, error: statsError } = await supabaseService
      .from('puzzle_logs')
      .select(`
        id,
        status,
        solve_time_seconds,
        user_rating,
        puzzle:puzzles!puzzle_id (
          piece_count,
          brand:brands!brand_id (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')

    // Get review stats
    const { data: reviewStats, error: reviewError } = await supabaseService
      .from('reviews')
      .select('rating')
      .eq('user_id', user.id)

    // Calculate stats
    const completedPuzzles = puzzleStats?.length || 0
    const totalReviews = reviewStats?.length || 0
    
    const avgRating = reviewStats && reviewStats.length > 0 
      ? reviewStats.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewStats.length
      : 0

    const totalPieces = puzzleStats?.reduce((sum, log) => {
      const puzzle = Array.isArray(log.puzzle) ? log.puzzle[0] : log.puzzle
      return sum + (puzzle?.piece_count || 0)
    }, 0) || 0

    const avgSolveTimeHours = puzzleStats && puzzleStats.length > 0
      ? puzzleStats
          .filter(log => log.solve_time_seconds)
          .reduce((sum, log) => sum + (log.solve_time_seconds || 0), 0) / 
        puzzleStats.filter(log => log.solve_time_seconds).length / 3600
      : 0

    // Find favorite brand
    const brandCounts = new Map<string, number>()
    puzzleStats?.forEach(log => {
      const puzzle = Array.isArray(log.puzzle) ? log.puzzle[0] : log.puzzle
      const brand = Array.isArray(puzzle?.brand) ? puzzle.brand[0] : puzzle?.brand
      const brandName = brand?.name
      if (brandName) {
        brandCounts.set(brandName, (brandCounts.get(brandName) || 0) + 1)
      }
    })

    const favoriteBrand = brandCounts.size > 0 
      ? Array.from(brandCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : ''

    // Get recent activity (placeholder for now)
    const recentActivity: any[] = []

    // Get completed puzzles for showcase (placeholder for now)
    const completedPuzzlesShowcase: any[] = []

    // Get total puzzles owned (all puzzles in user's library)
    const { data: allPuzzleLogs, error: allLogsError } = await supabaseService
      .from('puzzle_logs')
      .select('puzzle_id')
      .eq('user_id', user.id)

    const puzzlesOwned = allPuzzleLogs?.length || 0

    const stats = {
      puzzles_owned: puzzlesOwned,
      puzzles_completed: completedPuzzles,
      reviews_count: totalReviews,
      avg_rating: Number(avgRating.toFixed(1)),
      avg_solve_time_hours: Number(avgSolveTimeHours.toFixed(1)),
      favorite_brand: favoriteBrand,
      total_pieces: totalPieces
    }

    return NextResponse.json({
      user,
      stats,
      recent_activity: recentActivity,
      completed_puzzles: completedPuzzlesShowcase
    })

  } catch (error) {
    console.error('Error in profile endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}