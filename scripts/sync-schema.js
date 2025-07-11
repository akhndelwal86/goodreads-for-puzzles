#!/usr/bin/env node

/**
 * Automated Schema Documentation Generator
 * Fetches current database schema and updates documentation
 */

const fs = require('fs');
const path = require('path');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const DOCS_PATH = path.join(process.cwd(), 'docs', 'supabase_schema.md');

async function fetchSchema() {
  try {
    console.log('🔍 Fetching current database schema...');
    
    const response = await fetch(`${SERVER_URL}/api/db/schema?format=markdown`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const markdown = await response.text();
    return markdown;
    
  } catch (error) {
    console.error('❌ Failed to fetch schema:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Make sure the development server is running: npm run dev');
    }
    
    process.exit(1);
  }
}

async function updateSchemaDoc(markdown) {
  try {
    console.log('📝 Updating schema documentation...');
    
    // Add header with generation info
    const header = `<!-- AUTO-GENERATED SCHEMA DOCUMENTATION -->
<!-- Generated: ${new Date().toISOString()} -->
<!-- Source: ${SERVER_URL}/api/db/schema -->
<!-- DO NOT EDIT MANUALLY - Run 'npm run db:sync-schema' to update -->

`;
    
    const content = header + markdown;
    
    // Ensure docs directory exists
    const docsDir = path.dirname(DOCS_PATH);
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(DOCS_PATH, content, 'utf8');
    
    console.log('✅ Schema documentation updated:', DOCS_PATH);
    
  } catch (error) {
    console.error('❌ Failed to write schema documentation:', error.message);
    process.exit(1);
  }
}

async function compareWithExisting() {
  if (!fs.existsSync(DOCS_PATH)) {
    console.log('📄 No existing schema documentation found - will create new file');
    return { hasChanges: true, isNew: true };
  }
  
  try {
    const existing = fs.readFileSync(DOCS_PATH, 'utf8');
    const newSchema = await fetchSchema();
    
    // Remove auto-generated headers for comparison
    const cleanExisting = existing.replace(/<!-- AUTO-GENERATED[\s\S]*?-->\n\n/, '');
    const hasChanges = cleanExisting.trim() !== newSchema.trim();
    
    return { hasChanges, isNew: false };
    
  } catch (error) {
    console.log('⚠️  Could not compare with existing file:', error.message);
    return { hasChanges: true, isNew: false };
  }
}

async function main() {
  console.log('🚀 Starting schema documentation sync...\n');
  
  // Check for changes first
  const { hasChanges, isNew } = await compareWithExisting();
  
  if (!hasChanges && !isNew) {
    console.log('✨ Schema documentation is already up to date!');
    return;
  }
  
  if (isNew) {
    console.log('🆕 Creating new schema documentation...');
  } else {
    console.log('🔄 Schema changes detected, updating documentation...');
  }
  
  // Fetch and update
  const markdown = await fetchSchema();
  await updateSchemaDoc(markdown);
  
  console.log('\n🎉 Schema sync completed successfully!');
  console.log(`📖 Documentation available at: ${DOCS_PATH}`);
}

// Handle command line execution
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Schema sync failed:', error);
    process.exit(1);
  });
}

module.exports = { fetchSchema, updateSchemaDoc, compareWithExisting };