import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/users/discover - Enhanced user discovery with sorting and rich data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const sortBy = searchParams.get('sort') || 'followers'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = (page - 1) * limit

    const supabaseService = createServiceClient()

    // Build the base query
    let userQuery = supabaseService
      .from('users')
      .select(`
        id,
        clerk_id,
        username,
        email,
        avatar_url,
        bio,
        followers_count,
        following_count,
        created_at
      `)

    // Apply search filter if query exists
    if (query && query.trim().length >= 2) {
      userQuery = userQuery.or(`username.ilike.%${query}%,email.ilike.%${query}%`)
    }

    // Apply sorting
    switch (sortBy) {
      case 'followers':
        userQuery = userQuery.order('followers_count', { ascending: false })
        break
      case 'newest':
        userQuery = userQuery.order('created_at', { ascending: false })
        break
      case 'active':
        // We'll sort by follower count for now and enhance with activity later
        userQuery = userQuery.order('followers_count', { ascending: false })
        break
      default:
        userQuery = userQuery.order('followers_count', { ascending: false })
    }

    // Apply pagination
    userQuery = userQuery.range(offset, offset + limit - 1)

    const { data: users, error: usersError } = await userQuery

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        users: [],
        total: 0,
        page,
        limit,
        hasMore: false,
        sortBy
      })
    }

    // Get user IDs for batch queries
    const userIds = users.map(user => user.id)

    // Batch fetch user stats
    const [puzzleStatsData, puzzleOwnershipData, reviewStatsData, activityData] = await Promise.all([
      // Puzzle completion stats
      supabaseService
        .from('puzzle_logs')
        .select(`
          user_id,
          status,
          solve_time_seconds,
          puzzle:puzzles!puzzle_id(piece_count)
        `)
        .in('user_id', userIds)
        .eq('status', 'completed'),

      // Puzzle ownership stats (all puzzles in user's library)
      supabaseService
        .from('puzzle_logs')
        .select('user_id')
        .in('user_id', userIds),

      // Review stats
      supabaseService
        .from('reviews')
        .select('user_id, rating')
        .in('user_id', userIds),

      // Recent activity
      supabaseService
        .from('feed_items')
        .select(`
          user_id,
          type,
          text,
          created_at,
          target_puzzle:puzzles!target_puzzle_id(title),
          target_review:reviews!target_review_id(rating)
        `)
        .in('user_id', userIds)
        .order('created_at', { ascending: false })
        .limit(userIds.length * 3) // Get up to 3 activities per user
    ])

    // Process stats for each user
    const userStatsMap = new Map()
    const userActivityMap = new Map()

    // Initialize stats for all users
    userIds.forEach(userId => {
      userStatsMap.set(userId, {
        puzzles_owned: 0,
        puzzles_completed: 0,
        total_pieces: 0,
        avg_solve_time: 0,
        solve_times: [],
        reviews_count: 0
      })
    })

    // Process puzzle ownership (count unique puzzles in user's library)
    const ownershipCounts = new Map()
    puzzleOwnershipData.data?.forEach(log => {
      ownershipCounts.set(log.user_id, (ownershipCounts.get(log.user_id) || 0) + 1)
    })

    // Update ownership counts
    ownershipCounts.forEach((count, userId) => {
      if (userStatsMap.has(userId)) {
        userStatsMap.get(userId).puzzles_owned = count
      }
    })

    // Process puzzle completion stats
    puzzleStatsData.data?.forEach(log => {
      const stats = userStatsMap.get(log.user_id)
      if (stats) {
        stats.puzzles_completed++
        const puzzle = Array.isArray(log.puzzle) ? log.puzzle[0] : log.puzzle
        stats.total_pieces += puzzle?.piece_count || 0
        
        if (log.solve_time_seconds) {
          stats.solve_times.push(log.solve_time_seconds)
        }
      }
    })

    // Process review stats
    reviewStatsData.data?.forEach(review => {
      const stats = userStatsMap.get(review.user_id)
      if (stats) {
        stats.reviews_count++
      }
    })

    // Calculate averages
    userStatsMap.forEach((stats, userId) => {
      if (stats.solve_times && stats.solve_times.length > 0) {
        stats.avg_solve_time_hours = Math.round(
          stats.solve_times.reduce((sum: number, time: number) => sum + time, 0) / stats.solve_times.length / 3600
        ) // Convert to hours
      }
      
      // Clean up arrays we don't need in response
      delete stats.solve_times
    })

    // Process recent activity
    activityData.data?.forEach(activity => {
      if (!userActivityMap.has(activity.user_id)) {
        userActivityMap.set(activity.user_id, [])
      }
      
      const userActivities = userActivityMap.get(activity.user_id)
      if (userActivities.length < 3) { // Limit to 3 activities per user
        const targetPuzzle = Array.isArray(activity.target_puzzle) ? activity.target_puzzle[0] : activity.target_puzzle
        const targetReview = Array.isArray(activity.target_review) ? activity.target_review[0] : activity.target_review
        userActivities.push({
          type: activity.type,
          text: activity.text,
          created_at: activity.created_at,
          puzzle_title: targetPuzzle?.title,
          review_rating: targetReview?.rating
        })
      }
    })

    // Format final user data
    const enhancedUsers = users.map(user => {
      const stats = userStatsMap.get(user.id) || {
        puzzles_owned: 0,
        puzzles_completed: 0,
        total_pieces: 0,
        avg_solve_time_hours: 0,
        reviews_count: 0
      }
      
      const recentActivity = userActivityMap.get(user.id) || []

      return {
        id: user.clerk_id,
        name: user.username || user.email.split('@')[0],
        username: user.username || user.email.split('@')[0],
        email: user.email,
        avatar: user.avatar_url,
        bio: user.bio,
        followers_count: user.followers_count,
        following_count: user.following_count,
        joined: user.created_at,
        stats: {
          puzzles_owned: stats.puzzles_owned || 0,
          puzzles_completed: stats.puzzles_completed || 0,
          total_pieces: stats.total_pieces || 0,
          avg_solve_time_hours: stats.avg_solve_time_hours || 0,
          reviews_count: stats.reviews_count || 0
        },
        recent_activity: recentActivity
      }
    })

    // Sort by additional criteria if needed
    if (sortBy === 'puzzles') {
      enhancedUsers.sort((a, b) => b.stats.puzzles_completed - a.stats.puzzles_completed)
    } else if (sortBy === 'reviews') {
      enhancedUsers.sort((a, b) => b.stats.reviews_count - a.stats.reviews_count)
    } else if (sortBy === 'speed') {
      enhancedUsers.sort((a, b) => {
        // Sort by fastest (lowest time), but put users with no solve time at end
        if (a.stats.avg_solve_time_hours === 0) return 1
        if (b.stats.avg_solve_time_hours === 0) return -1
        return a.stats.avg_solve_time_hours - b.stats.avg_solve_time_hours
      })
    }

    const hasMore = users.length === limit

    return NextResponse.json({
      users: enhancedUsers,
      total: enhancedUsers.length,
      page,
      limit,
      hasMore,
      sortBy,
      query: query.trim() || null
    })

  } catch (error) {
    console.error('Error in discover endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}