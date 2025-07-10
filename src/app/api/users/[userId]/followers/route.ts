import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/users/[userId]/followers - Get a user's followers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabaseService = createServiceClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = (page - 1) * limit

    const { userId: targetUserId } = await params

    // Get target user's database ID
    const { data: targetUser, error: targetUserError } = await supabaseService
      .from('users')
      .select('id')
      .eq('clerk_id', targetUserId)
      .single()

    if (targetUserError || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get followers with pagination
    const { data: followers, error: followersError } = await supabaseService
      .from('follows')
      .select(`
        id,
        created_at,
        follower:users!follows_follower_id_fkey (
          id,
          clerk_id,
          username,
          email,
          avatar_url,
          bio,
          followers_count,
          following_count,
          created_at
        )
      `)
      .eq('followed_user_id', targetUser.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (followersError) {
      console.error('Error fetching followers:', followersError)
      return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseService
      .from('follows')
      .select('id', { count: 'exact' })
      .eq('followed_user_id', targetUser.id)

    if (countError) {
      console.error('Error counting followers:', countError)
      return NextResponse.json({ error: 'Failed to count followers' }, { status: 500 })
    }

    const hasMore = offset + limit < (totalCount || 0)

    return NextResponse.json({
      followers: followers || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error in followers endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}