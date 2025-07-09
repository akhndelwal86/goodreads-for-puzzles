import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServiceClient()
    
    // Get users with their review counts and average ratings
    const { data: reviewData, error } = await supabase
      .from('reviews')
      .select(`
        user_id,
        rating,
        users!user_id(
          id,
          username,
          avatar_url,
          clerk_id
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching review data:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 })
    }

    // Calculate review stats per user
    const userStats = new Map<string, { 
      count: number; 
      totalRating: number; 
      avgRating: number; 
      user: any;
      score: number;
    }>()
    
    reviewData?.forEach(review => {
      const userId = review.user_id
      const userData = Array.isArray(review.users) ? review.users[0] : review.users
      const rating = review.rating || 0
      
      if (userData) {
        const existing = userStats.get(userId)
        if (existing) {
          existing.count += 1
          existing.totalRating += rating
          existing.avgRating = existing.totalRating / existing.count
        } else {
          userStats.set(userId, { 
            count: 1, 
            totalRating: rating, 
            avgRating: rating,
            user: userData,
            score: 0
          })
        }
      }
    })

    // Calculate composite score (review count + quality bonus)
    userStats.forEach((stats, userId) => {
      // Base score from review count
      let score = stats.count * 10
      
      // Quality bonus: higher ratings get bonus points
      if (stats.avgRating >= 4.5) {
        score += stats.count * 3 // 3 bonus points per review for high quality
      } else if (stats.avgRating >= 4.0) {
        score += stats.count * 2 // 2 bonus points per review for good quality
      } else if (stats.avgRating >= 3.5) {
        score += stats.count * 1 // 1 bonus point per review for decent quality
      }
      
      // Minimum reviews threshold to appear on leaderboard
      if (stats.count >= 2) {
        stats.score = score
      }
    })

    // Convert to array and sort by score
    const leaderboard = Array.from(userStats.entries())
      .filter(([_, stats]) => stats.count >= 2) // Only users with at least 2 reviews
      .map(([userId, stats]) => ({
        id: userId,
        name: stats.user.username || 'Anonymous',
        username: stats.user.username || 'anonymous',
        avatar: stats.user.avatar_url || '',
        puzzlesSolved: stats.count, // Using this field to show review count
        reviewCount: stats.count,
        avgRating: Math.round(stats.avgRating * 10) / 10, // Round to 1 decimal
        score: stats.score,
        badge: undefined as 'gold' | 'silver' | 'bronze' | undefined
      }))
      .sort((a, b) => b.score - a.score)
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
      title: 'Top Reviewers'
    })

  } catch (error) {
    console.error('Error in top reviewers leaderboard API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}