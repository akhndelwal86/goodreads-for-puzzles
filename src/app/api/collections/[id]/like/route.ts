import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

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

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if collection exists
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id, visibility')
      .eq('id', collectionId)
      .single()

    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('collection_likes')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('user_id', userData.id)
      .single()

    if (existingLike) {
      return NextResponse.json({ 
        message: 'Already liked this collection',
        is_liked: true 
      })
    }

    // Add like
    const { error: likeError } = await supabase
      .from('collection_likes')
      .insert({
        collection_id: collectionId,
        user_id: userData.id
      })

    if (likeError) {
      console.error('Error liking collection:', likeError)
      return NextResponse.json({ error: 'Failed to like collection' }, { status: 500 })
    }

    // Update likes count
    const { error: updateError } = await supabase
      .rpc('increment_likes_count', { collection_id: collectionId })

    if (updateError) {
      console.error('Error updating likes count:', updateError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully liked collection',
      is_liked: true 
    })

  } catch (error) {
    console.error('Error liking collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove like
    const { error: unlikeError } = await supabase
      .from('collection_likes')
      .delete()
      .eq('collection_id', collectionId)
      .eq('user_id', userData.id)

    if (unlikeError) {
      console.error('Error unliking collection:', unlikeError)
      return NextResponse.json({ error: 'Failed to unlike collection' }, { status: 500 })
    }

    // Update likes count
    const { error: updateError } = await supabase
      .rpc('decrement_likes_count', { collection_id: collectionId })

    if (updateError) {
      console.error('Error updating likes count:', updateError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unliked collection',
      is_liked: false 
    })

  } catch (error) {
    console.error('Error unliking collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}