import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')

    // Fetch recent activity from feed_items with user and target data
    const { data: feedItems, error: feedError } = await supabase
      .from('feed_items')
      .select(`
        id,
        type,
        text,
        image_url,
        media_urls,
        created_at,
        user:users!user_id(
          id,
          username,
          avatar_url,
          clerk_id
        ),
        target_puzzle:puzzles!target_puzzle_id(
          id,
          title,
          image_url,
          piece_count,
          theme,
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
          difficulty_rating,
          user_rating
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (feedError) {
      console.error('Error fetching feed items:', feedError)
      return NextResponse.json({ error: 'Failed to fetch activity feed' }, { status: 500 })
    }

    // Format activities for the frontend
    const activities = feedItems?.map(item => {
      const baseActivity = {
        id: item.id,
        type: item.type,
        user: {
          name: item.user?.[0]?.username || 'Anonymous',
          username: item.user?.[0]?.username || 'unknown',
          avatar: item.user?.[0]?.avatar_url || '',
          clerk_id: item.user?.[0]?.clerk_id
        },
        timestamp: formatTimestamp(item.created_at),
        content: item.text || ''
      }

      // Handle different activity types
      switch (item.type) {
        case 'review':
          return {
            ...baseActivity,
            puzzle: item.target_puzzle?.[0] ? {
              id: item.target_puzzle[0].id,
              title: item.target_puzzle[0].title,
              brand: item.target_puzzle[0].brand?.[0]?.name || 'Unknown Brand',
              image: item.target_puzzle[0].image_url || '/placeholder-puzzle.svg',
              pieceCount: item.target_puzzle[0].piece_count || 0,
              difficulty: getDifficultyFromRating(item.target_review?.[0]?.rating),
              rating: item.target_review?.[0]?.rating || 0
            } : null,
            stats: {
              hours: 0, // Will be calculated from solve time if available
              likes: 0,
              comments: 0
            }
          }

        case 'solved':
          return {
            ...baseActivity,
            type: 'completion',
            puzzle: item.target_puzzle?.[0] ? {
              id: item.target_puzzle[0].id,
              title: item.target_puzzle[0].title,
              brand: item.target_puzzle[0].brand?.[0]?.name || 'Unknown Brand',
              image: item.target_puzzle[0].image_url || '/placeholder-puzzle.svg',
              pieceCount: item.target_puzzle[0].piece_count || 0,
              difficulty: getDifficultyFromRating(item.target_puzzle_log?.[0]?.difficulty_rating),
              rating: item.target_puzzle_log?.[0]?.user_rating || 0
            } : null,
            stats: {
              hours: item.target_puzzle_log?.[0]?.solve_time_seconds ? 
                Math.round(item.target_puzzle_log[0].solve_time_seconds / 3600) : 0,
              likes: 0,
              comments: 0
            }
          }

        case 'post':
          return {
            ...baseActivity,
            type: 'post',
            content: item.text || '',
            media_urls: item.media_urls || []
          }

        case 'add_to_list':
          return {
            ...baseActivity,
            type: 'follow', // Map to existing UI type for now
            content: item.text || 'added a puzzle to their list'
          }

        default:
          return baseActivity
      }
    }) || []

    return NextResponse.json({ activities })

  } catch (error) {
    console.error('Error in activity feed API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

// Helper function to map difficulty rating to text
function getDifficultyFromRating(rating?: number): string {
  if (!rating) return 'Unknown'
  if (rating <= 2) return 'Easy'
  if (rating <= 4) return 'Medium'
  return 'Hard'
} 