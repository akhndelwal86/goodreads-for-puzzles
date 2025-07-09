import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()

    // Get current user data
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    // Get all users for debugging
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, clerk_id, username, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent posts with user data
    const { data: recentPosts, error: postsError } = await supabase
      .from('feed_items')
      .select(`
        id,
        type,
        text,
        created_at,
        user:users!user_id(
          id,
          username,
          email,
          clerk_id
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      currentUser,
      currentUserError,
      allUsers,
      allUsersError,
      recentPosts,
      postsError,
      debug: {
        clerkUserId: userId,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error in debug API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}