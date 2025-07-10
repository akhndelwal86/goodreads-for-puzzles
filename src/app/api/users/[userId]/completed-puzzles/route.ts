import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabase = createServiceClient()
    const { userId: targetUserId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    // First, get the user's database ID from their clerk_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', targetUserId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'User not found', 
        details: userError?.message,
        targetUserId 
      }, { status: 404 })
    }

    // Fetch user's completed puzzles with puzzle details
    const { data: completedPuzzles, error: puzzlesError } = await supabase
      .from('puzzle_logs')
      .select(`
        id,
        status,
        solve_time_seconds,
        user_rating,
        difficulty_rating,
        note,
        photo_urls,
        logged_at,
        puzzle:puzzles!puzzle_id(
          id,
          title,
          image_url,
          piece_count,
          theme,
          brand:brands!brand_id(
            id,
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['completed', 'solved']) // Support both status values
      .order('logged_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (puzzlesError) {
      console.error('Error fetching completed puzzles:', puzzlesError)
      return NextResponse.json({ 
        error: 'Failed to fetch completed puzzles', 
        details: puzzlesError.message,
        code: puzzlesError.code 
      }, { status: 500 })
    }

    // Get total count of completed puzzles for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('puzzle_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['completed', 'solved'])

    if (countError) {
      console.error('Error counting completed puzzles:', countError)
    }

    // Handle case where no completed puzzles exist
    if (!completedPuzzles || completedPuzzles.length === 0) {
      return NextResponse.json({
        puzzles: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        },
        summary: {
          totalCompleted: 0,
          avgSolveTimeHours: 0,
          avgRating: 0,
          totalPieces: 0
        }
      })
    }

    // Format the completed puzzles data
    const formattedPuzzles = completedPuzzles?.map(log => {
      const puzzle = Array.isArray(log.puzzle) ? log.puzzle[0] : log.puzzle
      const brand = Array.isArray(puzzle?.brand) ? puzzle.brand[0] : puzzle?.brand

      return {
        id: log.id,
        puzzle: {
          id: puzzle?.id || '',
          title: puzzle?.title || 'Unknown Puzzle',
          image: puzzle?.image_url || '/placeholder-puzzle.svg',
          pieceCount: puzzle?.piece_count || 0,
          theme: puzzle?.theme || '',
          difficulty: 'Unknown', // We'll calculate this from difficulty_rating
          brand: {
            id: brand?.id || '',
            name: brand?.name || 'Unknown Brand'
          }
        },
        completion: {
          completedAt: log.logged_at,
          solveTimeHours: log.solve_time_seconds ? Math.round(log.solve_time_seconds / 3600 * 10) / 10 : null,
          userRating: log.user_rating || null,
          difficultyRating: log.difficulty_rating || null,
          notes: log.note || null,
          progressPhotos: log.photo_urls || []
        },
        stats: {
          solveTime: log.solve_time_seconds ? formatSolveTime(log.solve_time_seconds) : null,
          rating: log.user_rating || 0,
          difficulty: getDifficultyText(log.difficulty_rating)
        }
      }
    }) || []

    // Calculate some summary stats
    const avgSolveTime = completedPuzzles?.length > 0 
      ? completedPuzzles
          .filter(log => log.solve_time_seconds)
          .reduce((sum, log) => sum + (log.solve_time_seconds || 0), 0) / 
        completedPuzzles.filter(log => log.solve_time_seconds).length
      : 0

    const avgRating = completedPuzzles?.length > 0
      ? completedPuzzles
          .filter(log => log.user_rating)
          .reduce((sum, log) => sum + (log.user_rating || 0), 0) /
        completedPuzzles.filter(log => log.user_rating).length
      : 0

    const totalPieces = completedPuzzles?.reduce((sum, log) => {
      const puzzle = Array.isArray(log.puzzle) ? log.puzzle[0] : log.puzzle
      return sum + (puzzle?.piece_count || 0)
    }, 0) || 0

    return NextResponse.json({
      puzzles: formattedPuzzles,
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: (totalCount || 0) > offset + limit
      },
      summary: {
        totalCompleted: totalCount || 0,
        avgSolveTimeHours: avgSolveTime > 0 ? Math.round(avgSolveTime / 3600 * 10) / 10 : 0,
        avgRating: avgRating > 0 ? Math.round(avgRating * 10) / 10 : 0,
        totalPieces
      }
    })

  } catch (error) {
    console.error('Error in completed puzzles API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to format solve time
function formatSolveTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours === 0) {
    return `${minutes}m`
  } else if (minutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${minutes}m`
  }
}

// Helper function to get difficulty text
function getDifficultyText(rating?: number): string {
  if (!rating) return 'Unknown'
  if (rating <= 2) return 'Easy'
  if (rating <= 4) return 'Medium'
  return 'Hard'
}