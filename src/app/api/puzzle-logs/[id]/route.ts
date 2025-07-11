import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { UpdatePuzzleLogRequest } from '@/lib/supabase'
import { logger } from '@/lib/utils'
import { createPuzzleLogFeedItems } from '@/lib/activity-feed'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const logId = resolvedParams.id

    const supabase = createServiceClient()
    
    // First, get the user's internal ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      logger.error('Failed to find user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the specific puzzle log
    const { data: puzzleLog, error } = await supabase
      .from('puzzle_logs')
      .select(`
        *,
        puzzle:puzzles (
          id,
          title,
          piece_count,
          brand:brands (
            id,
            name
          )
        )
      `)
      .eq('id', logId)
      .eq('user_id', user.id)
      .single()

    if (error || !puzzleLog) {
      logger.error('Puzzle log not found or unauthorized:', error)
      return NextResponse.json({ error: 'Puzzle log not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json(puzzleLog)

  } catch (error) {
    logger.error('Error fetching puzzle log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const logId = resolvedParams.id
    const body: UpdatePuzzleLogRequest = await request.json()

    console.log('🔄 PATCH /api/puzzle-logs/[id] called:', {
      logId,
      userId,
      hasPhotos: body.photos && body.photos.length > 0,
      photoCount: body.photos?.length || 0,
      status: body.status,
      progressPercentage: body.progressPercentage
    })

    const supabase = createServiceClient()
    
    // First, get the user's internal ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      logger.error('Failed to find user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the full existing log to preserve data and compare changes
    const { data: fullExistingLog, error: fetchError } = await supabase
      .from('puzzle_logs')
      .select('*')
      .eq('id', logId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !fullExistingLog) {
      console.log('❌ Error fetching existing log:', fetchError)
      return NextResponse.json({ error: 'Puzzle log not found or unauthorized' }, { status: 404 })
    }

    console.log('📋 Existing log data:', {
      currentProgress: fullExistingLog.progress_percentage,
      existingPhotosCount: fullExistingLog.photo_urls?.length || 0,
      currentStatus: fullExistingLog.status
    })

    // Get current progress to compare with new progress
    const currentProgress = fullExistingLog.progress_percentage || 0
    const newProgress = body.progressPercentage || 0
    
    // Preserve existing photos and append new ones
    const existingPhotos = fullExistingLog.photo_urls || []
    const newPhotos = body.photos || []
    const combinedPhotos = [...existingPhotos, ...newPhotos]
    
    console.log('📸 Photo handling:', {
      existingPhotosCount: existingPhotos.length,
      newPhotosCount: newPhotos.length,
      totalPhotosAfter: combinedPhotos.length
    })

    // Update the puzzle log
    const { data: updatedLog, error } = await supabase
      .from('puzzle_logs')
      .update({
        note: body.notes,
        solve_time_seconds: body.timeSpent,
        photo_urls: combinedPhotos,
        progress_percentage: newProgress,
        user_rating: body.rating,
        difficulty_rating: body.difficulty,
        is_private: body.private,
        logged_at: body.status === 'completed' ? (body.completedAt || new Date().toISOString()) : null
      })
      .eq('id', logId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !updatedLog) {
      logger.error('Puzzle log not found or unauthorized:', error)
      return NextResponse.json({ error: 'Puzzle log not found or unauthorized' }, { status: 404 })
    }

    console.log('✅ Updated existing puzzle log:', updatedLog.id)

    // Determine if this update warrants a new feed item
    const hasNewPhotos = newPhotos && newPhotos.length > 0
    const hasSignificantProgress = (newProgress - currentProgress >= 15)
    const hasNewNotes = body.notes && body.notes.trim().length > 0
    const hasNewRating = body.rating && body.rating > 0
    const isCompletion = body.status === 'completed'
    
    const isSignificantProgressUpdate = (
      hasNewPhotos ||        // New photos/media always deserve a feed item
      isCompletion ||        // Completion always deserves a feed item
      hasSignificantProgress ||  // Significant progress increase (15% or more)
      hasNewNotes ||         // New notes/content always deserve a feed item
      hasNewRating           // New rating always deserves a feed item
    )
    
    console.log('🔍 Feed item criteria check:', {
      hasNewPhotos,
      hasSignificantProgress,
      hasNewNotes,
      hasNewRating,
      isCompletion,
      willCreateFeedItem: isSignificantProgressUpdate
    })

    // Create feed items for significant updates (async, don't wait for it)
    if (isSignificantProgressUpdate) {
      console.log('📝 Creating new feed item for significant update:', {
        hasPhotos: newPhotos && newPhotos.length > 0,
        statusValue: body.status,
        progressIncrease: newProgress - currentProgress,
        hasNotes: body.notes && body.notes.trim().length > 0,
        hasRating: body.rating && body.rating > 0,
        currentProgress,
        newProgress
      })
      createPuzzleLogFeedItems(
        user.id,
        logId,
        fullExistingLog.puzzle_id,
        body.status || fullExistingLog.status || 'in-progress',
        undefined, // We don't track old status in this API
        newProgress,
        body.timeSpent,
        newPhotos  // Pass only the new photos for the feed item
      ).catch(error => {
        console.error('⚠️ Failed to create feed items:', error)
      })
    } else {
      console.log('⏸️ Skipping feed item creation for minor update:', {
        hasPhotos: newPhotos && newPhotos.length > 0,
        statusValue: body.status,
        progressIncrease: newProgress - currentProgress,
        hasNotes: body.notes && body.notes.trim().length > 0,
        hasRating: body.rating && body.rating > 0,
        currentProgress,
        newProgress
      })
    }

    logger.info('✅ Puzzle log updated successfully:', updatedLog.id)
    return NextResponse.json(updatedLog)

  } catch (error) {
    logger.error('Error updating puzzle log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const logId = resolvedParams.id

    const supabase = createServiceClient()
    
    // First, get the user's internal ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      logger.error('Failed to find user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete the puzzle log
    const { error } = await supabase
      .from('puzzle_logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', user.id)

    if (error) {
      logger.error('Error deleting puzzle log:', error)
      return NextResponse.json({ error: 'Failed to delete puzzle log' }, { status: 500 })
    }

    logger.info('✅ Puzzle log deleted successfully:', logId)
    return NextResponse.json({ success: true })

  } catch (error) {
    logger.error('Error deleting puzzle log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 