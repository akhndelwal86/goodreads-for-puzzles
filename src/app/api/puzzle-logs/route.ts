import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { logger } from '@/lib/utils'
import type { CreatePuzzleLogRequest } from '@/lib/supabase'
import { createPuzzleLogFeedItems } from '@/lib/activity-feed'

// ============================
// POST /api/puzzle-logs
// Create a new puzzle log
// ============================
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreatePuzzleLogRequest = await request.json()
    const {
      puzzleId,
      status,
      startedAt,
      completedAt,
      timeSpent,
      notes,
      rating,
      difficulty,
      photos = [],
      progressPercentage = 0,
      private: isPrivate = false
    } = body

    // Validate required fields
    if (!puzzleId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: puzzleId and status' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    
    // Get the user's internal ID from their Clerk ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      logger.error('Failed to find user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if puzzle exists
    const { data: puzzleData, error: puzzleError } = await supabase
      .from('puzzles')
      .select('id, title')
      .eq('id', puzzleId)
      .single()

    if (puzzleError || !puzzleData) {
      logger.error('Puzzle not found:', puzzleError)
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 })
    }

    // Check if log already exists - if it does, update it instead of creating new one
    const { data: existingLog } = await supabase
      .from('puzzle_logs')
      .select('id, progress_percentage')
      .eq('user_id', userData.id)
      .eq('puzzle_id', puzzleId)
      .single()

    if (existingLog) {
      // Get the full existing log to preserve data
      const { data: fullExistingLog, error: fetchError } = await supabase
        .from('puzzle_logs')
        .select('*')
        .eq('id', existingLog.id)
        .single()

      if (fetchError) {
        return NextResponse.json({ error: 'Failed to fetch existing puzzle log' }, { status: 500 })
      }

      // Get current progress to compare with new progress
      const currentProgress = fullExistingLog.progress_percentage || 0
      const newProgress = progressPercentage || (status === 'completed' ? 100 : 0)
      
      // Preserve existing photos and append new ones
      const existingPhotos = fullExistingLog.photo_urls || []
      const newPhotos = photos || []
      const combinedPhotos = [...existingPhotos, ...newPhotos]
      
      
      // Update existing log instead of creating new one
      const { data: updatedLog, error: updateError } = await supabase
        .from('puzzle_logs')
        .update({
          solve_time_seconds: timeSpent,
          note: notes,
          photo_urls: combinedPhotos,
          video_urls: [],
          progress_percentage: newProgress,
          user_rating: rating,
          difficulty_rating: difficulty,
          is_private: isPrivate,
          logged_at: status === 'completed' ? (completedAt || new Date().toISOString()) : null
        })
        .eq('id', existingLog.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update puzzle log' }, { status: 500 })
      }

      // Determine if this update warrants a new feed item
      const hasNewPhotos = newPhotos && newPhotos.length > 0
      const hasSignificantProgress = (newProgress - currentProgress >= 15)
      const hasNewNotes = notes && notes.trim().length > 0
      const hasNewRating = rating && rating > 0
      const isCompletion = status === 'completed'
      
      const isSignificantProgressUpdate = (
        hasNewPhotos ||        // New photos/media always deserve a feed item
        isCompletion ||        // Completion always deserves a feed item
        hasSignificantProgress ||  // Significant progress increase (15% or more)
        hasNewNotes ||         // New notes/content always deserve a feed item
        hasNewRating           // New rating always deserves a feed item
      )
      

      // Create feed items for significant updates (async, don't wait for it)
      if (isSignificantProgressUpdate) {
        createPuzzleLogFeedItems(
          userData.id,
          existingLog.id,
          puzzleId,
          status,
          undefined, // We don't track old status in this API
          newProgress,
          timeSpent,
          newPhotos  // Pass only the new photos for the feed item
        ).catch(() => {
          // Silently handle feed item creation errors
        })
      } else {
        // Skipping feed item creation for minor update
      }

      return NextResponse.json({ success: true, log: updatedLog }, { status: 200 })
    }

    // Prepare the puzzle log data - using only existing columns for now
    const puzzleLogData = {
      user_id: userData.id,
      puzzle_id: puzzleId,
      logged_at: status === 'completed' ? (completedAt || new Date().toISOString()) : null,
      solve_time_seconds: timeSpent,
      note: notes, // Fixed: using 'note' column instead of 'notes'
      photo_urls: photos,
      video_urls: [], // Empty for now
      progress_percentage: progressPercentage || (status === 'completed' ? 100 : 0),
      user_rating: rating,
      difficulty_rating: difficulty,
      is_private: isPrivate
    }

    // Create the puzzle log
    const { data: newLog, error: createError } = await supabase
      .from('puzzle_logs')
      .insert(puzzleLogData)
      .select(`
        *,
        puzzle:puzzles!inner(
          id,
          title,
          piece_count,
          image_url,
          brand:brands(name)
        )
      `)
      .single()

    if (createError) {
      logger.error('Failed to create puzzle log:', createError)
      return NextResponse.json(
        { error: 'Failed to create puzzle log' },
        { status: 500 }
      )
    }

    logger.success('Puzzle log created successfully:', newLog.id)

    // Create feed items for this activity (async, don't wait for it)
    createPuzzleLogFeedItems(
      userData.id,
      newLog.id,
      puzzleId,
      status,
      undefined, // no old status for new logs
      progressPercentage || (status === 'completed' ? 100 : 0),
      timeSpent,
      photos
    ).catch(error => {
      console.error('⚠️ Failed to create feed items:', error)
    })

    // Transform the response to match our UserPuzzle type
    const response = {
      id: newLog.puzzle.id,
      title: newLog.puzzle.title,
      brand: newLog.puzzle.brand?.name || 'Unknown',
      pieces: newLog.puzzle.piece_count,
      image: newLog.puzzle.image_url || '/placeholder-puzzle.svg',
      status: newLog.logged_at ? 'completed' : 'want-to-do',
      completedAt: newLog.logged_at,
      startedAt: startedAt || null,
      timeSpent: newLog.solve_time_seconds,
      notes: newLog.note,
      rating: rating || null,
      difficulty: difficulty || null,
      photos: newLog.photo_urls || [],
      progressPercentage: status === 'completed' ? 100 : progressPercentage || 0,
      private: isPrivate,
      createdAt: newLog.logged_at,
      updatedAt: newLog.logged_at
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    logger.error('Error in POST /api/puzzle-logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================
// GET /api/puzzle-logs
// Get all puzzle logs for the authenticated user
// ============================
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'completed' | 'in-progress' | 'want-to-do' | 'abandoned' | null
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServiceClient()
    
    // Get the user's internal ID from their Clerk ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      logger.error('Failed to find user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build the query - start with basic columns that exist
    let query = supabase
      .from('puzzle_logs')
      .select(`
        *,
        puzzle:puzzles!inner(
          id,
          title,
          piece_count,
          image_url,
          brand:brands(name)
        )
      `)
      .eq('user_id', userData.id)

    // Apply status filter if provided (only if status column exists)
    if (status) {
      // For now, map status to existing logged_at field
      if (status === 'completed') {
        query = query.not('logged_at', 'is', null)
      } else if (status === 'want-to-do' || status === 'in-progress') {
        query = query.is('logged_at', null)
      }
    }

    // Apply pagination and ordering
    const { data: logs, error: logsError } = await query
      .order('logged_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1)

    if (logsError) {
      logger.error('Failed to fetch puzzle logs:', logsError)
      return NextResponse.json(
        { error: 'Failed to fetch puzzle logs' },
        { status: 500 }
      )
    }

    // Transform the response to match our UserPuzzle type
    const response = (logs || []).map(log => ({
      id: log.puzzle.id,
      title: log.puzzle.title,
      brand: log.puzzle.brand?.name || 'Unknown',
      pieces: log.puzzle.piece_count,
      image: log.puzzle.image_url || '/placeholder-puzzle.svg',
      status: log.logged_at ? 'completed' : 'want-to-do', // Map from existing data
      completedAt: log.logged_at,
      startedAt: log.started_at || null,
      timeSpent: log.solve_time_seconds,
      notes: log.note,
      rating: log.user_rating || null,
      difficulty: log.difficulty_rating || null,
      photos: log.photo_urls || [],
      progressPercentage: log.progress_percentage || (log.logged_at ? 100 : 0),
      private: log.is_private || false,
      createdAt: log.created_at || log.logged_at,
      updatedAt: log.updated_at || log.logged_at
    }))

    logger.success(`Retrieved ${response.length} puzzle logs for user`)
    return NextResponse.json(response)

  } catch (error) {
    logger.error('Error in GET /api/puzzle-logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 