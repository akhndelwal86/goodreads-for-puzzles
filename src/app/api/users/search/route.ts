import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/users/search - Search for users by username or email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        users: [],
        message: 'Search query must be at least 2 characters'
      })
    }

    const supabaseService = createServiceClient()
    
    // Search users by username or email
    const { data: users, error } = await supabaseService
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
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
      .order('followers_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error searching users:', error)
      return NextResponse.json({ error: 'Failed to search users' }, { status: 500 })
    }

    // Format users for display
    const formattedUsers = users?.map(user => ({
      id: user.clerk_id,
      name: user.username || user.email.split('@')[0],
      username: user.username || user.email.split('@')[0],
      email: user.email,
      avatar: user.avatar_url,
      bio: user.bio,
      followers_count: user.followers_count,
      following_count: user.following_count,
      joined: user.created_at
    })) || []

    return NextResponse.json({
      users: formattedUsers,
      total: formattedUsers.length,
      query: query.trim()
    })

  } catch (error) {
    console.error('Error in user search endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}