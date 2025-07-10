import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabase = createServiceClient()
    const { userId: clerkUserId } = await auth()
    const { userId: targetUserId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Verify the user is requesting their own activity (or is admin)
    if (clerkUserId !== targetUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get the user's database ID from their clerk_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, avatar_url, clerk_id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch user's personal activity from feed_items and puzzle_logs
    const [feedItemsResult, puzzleLogsResult] = await Promise.all([
      // Get feed items for this user
      supabase
        .from('feed_items')
        .select(`
          id,
          type,
          text,
          image_url,
          media_urls,
          created_at,
          target_puzzle:puzzles!target_puzzle_id(
            id,
            title,
            image_url,
            piece_count,
            brand:brands!brand_id(name)
          ),
          target_review:reviews!target_review_id(
            id,
            rating,
            review_text
          ),
          target_puzzle_log:puzzle_logs!target_puzzle_log_id(
            id,
            status,
            solve_time_seconds,
            user_rating,
            progress_percentage
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(Math.ceil(limit / 2)),

      // Get recent puzzle logs that might not have feed items yet
      supabase
        .from('puzzle_logs')
        .select(`
          id,
          status,
          solve_time_seconds,
          user_rating,
          progress_percentage,
          note,
          photo_urls,
          updated_at,
          logged_at,
          puzzle:puzzles!puzzle_id(
            id,
            title,
            image_url,
            piece_count,
            brand:brands!brand_id(name)
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(Math.ceil(limit / 2))
    ])

    const feedItems = feedItemsResult.data || []
    const puzzleLogs = puzzleLogsResult.data || []


    // Format activities for the frontend
    const activities: any[] = []

    // Process feed items
    feedItems.forEach((item, index) => {
      const puzzle = Array.isArray(item.target_puzzle) ? item.target_puzzle[0] : item.target_puzzle
      const brand = puzzle?.brand ? (Array.isArray(puzzle.brand) ? puzzle.brand[0] : puzzle.brand) : null
      const review = Array.isArray(item.target_review) ? item.target_review[0] : item.target_review
      const puzzleLog = Array.isArray(item.target_puzzle_log) ? item.target_puzzle_log[0] : item.target_puzzle_log


      let content = item.text || ''
      let metadata: any = {}

      switch (item.type) {
        case 'review':
          content = content || 'Wrote a review for this puzzle'
          if (review) {
            metadata.rating = review.rating
          }
          break
        case 'solved':
          content = content || 'Completed this puzzle!'
          if (puzzleLog) {
            metadata.solveTime = puzzleLog.solve_time_seconds ? formatSolveTime(puzzleLog.solve_time_seconds) : null
            metadata.rating = puzzleLog.user_rating
          }
          break
        case 'puzzle_log':
          content = content || 'Updated progress on this puzzle'
          if (puzzleLog) {
            metadata.progress = puzzleLog.progress_percentage
          }
          break
        case 'add_to_list':
          content = content || 'Added puzzle to library'
          break
        default:
          content = content || 'Activity update'
      }

      activities.push({
        id: item.id,
        type: item.type,
        user: {
          id: user.clerk_id || user.id,
          name: user.username || user.email?.split('@')[0] || 'User',
          username: user.username || user.email?.split('@')[0] || 'user',
          avatar: user.avatar_url || ''
        },
        puzzle: puzzle ? {
          id: puzzle.id,
          title: puzzle.title,
          image: puzzle.image_url || '/placeholder-puzzle.svg',
          brand: brand?.name || 'Unknown Brand',
          pieceCount: puzzle.piece_count || 0
        } : null,
        content,
        timestamp: formatTimestamp(item.created_at),
        metadata,
        media_urls: item.media_urls || []
      })
    })

    // Process recent puzzle logs that might not have corresponding feed items
    puzzleLogs.forEach(log => {
      // Check if we already have a feed item for this log
      const existingFeedItem = activities.find(activity => 
        activity.type === 'puzzle_log' && 
        activity.metadata?.puzzleLogId === log.id
      )

      if (!existingFeedItem) {
        const puzzle = Array.isArray(log.puzzle) ? log.puzzle[0] : log.puzzle
        const brand = puzzle?.brand ? (Array.isArray(puzzle.brand) ? puzzle.brand[0] : puzzle.brand) : null

        let content = ''
        let type = 'puzzle_log'
        let metadata: any = {}

        if (log.status === 'completed') {
          content = 'Completed this puzzle!'
          type = 'solved'
          metadata.solveTime = log.solve_time_seconds ? formatSolveTime(log.solve_time_seconds) : null
          metadata.rating = log.user_rating
        } else if (log.progress_percentage > 0) {
          content = `Updated progress on this puzzle`
          metadata.progress = log.progress_percentage
        } else {
          content = `${log.status.replace('_', ' ')} this puzzle`
        }

        activities.push({
          id: `log_${log.id}`,
          type,
          user: {
            id: user.clerk_id || user.id,
            name: user.username || user.email?.split('@')[0] || 'User',
            username: user.username || user.email?.split('@')[0] || 'user',
            avatar: user.avatar_url || ''
          },
          puzzle: puzzle ? {
            id: puzzle.id,
            title: puzzle.title,
            image: puzzle.image_url || '/placeholder-puzzle.svg',
            brand: brand?.name || 'Unknown Brand',
            pieceCount: puzzle.piece_count || 0
          } : null,
          content,
          timestamp: formatTimestamp(log.updated_at || log.logged_at),
          metadata,
          media_urls: log.photo_urls || []
        })
      }
    })

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => {
      const timeA = parseTimestamp(a.timestamp)
      const timeB = parseTimestamp(b.timestamp)
      return timeB - timeA
    })

    // Limit results
    const limitedActivities = activities.slice(0, limit)


    return NextResponse.json({ activities: limitedActivities })

  } catch (error) {
    console.error('Error in user activity API:', error)
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

// Helper function to format timestamps
function formatTimestamp(timestamp: string): string {
  const now = new Date()
  const activityTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`
  
  return 'over a month ago'
}

// Helper function to parse timestamp back to milliseconds for sorting
function parseTimestamp(timestamp: string): number {
  if (timestamp === 'just now') return Date.now()
  
  const match = timestamp.match(/(\d+)([mhdw]) ago/)
  if (!match) return 0
  
  const [, value, unit] = match
  const num = parseInt(value)
  const now = Date.now()
  
  switch (unit) {
    case 'm': return now - (num * 60 * 1000)
    case 'h': return now - (num * 60 * 60 * 1000)
    case 'd': return now - (num * 24 * 60 * 60 * 1000)
    case 'w': return now - (num * 7 * 24 * 60 * 60 * 1000)
    default: return 0
  }
}