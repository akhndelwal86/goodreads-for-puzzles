import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

// POST /api/users/[userId]/follow - Follow a user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: sessionUserId } = await auth()
    const supabaseService = createServiceClient()
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { userId: targetUserId } = await params

    if (sessionUserId === targetUserId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Get current user's database ID
    const { data: currentUser, error: currentUserError } = await supabaseService
      .from('users')
      .select('id')
      .eq('clerk_id', sessionUserId)
      .single()

    if (currentUserError || !currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 })
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

    // Check if already following
    const { data: existingFollow } = await supabaseService
      .from('follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('followed_user_id', targetUser.id)
      .single()

    if (existingFollow) {
      return NextResponse.json({ error: 'Already following this user' }, { status: 400 })
    }

    // Create follow relationship
    const { data: follow, error: followError } = await supabaseService
      .from('follows')
      .insert({
        follower_id: currentUser.id,
        followed_user_id: targetUser.id
      })
      .select()
      .single()

    if (followError) {
      console.error('Error creating follow:', followError)
      return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      follow,
      message: 'Successfully followed user' 
    })

  } catch (error) {
    console.error('Error in follow endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/users/[userId]/follow - Unfollow a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: sessionUserId } = await auth()
    const supabaseService = createServiceClient()
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { userId: targetUserId } = await params

    // Get current user's database ID
    const { data: currentUser, error: currentUserError } = await supabaseService
      .from('users')
      .select('id')
      .eq('clerk_id', sessionUserId)
      .single()

    if (currentUserError || !currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 })
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

    // Delete follow relationship
    const { error: deleteError } = await supabaseService
      .from('follows')
      .delete()
      .eq('follower_id', currentUser.id)
      .eq('followed_user_id', targetUser.id)

    if (deleteError) {
      console.error('Error deleting follow:', deleteError)
      return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully unfollowed user' 
    })

  } catch (error) {
    console.error('Error in unfollow endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}