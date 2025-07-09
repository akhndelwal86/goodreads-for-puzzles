import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServiceClient()

    // Get user count
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user count:', userError)
    }

    // Get review count  
    const { count: reviewCount, error: reviewError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })

    if (reviewError && reviewError.code !== 'PGRST116') {
      console.error('Error fetching review count:', reviewError)
    }

    // Get feed items count (represents discussions/posts)
    const { count: feedCount, error: feedError } = await supabase
      .from('feed_items')
      .select('*', { count: 'exact', head: true })

    if (feedError && feedError.code !== 'PGRST116') {
      console.error('Error fetching feed items count:', feedError)
    }

    // Get completed puzzle count (challenges/achievements)
    const { count: completedCount, error: completedError } = await supabase
      .from('puzzle_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    if (completedError && completedError.code !== 'PGRST116') {
      console.error('Error fetching completed count:', completedError)
    }

    // Calculate stats with fallbacks for empty database
    const stats = {
      activeMembers: userCount || 0,
      discussions: feedCount || 0, 
      reviews: reviewCount || 0,
      challenges: completedCount || 0
    }

    // If all stats are 0, provide some demo data
    if (stats.activeMembers === 0 && stats.discussions === 0 && stats.reviews === 0 && stats.challenges === 0) {
      return NextResponse.json({
        stats: {
          activeMembers: 1, // At least the current user
          discussions: 0,
          reviews: 0,
          challenges: 0
        },
        isDemo: true
      })
    }

    return NextResponse.json({ stats, isDemo: false })

  } catch (error) {
    console.error('Error in community stats API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 