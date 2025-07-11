import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Simple query endpoint for basic database operations
export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json()
    
    if (!sql) {
      return NextResponse.json(
        { error: 'SQL query is required' },
        { status: 400 }
      )
    }
    
    const supabase = createServiceClient()
    
    // For simple SELECT queries, we can use the REST API
    if (sql.trim().toLowerCase().startsWith('select')) {
      // Parse simple SELECT statements
      const tableMatch = sql.match(/from\s+(\w+)/i)
      if (tableMatch) {
        const tableName = tableMatch[1]
        
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
          
          if (error) throw error
          
          return NextResponse.json({
            success: true,
            data,
            query: sql,
            rows: data?.length || 0
          })
        } catch (error) {
          console.error('Query error:', error)
          return NextResponse.json(
            { error: 'Query execution failed', details: error },
            { status: 500 }
          )
        }
      }
    }
    
    // For other operations, return an error for now
    return NextResponse.json(
      { 
        error: 'Only simple SELECT queries are supported currently',
        hint: 'Use the Supabase dashboard for complex operations until exec_sql function is set up'
      },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error in simple query API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}