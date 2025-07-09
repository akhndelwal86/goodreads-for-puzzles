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

    console.log('🔍 Like API Debug - Starting request:', { activityId, userId })

    if (!userId) {
      console.log('❌ Like API Debug - No userId found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { activityType } = body

    console.log('🔍 Like API Debug - Request body:', { activityType })

    if (!activityType) {
      console.log('❌ Like API Debug - No activityType provided')
      return NextResponse.json({ 
        error: 'Activity type is required' 
      }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user from database using clerk_id
    console.log('🔍 Like API Debug - Looking up user with clerk_id:', userId)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    console.log('🔍 Like API Debug - User lookup result:', { user, userError })

    if (userError || !user) {
      console.log('❌ Like API Debug - User not found or error:', userError)
      return NextResponse.json({ 
        error: 'User not found',
        debug: { userError: userError?.message }
      }, { status: 404 })
    }

    // Use the helper function to toggle like
    console.log('🔍 Like API Debug - Calling toggle_like with:', { 
      user_id: user.id, 
      activity_id: activityId, 
      activity_type: activityType 
    })
    
    const { data: result, error: toggleError } = await supabase
      .rpc('toggle_like', {
        p_user_id: user.id,
        p_activity_id: activityId,
        p_activity_type: activityType
      })

    console.log('🔍 Like API Debug - toggle_like result:', { result, toggleError })

    if (toggleError) {
      console.error('❌ Like API Debug - Error toggling like:', toggleError)
      return NextResponse.json({ 
        error: 'Failed to toggle like',
        debug: {
          toggleError: toggleError.message,
          code: toggleError.code,
          details: toggleError.details,
          hint: toggleError.hint
        }
      }, { status: 500 })
    }

    const isLiked = result as boolean

    // Get updated like count
    console.log('🔍 Like API Debug - Calling get_like_count with:', { 
      activity_id: activityId, 
      activity_type: activityType 
    })
    
    const { data: likeCount, error: countError } = await supabase
      .rpc('get_like_count', {
        p_activity_id: activityId,
        p_activity_type: activityType
      })

    console.log('🔍 Like API Debug - get_like_count result:', { likeCount, countError })

    if (countError) {
      console.error('❌ Like API Debug - Error getting like count:', countError)
      return NextResponse.json({ 
        error: 'Failed to get like count',
        debug: {
          countError: countError.message,
          code: countError.code
        }
      }, { status: 500 })
    }

    console.log('✅ Like API Debug - Success! Returning:', { 
      isLiked, 
      likeCount: likeCount || 0,
      action: isLiked ? 'liked' : 'unliked' 
    })

    return NextResponse.json({
      success: true,
      isLiked,
      likeCount: likeCount || 0,
      action: isLiked ? 'liked' : 'unliked'
    })

  } catch (error) {
    console.error('❌ Like API Debug - Catch block error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      debug: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: activityId } = await params
    const { userId } = await auth()
    
    const { searchParams } = new URL(request.url)
    const activityType = searchParams.get('activityType')

    if (!activityType) {
      return NextResponse.json({ 
        error: 'Activity type is required' 
      }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get like count
    const { data: likeCount, error: countError } = await supabase
      .rpc('get_like_count', {
        p_activity_id: activityId,
        p_activity_type: activityType
      })

    if (countError) {
      console.error('Error getting like count:', countError)
      return NextResponse.json({ 
        error: 'Failed to get like count' 
      }, { status: 500 })
    }

    let isLiked = false

    // Check if user has liked (only if user is authenticated)
    if (userId) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', userId)
        .single()

      if (!userError && user) {
        const { data: hasLiked, error: likedError } = await supabase
          .rpc('user_has_liked', {
            p_user_id: user.id,
            p_activity_id: activityId,
            p_activity_type: activityType
          })

        if (!likedError) {
          isLiked = hasLiked as boolean
        }
      }
    }

    return NextResponse.json({
      success: true,
      likeCount: likeCount || 0,
      isLiked
    })

  } catch (error) {
    console.error('Error in like status API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}