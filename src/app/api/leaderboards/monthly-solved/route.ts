import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServiceClient()
    
    // Get start of current month
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    // Get users with most completed puzzles this month
    const { data: monthlyData, error } = await supabase
      .from('puzzle_logs')
      .select(`
        user_id,
        users!user_id(
          id,
          username,
          avatar_url,
          clerk_id
        )
      `)
      .eq('status', 'completed')
      .gte('updated_at', monthStart.toISOString())
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching monthly solved data:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 })
    }

    // Count puzzles solved per user
    const userCounts = new Map<string, { count: number; user: any }>()
    
    monthlyData?.forEach(log => {
      const userId = log.user_id
      const userData = Array.isArray(log.users) ? log.users[0] : log.users
      
      if (userData) {
        const existing = userCounts.get(userId)
        if (existing) {
          existing.count += 1
        } else {
          userCounts.set(userId, { count: 1, user: userData })
        }
      }
    })

    // Convert to array and sort by count
    const leaderboard = Array.from(userCounts.entries())
      .map(([userId, data]) => ({
        id: userId,
        name: data.user.username || 'Anonymous',
        username: data.user.username || 'anonymous',
        avatar: data.user.avatar_url || '',
        puzzlesSolved: data.count,
        badge: undefined as 'gold' | 'silver' | 'bronze' | undefined
      }))
      .sort((a, b) => b.puzzlesSolved - a.puzzlesSolved)
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
      period: 'This Month',
      title: 'Most Solved This Month'
    })

  } catch (error) {
    console.error('Error in monthly solved leaderboard API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}