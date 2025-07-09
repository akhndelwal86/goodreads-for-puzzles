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

    // Fetch puzzle details with related data
    const { data: puzzle, error: puzzleError } = await supabase
      .from('puzzles')
      .select(`
        *,
        brand:brands!brand_id(id, name, image_url),
        uploader:users!uploader_id(id, username, avatar_url)
      `)
      .eq('id', id)
      .single()

    if (puzzleError || !puzzle) {
      console.error('Error fetching puzzle:', puzzleError)
      console.error('Puzzle ID:', id)
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 })
    }

    console.log('✅ Found puzzle:', puzzle.title)

    // Fetch comprehensive community stats
    let wantToBuyCount = 0
    let wishlistCount = 0
    let backlogCount = 0 
    let inProgressCount = 0
    let completedCount = 0
    let totalStartedCount = 0
    let averageTime = 0
    let averageRating = 0
    let totalRatings = 0
    let communityDifficulty = 0

    try {
      // Get puzzle status counts from puzzle_logs table
      const { data: statusCounts, error: statusError } = await supabase
        .from('puzzle_logs')
        .select('status')
        .eq('puzzle_id', id)

      if (statusError) {
        console.error('Error fetching puzzle status counts:', statusError)
      } else if (statusCounts) {
        statusCounts.forEach((log: any) => {
          const status = log.status
          if (status === 'wishlist') wishlistCount++
          else if (status === 'library') backlogCount++
          else if (status === 'in-progress') inProgressCount++
          else if (status === 'completed') completedCount++
        })
        
        // Calculate total started (in-progress + completed)
        totalStartedCount = inProgressCount + completedCount
      }

      // Get detailed completion data for average time calculation
      const { data: completedLogs, error: timeError } = await supabase
        .from('puzzle_logs')
        .select('solve_time_seconds')
        .eq('puzzle_id', id)
        .eq('status', 'completed')
        .not('solve_time_seconds', 'is', null)

      if (timeError) {
        console.error('Error fetching completion times:', timeError)
      } else if (completedLogs && completedLogs.length > 0) {
        const totalTime = completedLogs.reduce((sum, log) => sum + (log.solve_time_seconds || 0), 0)
        averageTime = Math.round(totalTime / completedLogs.length / 3600) // Convert seconds to hours
      }

      // Get rating data from reviews table (removed difficulty_rating)
      const { data: reviewStats, error: reviewError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('puzzle_id', id)

      if (reviewError) {
        console.error('Error fetching review stats:', reviewError)
      } else if (reviewStats && reviewStats.length > 0) {
        totalRatings = reviewStats.length
        const totalRating = reviewStats.reduce((sum, review) => sum + (review.rating || 0), 0)
        averageRating = totalRating / totalRatings
      }

      // Get community difficulty from puzzle_logs difficulty_rating
      const { data: difficultyLogs, error: difficultyError } = await supabase
        .from('puzzle_logs')
        .select('difficulty_rating')
        .eq('puzzle_id', id)
        .not('difficulty_rating', 'is', null)

      if (difficultyError) {
        console.error('Error fetching difficulty ratings:', difficultyError)
      } else if (difficultyLogs && difficultyLogs.length > 0) {
        const totalDifficulty = difficultyLogs.reduce((sum, log) => sum + (log.difficulty_rating || 0), 0)
        communityDifficulty = totalDifficulty / difficultyLogs.length
      }

      // Legacy: Also check list_items for additional want_to_buy counts (if they exist)
      const { data: listItems, error: listError } = await supabase
        .from('list_items')
        .select('lists(slug)')
        .eq('puzzle_id', id)

      if (!listError && listItems) {
        listItems.forEach((item: any) => {
          const slug = item.lists?.slug
          if (slug === 'want_to_buy') wantToBuyCount++
        })
      }

    } catch (statsError) {
      console.error('Error fetching community stats:', statsError)
      // Continue with zero stats rather than failing the whole request
    }

    // Calculate success rate (completed / total started)
    const successRate = totalStartedCount > 0 ? Math.round((completedCount / totalStartedCount) * 100) : 0

    // Build response
    const response = {
      puzzle,
      communityStats: {
        // Legacy counts
        wantToBuy: wantToBuyCount || 0,
        backlog: backlogCount || 0,
        inProgress: inProgressCount || 0,
        completed: completedCount || 0,
        
        // Enhanced stats for sidebar
        timesCompleted: completedCount || 0,
        wishlistCount: wishlistCount || 0,
        averageTime: averageTime || 0,
        communityDifficulty: Math.round(communityDifficulty * 10) / 10 || 0, // Round to 1 decimal
        successRate: successRate || 0,
        totalRatings: totalRatings || 0,
        averageRating: Math.round(averageRating * 10) / 10 || 0, // Round to 1 decimal
        
        // Additional useful stats
        totalStarted: totalStartedCount || 0,
        activeSolvers: inProgressCount || 0
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in puzzle detail API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 