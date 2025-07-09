import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: activityId } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, activityType, parentCommentId } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ 
        error: 'Comment content is required' 
      }, { status: 400 })
    }

    if (!activityType) {
      return NextResponse.json({ 
        error: 'Activity type is required' 
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

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        activity_id: activityId,
        activity_type: activityType,
        content: content.trim(),
        parent_comment_id: parentCommentId || null
      })
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

    if (commentError) {
      console.error('Error creating comment:', commentError)
      return NextResponse.json({ 
        error: 'Failed to create comment' 
      }, { status: 500 })
    }

    // Get updated comment count
    const { data: commentCount, error: countError } = await supabase
      .rpc('get_comment_count', {
        p_activity_id: activityId,
        p_activity_type: activityType
      })

    if (countError) {
      console.error('Error getting comment count:', countError)
    }

    // Debug logging for comment creation
    console.log('🔍 Debug comment creation user data:', {
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
      },
      commentCount: commentCount || 0
    })

  } catch (error) {
    console.error('Error in comment creation API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: activityId } = await params
    
    const { searchParams } = new URL(request.url)
    const activityType = searchParams.get('activityType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    if (!activityType) {
      return NextResponse.json({ 
        error: 'Activity type is required' 
      }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get comments with user information
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
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
      .eq('activity_id', activityId)
      .eq('activity_type', activityType)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (commentsError) {
      console.error('Error fetching comments:', commentsError)
      return NextResponse.json({ 
        error: 'Failed to fetch comments' 
      }, { status: 500 })
    }

    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('activity_id', activityId)
      .eq('activity_type', activityType)

    if (countError) {
      console.error('Error getting comment count:', countError)
    }

    // Format comments for response
    const formattedComments = comments?.map(comment => {
      // Debug logging for comment fetching
      console.log('🔍 Debug comment fetch user data:', comment.id, {
        raw_user: comment.user,
        is_array: Array.isArray(comment.user),
        username_array: comment.user?.[0]?.username,
        email_array: comment.user?.[0]?.email
      })

      // Handle both array and object cases
      const userData = Array.isArray(comment.user) ? comment.user[0] : comment.user

      return {
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
    }) || []

    return NextResponse.json({
      success: true,
      comments: formattedComments,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
        hasMore: (totalCount || 0) > offset + limit
      }
    })

  } catch (error) {
    console.error('Error in comments fetch API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}