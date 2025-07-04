import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { UpdatePuzzleLogRequest } from '@/lib/supabase'
import { logger } from '@/lib/utils'

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

    // Update the puzzle log
    const { data: updatedLog, error } = await supabase
      .from('puzzle_logs')
      .update({
        status: body.status,
        progress_percentage: body.progressPercentage,
        difficulty_rating: body.difficulty,
        user_rating: body.rating,
        notes: body.notes,
        private: body.private,
        photo_urls: body.photos,
        updated_at: new Date().toISOString()
      })
      .eq('id', logId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !updatedLog) {
      logger.error('Puzzle log not found or unauthorized:', error)
      return NextResponse.json({ error: 'Puzzle log not found or unauthorized' }, { status: 404 })
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