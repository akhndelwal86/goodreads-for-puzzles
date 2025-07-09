import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServiceClient()
    
    // Get completed puzzle logs with solve times
    const { data: completionData, error } = await supabase
      .from('puzzle_logs')
      .select(`
        user_id,
        solve_time_seconds,
        users!user_id(
          id,
          username,
          avatar_url,
          clerk_id
        )
      `)
      .eq('status', 'completed')
      .not('solve_time_seconds', 'is', null)
      .gt('solve_time_seconds', 0) // Only positive solve times
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching speed data:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 })
    }

    // Calculate average solve times per user
    const userStats = new Map<string, { 
      totalTime: number; 
      count: number; 
      avgTime: number; 
      user: any;
      fastestTime: number;
    }>()
    
    completionData?.forEach(log => {
      const userId = log.user_id
      const userData = Array.isArray(log.users) ? log.users[0] : log.users
      const solveTime = log.solve_time_seconds
      
      if (userData && solveTime) {
        const existing = userStats.get(userId)
        if (existing) {
          existing.totalTime += solveTime
          existing.count += 1
          existing.avgTime = existing.totalTime / existing.count
          existing.fastestTime = Math.min(existing.fastestTime, solveTime)
        } else {
          userStats.set(userId, { 
            totalTime: solveTime, 
            count: 1, 
            avgTime: solveTime,
            user: userData,
            fastestTime: solveTime
          })
        }
      }
    })

    // Helper function to format time
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}m`
    }

    // Convert to array and sort by average time (fastest first)
    const leaderboard = Array.from(userStats.entries())
      .filter(([_, stats]) => stats.count >= 3) // Only users with at least 3 completed puzzles
      .map(([userId, stats]) => ({
        id: userId,
        name: stats.user.username || 'Anonymous',
        username: stats.user.username || 'anonymous',
        avatar: stats.user.avatar_url || '',
        puzzlesSolved: stats.count, // Number of puzzles completed
        avgTime: stats.avgTime,
        avgTimeFormatted: formatTime(stats.avgTime),
        fastestTime: stats.fastestTime,
        fastestTimeFormatted: formatTime(stats.fastestTime),
        badge: undefined as 'gold' | 'silver' | 'bronze' | undefined
      }))
      .sort((a, b) => a.avgTime - b.avgTime) // Sort by average time (fastest first)
      .slice(0, 10) // Top 10

    // Add badges for top 3
    leaderboard.forEach((user, index) => {
      user.badge = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : undefined
    })

    // Add rank numbers
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }))

    return NextResponse.json({
      success: true,
      leaderboard: rankedLeaderboard,
      period: 'All Time',
      title: 'Speed Champions'
    })

  } catch (error) {
    console.error('Error in speed champions leaderboard API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}