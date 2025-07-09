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
    
    // Fetch recent activities for this puzzle
    const activities = []
    
    try {
      // Get recent completions from puzzle_logs
      const { data: completions, error: completionError } = await supabase
        .from('puzzle_logs')
        .select(`
          id,
          status,
          updated_at,
          solve_time_seconds,
          user:users!user_id(
            username,
            avatar_url
          )
        `)
        .eq('puzzle_id', id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(3)

      if (!completionError && completions) {
        completions.forEach(completion => {
          activities.push({
            id: completion.id,
            type: 'completed',
            user: completion.user?.username || 'Anonymous',
            avatar: completion.user?.avatar_url || null,
            timestamp: completion.updated_at,
            metadata: {
              solveTime: completion.solve_time_seconds
            }
          })
        })
      }

      // Get recent reviews
      const { data: reviews, error: reviewError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          created_at,
          user:users!user_id(
            username,
            avatar_url
          )
        `)
        .eq('puzzle_id', id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (!reviewError && reviews) {
        reviews.forEach(review => {
          activities.push({
            id: review.id,
            type: 'reviewed',
            user: review.user?.username || 'Anonymous',
            avatar: review.user?.avatar_url || null,
            timestamp: review.created_at,
            metadata: {
              rating: review.rating
            }
          })
        })
      }

      // Get recent wishlist additions (status changes to wishlist)
      const { data: wishlistAdditions, error: wishlistError } = await supabase
        .from('puzzle_logs')
        .select(`
          id,
          status,
          updated_at,
          user:users!user_id(
            username,
            avatar_url
          )
        `)
        .eq('puzzle_id', id)
        .eq('status', 'wishlist')
        .order('updated_at', { ascending: false })
        .limit(2)

      if (!wishlistError && wishlistAdditions) {
        wishlistAdditions.forEach(addition => {
          activities.push({
            id: addition.id,
            type: 'added_to_wishlist',
            user: addition.user?.username || 'Anonymous',
            avatar: addition.user?.avatar_url || null,
            timestamp: addition.updated_at,
            metadata: {}
          })
        })
      }

      // Get recent starts (status changes to in-progress)
      const { data: starts, error: startError } = await supabase
        .from('puzzle_logs')
        .select(`
          id,
          status,
          updated_at,
          user:users!user_id(
            username,
            avatar_url
          )
        `)
        .eq('puzzle_id', id)
        .eq('status', 'in-progress')
        .order('updated_at', { ascending: false })
        .limit(2)

      if (!startError && starts) {
        starts.forEach(start => {
          activities.push({
            id: start.id,
            type: 'started_solving',
            user: start.user?.username || 'Anonymous',
            avatar: start.user?.avatar_url || null,
            timestamp: start.updated_at,
            metadata: {}
          })
        })
      }

    } catch (activityError) {
      console.error('Error fetching activity data:', activityError)
      // Continue with empty activities rather than failing
    }

    // Sort all activities by timestamp and take the most recent 8
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8)

    // Format the response
    const response = {
      activities: sortedActivities.map(activity => ({
        id: activity.id,
        type: activity.type,
        user: activity.user,
        avatar: activity.avatar,
        timestamp: activity.timestamp,
        timeAgo: formatTimeAgo(activity.timestamp),
        metadata: activity.metadata
      }))
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in puzzle activity API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to format timestamps
function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const activityTime = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else if (diffInSeconds < 2592000) { // 30 days
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  } else {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months}mo ago`
  }
}