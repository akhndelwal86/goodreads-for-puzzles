import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: commentId } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ 
        error: 'Comment content is required' 
      }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user from database using clerk_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Update comment (RLS policy ensures user can only update their own comments)
    const { data: comment, error: updateError } = await supabase
      .from('comments')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('user_id', user.id) // Extra security check
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_comment_id,
        user:users!user_id(
          id,
          username,
          email,
          avatar_url
        )
      `)
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ 
          error: 'Comment not found or you do not have permission to edit it' 
        }, { status: 404 })
      }
      console.error('Error updating comment:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update comment' 
      }, { status: 500 })
    }

    // Debug logging for comment update
    console.log('🔍 Debug comment update user data:', {
      raw_user: comment.user,
      is_array: Array.isArray(comment.user),
      username_array: comment.user?.[0]?.username,
      email_array: comment.user?.[0]?.email
    })

    // Handle both array and object cases
    const userData = Array.isArray(comment.user) ? comment.user[0] : comment.user

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        parentCommentId: comment.parent_comment_id,
        user: {
          id: userData?.id,
          username: userData?.username || userData?.email?.split('@')[0] || 'User',
          avatar: userData?.avatar_url
        }
      }
    })

  } catch (error) {
    console.error('Error in comment update API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: commentId } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()

    // Get user from database using clerk_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Get comment info before deletion for response
    const { data: commentInfo, error: infoError } = await supabase
      .from('comments')
      .select('activity_id, activity_type, user_id')
      .eq('id', commentId)
      .eq('user_id', user.id) // Security check
      .single()

    if (infoError || !commentInfo) {
      return NextResponse.json({ 
        error: 'Comment not found or you do not have permission to delete it' 
      }, { status: 404 })
    }

    // Delete comment (RLS policy ensures user can only delete their own comments)
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id) // Extra security check

    if (deleteError) {
      console.error('Error deleting comment:', deleteError)
      return NextResponse.json({ 
        error: 'Failed to delete comment' 
      }, { status: 500 })
    }

    // Get updated comment count
    const { data: commentCount, error: countError } = await supabase
      .rpc('get_comment_count', {
        p_activity_id: commentInfo.activity_id,
        p_activity_type: commentInfo.activity_type
      })

    if (countError) {
      console.error('Error getting comment count:', countError)
    }

    return NextResponse.json({
      success: true,
      commentCount: commentCount || 0,
      message: 'Comment deleted successfully'
    })

  } catch (error) {
    console.error('Error in comment deletion API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}