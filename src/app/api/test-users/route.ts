import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/test-users - Get a list of users for testing
export async function GET() {
  try {
    const supabaseService = createServiceClient()
    
    const { data: users, error } = await supabaseService
      .from('users')
      .select('id, clerk_id, username, email')
      .limit(10)

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json({ 
      users: users || [],
      count: users?.length || 0
    })

  } catch (error) {
    console.error('Error in test-users endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}