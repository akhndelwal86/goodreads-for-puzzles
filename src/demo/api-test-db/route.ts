import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { logger } from '@/lib/utils'

export async function GET() {
  try {
    const supabase = createServiceClient()
    
    // Test basic connection
    const { data: testQuery, error: testError } = await supabase
      .from('puzzles')
      .select('id, title')
      .limit(1)

    if (testError) {
      logger.error('Database connection error:', testError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: testError.message 
      }, { status: 500 })
    }

    // Test puzzle_logs table structure
    const { data: logTest, error: logError } = await supabase
      .from('puzzle_logs')
      .select('id, status, progress_percentage, user_rating, difficulty_rating, is_private')
      .limit(1)

    if (logError) {
      logger.error('Puzzle logs schema error:', logError)
      return NextResponse.json({ 
        error: 'Puzzle logs schema issue',
        details: logError.message 
      }, { status: 500 })
    }

    // Test users table
    const { data: userTest, error: userError } = await supabase
      .from('users')
      .select('id, clerk_id')
      .limit(1)

    if (userError) {
      logger.error('Users table error:', userError)
      return NextResponse.json({ 
        error: 'Users table issue',
        details: userError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      status: 'success',
      message: 'Database connection and schema verified',
      data: {
        puzzles_available: testQuery?.length || 0,
        puzzle_logs_table: 'OK',
        users_table: 'OK',
        new_columns: [
          'status',
          'progress_percentage', 
          'user_rating',
          'difficulty_rating',
          'is_private'
        ]
      }
    })

  } catch (error) {
    logger.error('Database test error:', error)
    return NextResponse.json({
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 