import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create service client that bypasses RLS
    const serviceClient = createServiceClient()

    // Get Supabase user ID from Clerk ID
    const { data: userData, error: userError } = await serviceClient
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      console.error('Error finding user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = userData.id

    // Get completed puzzles (puzzle_logs with logged_at not null)
    const { data: completedData, error: completedError } = await serviceClient
      .from('puzzle_logs')
      .select(`
        puzzle_id,
        logged_at,
        solve_time_seconds,
        note,
        puzzle:puzzles!inner(
          id,
          title,
          piece_count,
          image_url,
          brand:brands(name)
        )
      `)
      .eq('user_id', userId)
      .not('logged_at', 'is', null)



    // Get in-progress puzzles (puzzle_logs with logged_at null)
    const { data: inProgressData, error: inProgressError } = await serviceClient
      .from('puzzle_logs')
      .select(`
        puzzle_id,
        logged_at,
        puzzle:puzzles!inner(
          id,
          title,
          piece_count,
          image_url,
          brand:brands(name)
        )
      `)
      .eq('user_id', userId)
      .is('logged_at', null)



    // Get want-to-do puzzles (from lists)
    const { data: wishlistData, error: wishlistError } = await serviceClient
      .from('list_items')
      .select(`
        puzzle_id,
        list:lists!inner(
          user_id,
          name
        )
      `)
      .eq('list.user_id', userId)
      .eq('list.name', 'Want to Do Next')



    // Process completed puzzles
    const completed = (completedData || []).map((log: any) => ({
      id: log.puzzle.id,
      title: log.puzzle.title,
      brand: log.puzzle.brand?.name || 'Unknown',
      pieces: log.puzzle.piece_count,
      image: log.puzzle.image_url || '/placeholder-puzzle.svg',
      status: 'completed' as const,
      completedAt: log.logged_at,
      timeSpent: log.solve_time_seconds,
      notes: log.note
    }))

    // Process in-progress puzzles
    const inProgress = (inProgressData || []).map((log: any) => ({
      id: log.puzzle.id,
      title: log.puzzle.title,
      brand: log.puzzle.brand?.name || 'Unknown',
      pieces: log.puzzle.piece_count,
      image: log.puzzle.image_url || '/placeholder-puzzle.svg',
      status: 'in-progress' as const,
      notes: log.note
    }))

    // Process want-to-do puzzles
    let wantToDo: any[] = []
    
    if (wishlistData && wishlistData.length > 0) {
      const puzzleIds = wishlistData.map(item => item.puzzle_id)

      const { data: puzzleDetails, error: puzzleError } = await serviceClient
        .from('puzzles')
        .select(`
          id,
          title,
          piece_count,
          image_url,
          brand:brands(name)
        `)
        .in('id', puzzleIds)



      if (puzzleError) {
        console.error('❌ Error fetching puzzle details:', puzzleError)
      } else {
        wantToDo = (puzzleDetails || []).map((puzzle: any) => ({
          id: puzzle.id,
          title: puzzle.title,
          brand: puzzle.brand?.name || 'Unknown',
          pieces: puzzle.piece_count,
          image: puzzle.image_url || '/placeholder-puzzle.svg',
          status: 'want-to-do' as const
        }))
      }
    }

    // Combine and deduplicate results
    const results = [...completed, ...inProgress, ...wantToDo]
    
    // Remove duplicates (same puzzle ID)
    const deduplicatedResults = Array.from(
      new Map(results.map(puzzle => [puzzle.id, puzzle])).values()
    )



    return NextResponse.json({
      puzzles: deduplicatedResults,
      stats: {
        completed: completed.length,
        inProgress: inProgress.length,
        wantToDo: wantToDo.length,
        total: deduplicatedResults.length
      }
    })

  } catch (error) {
    console.error('💥 Error in my-puzzles API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 