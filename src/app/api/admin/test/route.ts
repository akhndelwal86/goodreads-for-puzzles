import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    
    // Test if admin_sessions table exists
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('count(*)')
      .limit(1)

    if (error) {
      return NextResponse.json({
        error: 'Database table test failed',
        details: error.message,
        tablesExist: false
      })
    }

    return NextResponse.json({
      message: 'Admin tables exist',
      tablesExist: true,
      sessionCount: Array.isArray(data) && data[0] ? (data[0] as any).count || 0 : 0
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      tablesExist: false
    })
  }
}