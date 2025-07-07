import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export interface HomepageStats {
  totalPuzzles: number
  totalUsers: number
  totalReviews: number
  solvedToday: number
  activeNow: number
}

// Cache for 5 minutes as agreed
export const revalidate = 300

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching homepage statistics...')
    
    const supabase = createServiceClient()
    
    // Get current date boundaries (UTC as agreed)
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
    
    // Get stats for "active now" (last 15 minutes)
    const activeThreshold = new Date(now.getTime() - 15 * 60 * 1000)
    
    console.log('🕐 Date boundaries:', {
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString(),
      activeThreshold: activeThreshold.toISOString()
    })

    // Execute all queries in parallel for better performance
    const [
      totalPuzzlesResult,
      totalUsersResult,
      totalReviewsResult,
      solvedTodayResult,
      activeNowResult
    ] = await Promise.all([
      // Total approved puzzles
      supabase
        .from('puzzles')
        .select('id', { count: 'exact', head: true })
        .eq('approval_status', 'approved'),
      
      // Total users
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true }),
      
      // Total reviews
      supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true }),
      
      // Puzzles solved today (logged_at is today AND status is completed)
      supabase
        .from('puzzle_logs')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('logged_at', todayStart.toISOString())
        .lt('logged_at', todayEnd.toISOString()),
      
      // Active users (updated_at in last 15 minutes)
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .gte('updated_at', activeThreshold.toISOString())
    ])

    // Check for errors
    if (totalPuzzlesResult.error) throw totalPuzzlesResult.error
    if (totalUsersResult.error) throw totalUsersResult.error
    if (totalReviewsResult.error) throw totalReviewsResult.error
    if (solvedTodayResult.error) throw solvedTodayResult.error
    if (activeNowResult.error) throw activeNowResult.error

    const stats: HomepageStats = {
      totalPuzzles: totalPuzzlesResult.count || 0,
      totalUsers: totalUsersResult.count || 0,
      totalReviews: totalReviewsResult.count || 0,
      solvedToday: solvedTodayResult.count || 0,
      activeNow: activeNowResult.count || 0
    }

    console.log('📈 Homepage stats fetched:', stats)

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes
      }
    })

  } catch (error) {
    console.error('❌ Error fetching homepage stats:', error)
    
    // Return fallback stats on error
    const fallbackStats: HomepageStats = {
      totalPuzzles: 0,
      totalUsers: 0,
      totalReviews: 0,
      solvedToday: 0,
      activeNow: 0
    }
    
    return NextResponse.json(fallbackStats, { status: 500 })
  }
} 