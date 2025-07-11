import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

// Create migrations tracking table if it doesn't exist
const CREATE_MIGRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS _migrations (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT NOW(),
  checksum TEXT,
  success BOOLEAN DEFAULT true
);
`

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    
    // Ensure migrations table exists
    await supabase.rpc('exec_sql', { sql: CREATE_MIGRATIONS_TABLE })
    
    // Get migration status
    const { data: executed, error } = await supabase
      .from('_migrations')
      .select('*')
      .order('executed_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching migrations:', error)
      return NextResponse.json({ error: 'Failed to fetch migration status' }, { status: 500 })
    }
    
    // List available migration files
    const fs = await import('fs')
    const path = await import('path')
    
    const migrationsDir = path.join(process.cwd(), 'migrations')
    let availableFiles: string[] = []
    
    try {
      availableFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort()
    } catch (err) {
      console.log('No migrations directory found')
    }
    
    const status = {
      executed: executed || [],
      available: availableFiles,
      pending: availableFiles.filter(file => 
        !executed?.some(m => m.filename === file)
      )
    }
    
    return NextResponse.json(status)
    
  } catch (error) {
    console.error('Error in migrate API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { filename, sql, force = false } = await request.json()
    
    if (!sql && !filename) {
      return NextResponse.json(
        { error: 'Either sql or filename is required' },
        { status: 400 }
      )
    }
    
    const supabase = createServiceClient()
    
    // Ensure migrations table exists
    await supabase.rpc('exec_sql', { sql: CREATE_MIGRATIONS_TABLE })
    
    let migrationSql = sql
    let migrationFilename = filename || `manual-${Date.now()}.sql`
    
    // If filename provided, read from file
    if (filename && !sql) {
      try {
        const fs = await import('fs')
        const path = await import('path')
        const filePath = path.join(process.cwd(), 'migrations', filename)
        migrationSql = fs.readFileSync(filePath, 'utf8')
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to read migration file: ${filename}` },
          { status: 400 }
        )
      }
    }
    
    // Check if already executed (unless forced)
    if (!force) {
      const { data: existing } = await supabase
        .from('_migrations')
        .select('*')
        .eq('filename', migrationFilename)
        .single()
      
      if (existing) {
        return NextResponse.json(
          { error: `Migration ${migrationFilename} already executed`, existing },
          { status: 400 }
        )
      }
    }
    
    // Calculate checksum
    const crypto = await import('crypto')
    const checksum = crypto.createHash('md5').update(migrationSql).digest('hex')
    
    try {
      // Execute the migration
      const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSql })
      
      if (error) {
        // Record failed migration
        await supabase.from('_migrations').insert({
          filename: migrationFilename,
          checksum,
          success: false
        })
        
        throw error
      }
      
      // Record successful migration
      await supabase.from('_migrations').insert({
        filename: migrationFilename,
        checksum,
        success: true
      })
      
      return NextResponse.json({
        success: true,
        filename: migrationFilename,
        checksum,
        result: data
      })
      
    } catch (execError) {
      console.error('Migration execution error:', execError)
      return NextResponse.json(
        { 
          error: 'Migration execution failed',
          filename: migrationFilename,
          details: execError
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Error in migrate POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper endpoint to execute raw SQL
export async function PUT(request: NextRequest) {
  try {
    const { sql } = await request.json()
    
    if (!sql) {
      return NextResponse.json(
        { error: 'SQL query is required' },
        { status: 400 }
      )
    }
    
    const supabase = createServiceClient()
    
    // Execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('SQL execution error:', error)
      return NextResponse.json(
        { error: 'SQL execution failed', details: error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      result: data,
      rows_affected: Array.isArray(data) ? data.length : 0
    })
    
  } catch (error) {
    console.error('Error in SQL execution:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}