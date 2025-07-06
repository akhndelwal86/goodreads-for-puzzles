import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient, getUserPuzzles } from '@/lib/supabase'

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
      console.error('❌ Failed to find user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('✅ Found user:', userData.id)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any

    // Fetch user puzzles using clean architecture (single source)
    const puzzles = await getUserPuzzles(userData.id, status, serviceClient)

    // Calculate status breakdown from the clean data
    const statusBreakdown = {
      'wishlist': 0,
      'library': 0,
      'in-progress': 0,
      'completed': 0,
      'abandoned': 0
    }

    // Count puzzles by status
    puzzles.forEach(puzzle => {
      if (puzzle.status in statusBreakdown) {
        statusBreakdown[puzzle.status as keyof typeof statusBreakdown]++
      }
    })

    console.log('🎯 Clean API Response Status Breakdown:', statusBreakdown)
    console.log('📊 Total puzzles returned:', puzzles.length)

    return NextResponse.json({ 
      puzzles: puzzles,
      statusBreakdown: statusBreakdown,
      totalCount: puzzles.length
    })
  } catch (error) {
    console.error('❌ Error in my-puzzles API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 