import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')
    const feedType = searchParams.get('type') || 'all'
    const { userId: clerkUserId } = await auth()

    // Build base query
    let query = supabase
      .from('feed_items')
      .select(`
        id,
        type,
        text,
        image_url,
        media_urls,
        created_at,
        user_id,
        user:users!user_id(
          id,
          username,
          avatar_url,
          email,
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
          user_rating,
          progress_percentage
        )
      `)

    // Apply filters based on feed type
    if (feedType === 'following' && clerkUserId) {
      // Get the user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single()

      if (userData) {
        // Get users that the current user follows
        const { data: followingUsers } = await supabase
          .from('follows')
          .select('followed_user_id')
          .eq('follower_id', userData.id)

        const followingUserIds = followingUsers?.map(f => f.followed_user_id) || []
        
        if (followingUserIds.length > 0) {
          query = query.in('user_id', followingUserIds)
        } else {
          // If not following anyone, return empty result
          return NextResponse.json({ activities: [] })
        }
      }
    } else if (feedType === 'personal' && clerkUserId) {
      // Get the user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single()

      if (userData) {
        query = query.eq('user_id', userData.id)
      } else {
        // If user not found, return empty result
        return NextResponse.json({ activities: [] })
      }
    }
    // For 'all' type, no additional filtering needed

    // Execute the query
    const { data: feedItems, error: feedError } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (feedError) {
      console.error('Error fetching feed items:', feedError)
      return NextResponse.json({ error: 'Failed to fetch activity feed' }, { status: 500 })
    }

    // Get like and comment counts for all feed items
    const activityIds = feedItems?.map(item => item.id) || []
    const likeCounts = new Map<string, number>()
    const commentCounts = new Map<string, number>()

    if (activityIds.length > 0) {
      // Batch fetch like counts
      const { data: likes } = await supabase
        .from('likes')
        .select('activity_id')
        .in('activity_id', activityIds)
        .eq('activity_type', 'feed_item')

      // Count likes per activity
      likes?.forEach(like => {
        likeCounts.set(like.activity_id, (likeCounts.get(like.activity_id) || 0) + 1)
      })

      // Batch fetch comment counts
      const { data: comments } = await supabase
        .from('comments')
        .select('activity_id')
        .in('activity_id', activityIds)
        .eq('activity_type', 'feed_item')

      // Count comments per activity
      comments?.forEach(comment => {
        commentCounts.set(comment.activity_id, (commentCounts.get(comment.activity_id) || 0) + 1)
      })
    }

    // Format activities for the frontend
    const activities = feedItems?.map(item => {
      
      // Handle both array and object cases
      const userData = Array.isArray(item.user) ? item.user[0] : item.user
      
      const baseActivity = {
        id: item.id,
        type: item.type,
        user: {
          id: userData?.clerk_id || userData?.id || '',
          name: userData?.username || userData?.email?.split('@')[0] || 'User',
          username: userData?.username || userData?.email?.split('@')[0] || 'user',
          avatar: userData?.avatar_url || '',
          clerk_id: userData?.clerk_id
        },
        timestamp: formatTimestamp(item.created_at),
        content: item.text || ''
      }

      // Handle different activity types
      switch (item.type) {
        case 'review':
          const reviewPuzzle = Array.isArray(item.target_puzzle) ? item.target_puzzle[0] : item.target_puzzle
          const reviewBrand = reviewPuzzle?.brand ? (Array.isArray(reviewPuzzle.brand) ? reviewPuzzle.brand[0] : reviewPuzzle.brand) : null
          const reviewData = Array.isArray(item.target_review) ? item.target_review[0] : item.target_review
          
          return {
            ...baseActivity,
            puzzle: reviewPuzzle ? {
              id: reviewPuzzle.id,
              title: reviewPuzzle.title,
              brand: reviewBrand?.name || 'Unknown Brand',
              image: reviewPuzzle.image_url || '/placeholder-puzzle.svg',
              pieceCount: reviewPuzzle.piece_count || 0,
              difficulty: getDifficultyFromRating(reviewData?.rating),
              rating: reviewData?.rating || 0
            } : null,
            stats: {
              hours: 0, // Will be calculated from solve time if available
              likes: likeCounts.get(item.id) || 0,
              comments: commentCounts.get(item.id) || 0
            },
            metadata: {
              rating: reviewData?.rating
            }
          }

        case 'solved':
          const solvedPuzzle = Array.isArray(item.target_puzzle) ? item.target_puzzle[0] : item.target_puzzle
          const solvedBrand = solvedPuzzle?.brand ? (Array.isArray(solvedPuzzle.brand) ? solvedPuzzle.brand[0] : solvedPuzzle.brand) : null
          const solvedLog = Array.isArray(item.target_puzzle_log) ? item.target_puzzle_log[0] : item.target_puzzle_log
          
          return {
            ...baseActivity,
            type: 'completion',
            puzzle: solvedPuzzle ? {
              id: solvedPuzzle.id,
              title: solvedPuzzle.title,
              brand: solvedBrand?.name || 'Unknown Brand',
              image: solvedPuzzle.image_url || '/placeholder-puzzle.svg',
              pieceCount: solvedPuzzle.piece_count || 0,
              difficulty: getDifficultyFromRating(solvedLog?.difficulty_rating),
              rating: solvedLog?.user_rating || 0
            } : null,
            stats: {
              hours: solvedLog?.solve_time_seconds ? 
                Math.round(solvedLog.solve_time_seconds / 3600) : 0,
              likes: likeCounts.get(item.id) || 0,
              comments: commentCounts.get(item.id) || 0
            },
            metadata: {
              rating: solvedLog?.user_rating,
              solveTime: solvedLog?.solve_time_seconds ? formatSolveTime(solvedLog.solve_time_seconds) : null
            }
          }

        case 'post':
          return {
            ...baseActivity,
            type: 'post',
            content: item.text || '',
            media_urls: item.media_urls || [],
            stats: {
              hours: 0,
              likes: likeCounts.get(item.id) || 0,
              comments: commentCounts.get(item.id) || 0
            }
          }

        case 'puzzle_log':
          // Check if this is actually a user post (has text content) from before we had 'post' type
          if (item.text && item.text.trim()) {
            return {
              ...baseActivity,
              type: 'post',
              content: item.text || '',
              media_urls: item.media_urls || [],
              stats: {
                hours: 0,
                likes: likeCounts.get(item.id) || 0,
                comments: commentCounts.get(item.id) || 0
              }
            }
          } else {
            // Regular puzzle log activity
            const logPuzzle = Array.isArray(item.target_puzzle) ? item.target_puzzle[0] : item.target_puzzle
            const logBrand = logPuzzle?.brand ? (Array.isArray(logPuzzle.brand) ? logPuzzle.brand[0] : logPuzzle.brand) : null
            const logData = Array.isArray(item.target_puzzle_log) ? item.target_puzzle_log[0] : item.target_puzzle_log
            
            return {
              ...baseActivity,
              type: 'completion',
              puzzle: logPuzzle ? {
                id: logPuzzle.id,
                title: logPuzzle.title,
                brand: logBrand?.name || 'Unknown Brand',
                image: logPuzzle.image_url || '/placeholder-puzzle.svg',
                pieceCount: logPuzzle.piece_count || 0,
                difficulty: getDifficultyFromRating(logData?.difficulty_rating),
                rating: logData?.user_rating || 0
              } : null,
              stats: {
                hours: logData?.solve_time_seconds ? 
                  Math.round(logData.solve_time_seconds / 3600) : 0,
                likes: likeCounts.get(item.id) || 0,
                comments: commentCounts.get(item.id) || 0
              },
              metadata: {
                progress: logData?.progress_percentage,
                rating: logData?.user_rating,
                solveTime: logData?.solve_time_seconds ? formatSolveTime(logData.solve_time_seconds) : null
              }
            }
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

// Helper function to format solve time
function formatSolveTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return '< 1m'
  }
} 