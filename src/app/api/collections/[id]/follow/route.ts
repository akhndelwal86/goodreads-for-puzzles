import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

// POST /api/collections/[id]/follow
// Follow a collection
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const collectionId = resolvedParams.id
    if (!collectionId) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user's internal ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if collection exists (using lists table)
    const { data: collection, error: collectionError } = await supabase
      .from('lists')
      .select('id')
      .eq('id', collectionId)
      .single()

    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Add follow relationship
    const { data: follow, error: followError } = await supabase
      .from('collection_follows')
      .insert({
        user_id: userData.id,
        list_id: collectionId
      })
      .select()
      .single()

    if (followError) {
      // Handle unique constraint violation (already following)
      if (followError.code === '23505') {
        return NextResponse.json({ 
          message: 'Already following this collection',
          isFollowing: true 
        }, { status: 409 })
      }
      console.error('Error following collection:', followError)
      return NextResponse.json({ error: 'Failed to follow collection' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      isFollowing: true,
      follow
    })

  } catch (error) {
    console.error('Error in POST /api/collections/[id]/follow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/collections/[id]/follow  
// Unfollow a collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const collectionId = resolvedParams.id
    if (!collectionId) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user's internal ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove follow relationship
    const { error: unfollowError } = await supabase
      .from('collection_follows')
      .delete()
      .eq('user_id', userData.id)
      .eq('list_id', collectionId)

    if (unfollowError) {
      console.error('Error unfollowing collection:', unfollowError)
      return NextResponse.json({ error: 'Failed to unfollow collection' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      isFollowing: false
    })

  } catch (error) {
    console.error('Error in DELETE /api/collections/[id]/follow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/collections/[id]/follow
// Check if user is following a collection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ isFollowing: false })
    }

    const resolvedParams = await params
    const collectionId = resolvedParams.id
    if (!collectionId) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user's internal ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ isFollowing: false })
    }

    // Check if following
    const { data: follow, error: followError } = await supabase
      .from('collection_follows')
      .select('id')
      .eq('user_id', userData.id)
      .eq('list_id', collectionId)
      .single()

    if (followError && followError.code !== 'PGRST116') {
      console.error('Error checking follow status:', followError)
      return NextResponse.json({ error: 'Failed to check follow status' }, { status: 500 })
    }

    return NextResponse.json({ 
      isFollowing: !!follow
    })

  } catch (error) {
    console.error('Error in GET /api/collections/[id]/follow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}