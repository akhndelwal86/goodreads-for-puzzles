import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createServiceClient()

    // Get collection with detailed information
    const { data: collection, error } = await supabase
      .from('collections')
      .select(`
        *,
        users:user_id(id, username, avatar_url),
        collection_items(
          id,
          added_at,
          puzzles(
            id,
            title,
            image_url,
            piece_count,
            theme,
            brands(name)
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check if user has permission to view this collection
    const { userId: clerkUserId } = await auth()
    let canView = collection.visibility === 'public'

    if (clerkUserId && !canView) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single()

      if (userData) {
        // User can view their own collections or friends-only if they're friends
        canView = collection.user_id === userData.id || collection.visibility === 'friends-only'
      }
    }

    if (!canView) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Get collection statistics
    const puzzles = collection.collection_items || []
    const totalPieces = puzzles.reduce((sum: number, item: any) => 
      sum + (item.puzzles?.piece_count || 0), 0)

    // Check if current user follows/likes this collection
    let isFollowing = false
    let isLiked = false

    if (clerkUserId) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single()

      if (userData) {
        const [followResult, likeResult] = await Promise.all([
          supabase
            .from('collection_followers')
            .select('id')
            .eq('collection_id', id)
            .eq('user_id', userData.id)
            .single(),
          supabase
            .from('collection_likes')
            .select('id')
            .eq('collection_id', id)
            .eq('user_id', userData.id)
            .single()
        ])

        isFollowing = !followResult.error
        isLiked = !likeResult.error
      }
    }

    const enrichedCollection = {
      ...collection,
      puzzle_count: puzzles.length,
      total_pieces: totalPieces,
      is_following: isFollowing,
      is_liked: isLiked
    }

    return NextResponse.json({ collection: enrichedCollection })

  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      theme,
      visibility,
      coverImageUrl,
      creatorNotes,
      tags
    } = body

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

    // Check if user owns this collection
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('user_id, collection_type')
      .eq('id', id)
      .single()

    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    if (collection.user_id !== userData.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update collection
    const updateData: any = {
      last_updated_at: new Date().toISOString()
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (theme !== undefined) updateData.theme = theme
    if (visibility !== undefined) {
      updateData.visibility = visibility
      updateData.published_at = visibility === 'public' ? new Date().toISOString() : null
    }
    if (coverImageUrl !== undefined) updateData.cover_image_url = coverImageUrl
    if (creatorNotes !== undefined) updateData.creator_notes = creatorNotes
    if (tags !== undefined) updateData.tags = tags

    const { data: updatedCollection, error: updateError } = await supabase
      .from('collections')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating collection:', updateError)
      return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 })
    }

    return NextResponse.json({ success: true, collection: updatedCollection })

  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Check if user owns this collection
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('user_id, collection_type, name')
      .eq('id', id)
      .single()

    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    if (collection.user_id !== userData.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Don't allow deletion of official collections
    if (collection.collection_type === 'official') {
      return NextResponse.json({ error: 'Cannot delete official collections' }, { status: 403 })
    }

    // Delete collection (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting collection:', deleteError)
      return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Collection deleted successfully' })

  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}