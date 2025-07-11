import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    
    // Get query parameters
    const url = new URL(request.url)
    const format = url.searchParams.get('format') || 'json'
    const table = url.searchParams.get('table')
    
    if (table) {
      // Get specific table information
      const tableInfo = await getTableInfo(supabase, table)
      return NextResponse.json({ table: tableInfo })
    }
    
    // Since we can't easily access information_schema, let's use a known list of tables
    // and introspect each one individually
    const knownTables = [
      'users', 'brands', 'puzzles', 'lists', 'list_items', 
      'puzzle_logs', 'reviews', 'tags', 'puzzle_tags', 
      'puzzle_aggregates', 'feed_items', 'follows', 
      'likes', 'comments'
    ]
    
    // Get detailed info for each known table
    const tablesWithColumns = []
    
    for (const tableName of knownTables) {
      try {
        // Test if table exists by trying to query it
        const { data: testData, error: testError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (!testError) {
          // Table exists, get its structure
          const columns = await getTableColumns(supabase, tableName)
          const relationships = await getTableRelationships(supabase, tableName)
          
          // Get row count
          let count = 0
          try {
            const result = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true })
            count = result.count || 0
          } catch (countError) {
            count = 0
          }
          
          tablesWithColumns.push({
            name: tableName,
            type: 'BASE TABLE',
            columns,
            relationships,
            row_count: count || 0
          })
        }
      } catch (tableError) {
        // Skip tables we can't access
      }
    }
    
    const schema = {
      timestamp: new Date().toISOString(),
      database: 'postgres',
      schema: 'public',
      tables: tablesWithColumns
    }
    
    if (format === 'markdown') {
      const markdown = generateMarkdownSchema(schema)
      return new NextResponse(markdown, {
        headers: { 'Content-Type': 'text/markdown' }
      })
    }
    
    return NextResponse.json(schema)
    
  } catch (error) {
    console.error('Error in schema API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function getTableColumns(supabase: any, tableName: string) {
  // Since we can't access information_schema easily, let's introspect 
  // by querying the table and examining the structure
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    if (error || !data || data.length === 0) {
      // Try to get empty result to see columns
      const { data: emptyData, error: emptyError } = await supabase
        .from(tableName)
        .select('*')
        .limit(0)
      
      if (emptyError) return []
    }
    
    // If we got data, examine the first row to understand column structure
    const sampleRow = data && data.length > 0 ? data[0] : {}
    
    const columns = Object.keys(sampleRow).map(columnName => {
      const value = sampleRow[columnName]
      let dataType = 'unknown'
      
      // Infer data type from value
      if (value === null) {
        dataType = 'nullable'
      } else if (typeof value === 'string') {
        // Check if it's a timestamp
        if (value.includes('T') && value.includes('Z')) {
          dataType = 'timestamp'
        } else if (value.includes('-') && value.length === 36) {
          dataType = 'uuid'
        } else {
          dataType = 'text'
        }
      } else if (typeof value === 'number') {
        dataType = Number.isInteger(value) ? 'integer' : 'numeric'
      } else if (typeof value === 'boolean') {
        dataType = 'boolean'
      } else if (Array.isArray(value)) {
        dataType = 'jsonb'
      } else if (typeof value === 'object') {
        dataType = 'jsonb'
      }
      
      return {
        column_name: columnName,
        data_type: dataType,
        is_nullable: value === null ? 'YES' : 'UNKNOWN',
        column_default: null
      }
    })
    
    return columns
    
  } catch (error) {
    return []
  }
}

async function getTableRelationships(supabase: any, tableName: string) {
  // Since we can't access information_schema, let's provide known relationships
  // This is a simplified approach - in a full implementation we'd need exec_sql
  const knownRelationships: Record<string, any[]> = {
    puzzles: [
      { column_name: 'brand_id', foreign_table_name: 'brands', foreign_column_name: 'id' },
      { column_name: 'uploader_id', foreign_table_name: 'users', foreign_column_name: 'id' }
    ],
    puzzle_logs: [
      { column_name: 'user_id', foreign_table_name: 'users', foreign_column_name: 'id' },
      { column_name: 'puzzle_id', foreign_table_name: 'puzzles', foreign_column_name: 'id' }
    ],
    reviews: [
      { column_name: 'user_id', foreign_table_name: 'users', foreign_column_name: 'id' },
      { column_name: 'puzzle_id', foreign_table_name: 'puzzles', foreign_column_name: 'id' }
    ],
    lists: [
      { column_name: 'user_id', foreign_table_name: 'users', foreign_column_name: 'id' }
    ],
    list_items: [
      { column_name: 'list_id', foreign_table_name: 'lists', foreign_column_name: 'id' },
      { column_name: 'puzzle_id', foreign_table_name: 'puzzles', foreign_column_name: 'id' }
    ],
    puzzle_tags: [
      { column_name: 'puzzle_id', foreign_table_name: 'puzzles', foreign_column_name: 'id' },
      { column_name: 'tag_id', foreign_table_name: 'tags', foreign_column_name: 'id' }
    ],
    feed_items: [
      { column_name: 'user_id', foreign_table_name: 'users', foreign_column_name: 'id' },
      { column_name: 'target_puzzle_id', foreign_table_name: 'puzzles', foreign_column_name: 'id' },
      { column_name: 'target_list_id', foreign_table_name: 'lists', foreign_column_name: 'id' }
    ],
    follows: [
      { column_name: 'follower_id', foreign_table_name: 'users', foreign_column_name: 'id' },
      { column_name: 'followed_user_id', foreign_table_name: 'users', foreign_column_name: 'id' }
    ],
    likes: [
      { column_name: 'user_id', foreign_table_name: 'users', foreign_column_name: 'id' }
    ],
    comments: [
      { column_name: 'user_id', foreign_table_name: 'users', foreign_column_name: 'id' },
      { column_name: 'parent_comment_id', foreign_table_name: 'comments', foreign_column_name: 'id' }
    ]
  }
  
  return knownRelationships[tableName] || []
}

async function getTableInfo(supabase: any, tableName: string) {
  const columns = await getTableColumns(supabase, tableName)
  const relationships = await getTableRelationships(supabase, tableName)
  
  // Get row count
  let count = 0
  try {
    const result = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    count = result.count || 0
  } catch (error) {
    count = 0
  }
  
  return {
    name: tableName,
    columns,
    relationships,
    row_count: count
  }
}

function generateMarkdownSchema(schema: any) {
  let markdown = `# Database Schema\n\n`
  markdown += `**Generated:** ${schema.timestamp}\n`
  markdown += `**Database:** ${schema.database}\n`
  markdown += `**Schema:** ${schema.schema}\n\n`
  
  markdown += `## Tables (${schema.tables.length})\n\n`
  
  schema.tables.forEach((table: any) => {
    markdown += `### ${table.name}\n\n`
    
    if (table.columns.length > 0) {
      markdown += `| Column | Type | Nullable | Default |\n`
      markdown += `|--------|------|----------|----------|\n`
      
      table.columns.forEach((col: any) => {
        markdown += `| ${col.column_name} | ${col.data_type} | ${col.is_nullable} | ${col.column_default || '-'} |\n`
      })
      markdown += `\n`
    }
    
    if (table.relationships.length > 0) {
      markdown += `**Relationships:**\n`
      table.relationships.forEach((rel: any) => {
        markdown += `- ${rel.column_name} → ${rel.foreign_table_name}.${rel.foreign_column_name}\n`
      })
      markdown += `\n`
    }
    
    markdown += `---\n\n`
  })
  
  return markdown
}