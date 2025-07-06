import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { logger } from '@/lib/utils'

// ============================
// GET /api/puzzle-logs/check?puzzleId=xxx
// Check if a puzzle log exists for a given puzzle
// ============================
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const puzzleId = searchParams.get('puzzleId')

    if (!puzzleId) {
      return NextResponse.json(
        { error: 'puzzleId parameter is required' },
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

    // Get existing puzzle log for this user and puzzle
    const { data: existingLog, error: logError } = await supabase
      .from('puzzle_logs')
      .select(`
        id,
        user_id,
        puzzle_id,
        status,
        solve_time_seconds,
        note,
        photo_urls,
        video_urls,
        progress_percentage,
        user_rating,
        difficulty_rating,
        is_private,
        logged_at,
        updated_at,
        puzzle:puzzles!inner(
          id,
          title
        )
      `)
      .eq('user_id', userData.id)
      .eq('puzzle_id', puzzleId)
      .single()

    if (logError && logError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine
      logger.error('Error checking for puzzle log:', logError)
      return NextResponse.json(
        { error: 'Failed to check for puzzle log' },
        { status: 500 }
      )
    }

    if (existingLog) {
      return NextResponse.json({
        hasLog: true,
        log: {
          id: existingLog.id,
          puzzleId: existingLog.puzzle_id,
          puzzleTitle: existingLog.puzzle[0]?.title || 'Unknown Puzzle',
          status: existingLog.status,
          notes: existingLog.note || '',
          timeSpent: existingLog.solve_time_seconds || 0,
          photos: existingLog.photo_urls || [],
          progressPercentage: existingLog.progress_percentage || 0,
          rating: existingLog.user_rating || 0,
          difficulty: existingLog.difficulty_rating || 0,
          private: existingLog.is_private || false,
          completedAt: existingLog.logged_at,
          createdAt: existingLog.updated_at || new Date().toISOString(),
          updatedAt: existingLog.updated_at || new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json({
        hasLog: false,
        log: null
      })
    }

  } catch (error) {
    logger.error('Error in GET /api/puzzle-logs/check:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 