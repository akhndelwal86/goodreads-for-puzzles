# Database Administration Tools

This directory contains tools for direct database access, migration management, and automated schema documentation.

## 🚀 Quick Start

1. **Ensure development server is running**: `npm run dev`
2. **Run your first migration**: Create the admin function
3. **Sync schema documentation**: `npm run db:sync-schema`

## 📋 Available Commands

### Schema Management
```bash
# Get current schema as JSON
npm run db:schema

# Get current schema as Markdown
npm run db:schema:md

# Auto-generate schema documentation
npm run db:sync-schema
```

### Migration Management
```bash
# Check migration status
npm run db:migrate:status

# Run a specific migration
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"filename": "your-migration.sql"}'

# Execute raw SQL
curl -X PUT http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM puzzles LIMIT 5;"}'
```

### Direct Database Access
```bash
# Connect to database (when credentials are configured)
npm run db:connect

# Execute single command
./scripts/db-connect.sh "SELECT COUNT(*) FROM puzzles;"
```

## 🔧 API Endpoints

### GET `/api/db/schema`
Returns current database schema information.

**Query Parameters:**
- `format`: `json` (default) or `markdown`
- `table`: Get info for specific table only

**Examples:**
```bash
# All tables as JSON
curl http://localhost:3000/api/db/schema

# Specific table
curl http://localhost:3000/api/db/schema?table=puzzles

# Markdown format
curl "http://localhost:3000/api/db/schema?format=markdown"
```

### GET `/api/db/migrate`
Returns migration status and available migration files.

**Response:**
```json
{
  "executed": [
    {
      "filename": "add_puzzle_specifications.sql",
      "executed_at": "2025-01-11T...",
      "success": true,
      "checksum": "abc123..."
    }
  ],
  "available": ["migration1.sql", "migration2.sql"],
  "pending": ["migration2.sql"]
}
```

### POST `/api/db/migrate`
Execute a migration file or SQL.

**Body:**
```json
{
  "filename": "add_puzzle_specifications.sql",  // OR
  "sql": "ALTER TABLE puzzles ADD COLUMN...",
  "force": false  // Skip already-executed check
}
```

### PUT `/api/db/migrate`
Execute raw SQL queries.

**Body:**
```json
{
  "sql": "SELECT * FROM puzzles WHERE piece_count > 1000;"
}
```

## 📁 File Structure

```
scripts/
├── README.md              # This file
├── db-connect.sh          # Direct psql connection helper
└── sync-schema.js         # Automated schema documentation

src/app/api/db/
├── schema/route.ts        # Schema introspection API
└── migrate/route.ts       # Migration execution API

src/lib/
└── db-admin.ts           # Database admin utilities

migrations/
├── add_puzzle_specifications.sql
└── create_exec_sql_function.sql
```

## 🔐 Security Notes

- All database operations use the Supabase service role
- The `exec_sql` function is created with `SECURITY DEFINER`
- Only use these tools in development/staging environments
- Never expose the migration API in production without authentication

## 🛠️ Setup Requirements

1. **Supabase Service Role Key**: Must be configured in `.env.local`
2. **exec_sql Function**: Run the `create_exec_sql_function.sql` migration first
3. **Development Server**: APIs require the Next.js dev server to be running

## 💡 Workflows

### Running Migrations
1. Create your migration file in `/migrations/`
2. Check status: `npm run db:migrate:status`
3. Execute: `curl -X POST http://localhost:3000/api/db/migrate -H "Content-Type: application/json" -d '{"filename": "your-migration.sql"}'`
4. Update docs: `npm run db:sync-schema`

### Schema Documentation
1. Make database changes
2. Run: `npm run db:sync-schema`
3. Commit the updated `docs/supabase_schema.md`

### Quick Database Queries
```bash
# Check table counts
curl -X PUT http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT table_name, (xpath(\"/row/count/text()\", xml_count))[1]::text::int as row_count FROM (SELECT table_name, query_to_xml(format(\"select count(*) as count from %I.%I\", table_schema, table_name), false, true, \"\") as xml_count FROM information_schema.tables WHERE table_schema = \"public\") t;"}'

# Get puzzle with specifications
curl -X PUT http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT id, title, finished_size_width, finished_size_height FROM puzzles WHERE finished_size_width IS NOT NULL LIMIT 5;"}'
```

## 🚨 Troubleshooting

### "exec_sql function does not exist"
Run the setup migration:
```bash
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"filename": "create_exec_sql_function.sql"}'
```

### "Connection refused"
Make sure the development server is running: `npm run dev`

### "Permission denied"
Ensure your `.env.local` has the correct `SUPABASE_SERVICE_ROLE_KEY`

### Direct psql connection issues
Update the password in `scripts/db-connect.sh` or get the correct credentials from Supabase dashboard.

## 🎯 Benefits

✅ **No more manual Supabase dashboard work**  
✅ **Automated schema documentation**  
✅ **Version-controlled migrations**  
✅ **API-driven database operations**  
✅ **Integration with Claude Code for direct SQL execution**  

Now you can run migrations, inspect schema, and execute SQL directly through Claude Code!