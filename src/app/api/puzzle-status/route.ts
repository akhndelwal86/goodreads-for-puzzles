import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { createPuzzleLogFeedItems } from '@/lib/activity-feed'

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    console.log('🔄 PATCH /api/puzzle-status body:', body)
    
    const { puzzleId, newStatus, completionTime } = body
    
    if (!puzzleId || !newStatus) {
      console.log('❌ Missing required fields for PATCH:', { puzzleId, newStatus })
      return NextResponse.json({ error: 'Missing required fields: puzzleId and newStatus' }, { status: 400 })
    }

    // Create service client
    const serviceClient = createServiceClient()

    // Get Supabase user ID from Clerk ID
    const { data: userData, error: userError } = await serviceClient
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      console.log('❌ Failed to find user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('✅ Found user for status change:', userData.id)

    // Validate status values
    const validStatuses = ['wishlist', 'library', 'in-progress', 'completed', 'abandoned']
    if (!validStatuses.includes(newStatus)) {
      console.log('❌ Invalid status:', newStatus)
      return NextResponse.json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') }, { status: 400 })
    }

    // Check if puzzle log already exists
    const { data: existingLog, error: checkError } = await serviceClient
      .from('puzzle_logs')
      .select('id, status, started_at, logged_at, progress_percentage')
      .eq('user_id', userData.id)
      .eq('puzzle_id', puzzleId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('❌ Error checking existing log:', checkError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (existingLog) {
      // Update existing puzzle log
      // Derive old status from existing fields since status column may not exist
      let oldStatus = existingLog.status
      if (!oldStatus) {
        // Derive status from existing fields
        if (existingLog.logged_at) {
          oldStatus = 'completed'
        } else if (existingLog.started_at) {
          oldStatus = 'in-progress'
        } else if (existingLog.progress_percentage > 0) {
          oldStatus = 'in-progress'
        } else {
          oldStatus = 'library'
        }
      }
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // Handle status-specific updates
      if (newStatus === 'completed') {
        updateData.progress_percentage = 100
        updateData.logged_at = new Date().toISOString()
        if (completionTime) {
          updateData.solve_time_seconds = completionTime
        }
      } else if (newStatus === 'in-progress' && !existingLog.started_at) {
        updateData.started_at = new Date().toISOString()
      } else if (newStatus === 'library' || newStatus === 'wishlist') {
        // Reset progress when moving back to earlier states
        updateData.progress_percentage = 0
        updateData.started_at = null
      }

      const { data: updatedLog, error: updateError } = await serviceClient
        .from('puzzle_logs')
        .update(updateData)
        .eq('id', existingLog.id)
        .select()
        .single()

      if (updateError) {
        console.log('❌ Error updating puzzle log:', updateError)
        return NextResponse.json({ error: 'Failed to update puzzle status' }, { status: 500 })
      }

      console.log('✅ Updated puzzle log status:', updatedLog.id, 'to', newStatus)

      // Create feed items for this activity (async, don't wait for it)
      createPuzzleLogFeedItems(
        userData.id,
        existingLog.id,
        puzzleId,
        newStatus,
        oldStatus,
        updateData.progress_percentage,
        completionTime
      ).catch(error => {
        console.error('⚠️ Failed to create feed items:', error)
      })

      return NextResponse.json({ success: true, log: updatedLog }, { status: 200 })

    } else {
      // Create new puzzle log
      const logData: any = {
        user_id: userData.id,
        puzzle_id: puzzleId,
        status: newStatus,
        progress_percentage: newStatus === 'completed' ? 100 : 0,
        photo_urls: [],
        video_urls: [],
        is_private: false
      }

      // Set timestamps based on status
      if (newStatus === 'completed') {
        logData.logged_at = new Date().toISOString()
        if (completionTime) {
          logData.solve_time_seconds = completionTime
        }
      } else if (newStatus === 'in-progress') {
        logData.started_at = new Date().toISOString()
      }
      // For wishlist and library, no special timestamps needed

      const { data: newLog, error: createError } = await serviceClient
        .from('puzzle_logs')
        .insert([logData])
        .select()
        .single()

      if (createError) {
        console.log('❌ Error creating puzzle log:', createError)
        return NextResponse.json({ error: 'Failed to create puzzle status' }, { status: 500 })
      }

      console.log('✅ Created new puzzle log:', newLog.id, 'with status', newStatus)

      // Create feed items for this activity (async, don't wait for it)
      createPuzzleLogFeedItems(
        userData.id,
        newLog.id,
        puzzleId,
        newStatus,
        undefined, // no old status for new logs
        logData.progress_percentage,
        completionTime
      ).catch(error => {
        console.error('⚠️ Failed to create feed items:', error)
      })

      return NextResponse.json({ success: true, log: newLog }, { status: 201 })
    }

  } catch (error) {
    console.error('❌ Error in puzzle-status API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 