import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid puzzle ID format' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch puzzle details with related data
    const { data: puzzle, error: puzzleError } = await supabase
      .from('puzzles')
      .select(`
        *,
        brand:brands!brand_id(id, name, image_url),
        uploader:users!uploader_id(id, username, avatar_url)
      `)
      .eq('id', id)
      .single()

    if (puzzleError || !puzzle) {
      console.error('Error fetching puzzle:', puzzleError)
      console.error('Puzzle ID:', id)
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 })
    }

    console.log('✅ Found puzzle:', puzzle.title)

    // Fetch community stats with simpler queries
    let wantToBuyCount = 0
    let backlogCount = 0 
    let inProgressCount = 0
    let completedCount = 0
    let averageTime = 0

    try {
      // Get all list items for this puzzle
      const { data: listItems, error: listError } = await supabase
        .from('list_items')
        .select('lists(slug)')
        .eq('puzzle_id', id)

      if (listError) {
        console.error('Error fetching list items:', listError)
      } else if (listItems) {
        // Count by list type
        listItems.forEach((item: any) => {
          const slug = item.lists?.slug
          if (slug === 'want_to_buy') wantToBuyCount++
          else if (slug === 'backlog') backlogCount++
          else if (slug === 'in_progress') inProgressCount++
        })
      }

      // Get completed count from puzzle logs
      const { count: logCount, error: logError } = await supabase
        .from('puzzle_logs')
        .select('*', { count: 'exact', head: true })
        .eq('puzzle_id', id)
        .not('completed_at', 'is', null)

      if (logError) {
        console.error('Error fetching puzzle logs:', logError)
      } else {
        completedCount = logCount || 0
      }

      // Calculate average completion time
      const { data: completedLogs, error: timeError } = await supabase
        .from('puzzle_logs')
        .select('time_spent')
        .eq('puzzle_id', id)
        .not('time_spent', 'is', null)
        .not('completed_at', 'is', null)

      if (timeError) {
        console.error('Error fetching completion times:', timeError)
      } else if (completedLogs && completedLogs.length > 0) {
        const totalTime = completedLogs.reduce((sum, log) => sum + (log.time_spent || 0), 0)
        averageTime = Math.round(totalTime / completedLogs.length / 60) // Convert minutes to hours
      }
    } catch (statsError) {
      console.error('Error fetching community stats:', statsError)
      // Continue with zero stats rather than failing the whole request
    }

    // Build response
    const response = {
      puzzle,
      communityStats: {
        wantToBuy: wantToBuyCount || 0,
        backlog: backlogCount || 0,
        inProgress: inProgressCount || 0,
        completed: completedCount || 0,
        averageTime: Math.round(averageTime / 60) // Convert minutes to hours
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in puzzle detail API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 