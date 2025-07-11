import { createServiceClient } from './supabase'

// Database administration utilities
export class DatabaseAdmin {
  private supabase = createServiceClient()

  /**
   * Execute raw SQL with the service role client
   */
  async executeSQL(sql: string): Promise<{ data: any, error: any }> {
    try {
      // Create the exec_sql function if it doesn't exist
      await this.ensureExecSQLFunction()
      
      const { data, error } = await this.supabase.rpc('exec_sql', { sql })
      return { data, error }
    } catch (error) {
      console.error('SQL execution error:', error)
      return { data: null, error }
    }
  }

  /**
   * Get current database schema information
   */
  async getSchemaInfo() {
    const sql = `
      SELECT 
        t.table_name,
        t.table_type,
        COALESCE(
          json_agg(
            json_build_object(
              'column_name', c.column_name,
              'data_type', c.data_type,
              'is_nullable', c.is_nullable,
              'column_default', c.column_default,
              'character_maximum_length', c.character_maximum_length
            ) ORDER BY c.ordinal_position
          ) FILTER (WHERE c.column_name IS NOT NULL), 
          '[]'
        ) as columns
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c 
        ON t.table_name = c.table_name 
        AND t.table_schema = c.table_schema
      WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      GROUP BY t.table_name, t.table_type
      ORDER BY t.table_name;
    `
    
    return this.executeSQL(sql)
  }

  /**
   * Get table relationships/foreign keys
   */
  async getTableRelationships() {
    const sql = `
      SELECT 
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `
    
    return this.executeSQL(sql)
  }

  /**
   * Create the exec_sql function if it doesn't exist
   */
  private async ensureExecSQLFunction() {
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS json
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result json;
      BEGIN
        EXECUTE sql;
        GET DIAGNOSTICS result = ROW_COUNT;
        RETURN json_build_object('rows_affected', result);
      EXCEPTION 
        WHEN OTHERS THEN
          RETURN json_build_object('error', SQLERRM, 'sqlstate', SQLSTATE);
      END;
      $$;
    `
    
    try {
      // Try to create the function using direct SQL
      await this.supabase.rpc('exec_sql', { sql: createFunctionSQL })
    } catch (error) {
      // If the function doesn't exist, we'll need to create it manually
      console.log('exec_sql function needs to be created manually in Supabase')
    }
  }

  /**
   * Check migration status
   */
  async getMigrationStatus() {
    const sql = `
      SELECT filename, executed_at, success, checksum
      FROM _migrations
      ORDER BY executed_at DESC;
    `
    
    return this.executeSQL(sql)
  }

  /**
   * Run a specific migration file
   */
  async runMigration(filename: string) {
    try {
      const fs = await import('fs')
      const path = await import('path')
      
      const filePath = path.join(process.cwd(), 'migrations', filename)
      const sql = fs.readFileSync(filePath, 'utf8')
      
      // Execute the migration
      const result = await this.executeSQL(sql)
      
      if (!result.error) {
        // Record successful migration
        const crypto = await import('crypto')
        const checksum = crypto.createHash('md5').update(sql).digest('hex')
        
        await this.executeSQL(`
          INSERT INTO _migrations (filename, checksum, success)
          VALUES ('${filename}', '${checksum}', true)
        `)
      }
      
      return result
    } catch (error) {
      console.error('Migration error:', error)
      return { data: null, error }
    }
  }

  /**
   * Generate markdown documentation of current schema
   */
  async generateSchemaMarkdown() {
    const { data: tables } = await this.getSchemaInfo()
    const { data: relationships } = await this.getTableRelationships()
    
    if (!tables) return ''
    
    let markdown = `# Database Schema\n\n`
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`
    markdown += `## Tables (${tables.length})\n\n`
    
    tables.forEach((table: any) => {
      markdown += `### ${table.table_name}\n\n`
      
      if (table.columns && table.columns.length > 0) {
        markdown += `| Column | Type | Nullable | Default |\n`
        markdown += `|--------|------|----------|----------|\n`
        
        table.columns.forEach((col: any) => {
          const nullable = col.is_nullable === 'YES' ? 'YES' : 'NO'
          const defaultVal = col.column_default || '-'
          markdown += `| ${col.column_name} | ${col.data_type} | ${nullable} | ${defaultVal} |\n`
        })
        markdown += `\n`
      }
      
      // Add relationships for this table
      const tableRels = relationships?.filter((rel: any) => rel.table_name === table.table_name) || []
      if (tableRels.length > 0) {
        markdown += `**Foreign Keys:**\n`
        tableRels.forEach((rel: any) => {
          markdown += `- ${rel.column_name} → ${rel.foreign_table_name}.${rel.foreign_column_name}\n`
        })
        markdown += `\n`
      }
      
      markdown += `---\n\n`
    })
    
    return markdown
  }
}

// Export a singleton instance
export const dbAdmin = new DatabaseAdmin()