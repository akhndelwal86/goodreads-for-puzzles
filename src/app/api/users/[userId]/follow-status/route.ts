import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/users/[userId]/follow-status - Check if current user follows target user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: sessionUserId } = await auth()
    const supabaseService = createServiceClient()
    
    if (!sessionUserId) {
      return NextResponse.json({ isFollowing: false })
    }

    const { userId: targetUserId } = await params

    if (sessionUserId === targetUserId) {
      return NextResponse.json({ isFollowing: false, isSelf: true })
    }

    // Get current user's database ID
    const { data: currentUser, error: currentUserError } = await supabaseService
      .from('users')
      .select('id')
      .eq('clerk_id', sessionUserId)
      .single()

    if (currentUserError || !currentUser) {
      return NextResponse.json({ isFollowing: false })
    }

    // Get target user's database ID
    const { data: targetUser, error: targetUserError } = await supabaseService
      .from('users')
      .select('id')
      .eq('clerk_id', targetUserId)
      .single()

    if (targetUserError || !targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    // Check if following
    const { data: follow, error: followError } = await supabaseService
      .from('follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('followed_user_id', targetUser.id)
      .single()

    if (followError && followError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking follow status:', followError)
      return NextResponse.json({ error: 'Failed to check follow status' }, { status: 500 })
    }

    return NextResponse.json({ 
      isFollowing: !!follow,
      isSelf: false
    })

  } catch (error) {
    console.error('Error in follow-status endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}