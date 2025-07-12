import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import DataProcessor from './data-processor.js';
import BrandResolver from './brand-resolver.js';
import DatabaseImporter from './database-importer.js';

// Ensure you have installed: node-fetch, file-type, uuid
// npm install node-fetch file-type uuid

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const brandResolver = new BrandResolver(supabase);

async function getJsonFiles(dir) {
  const files = await fs.readdir(dir);
  return files.filter(f => f.endsWith('.json')).map(f => path.join(dir, f));
}

async function main() {
  const args = process.argv.slice(2);
  const inputDir = args[0];
  const dryRun = args.includes('--dry-run');

  if (!inputDir) {
    console.error('Usage: node index.js <input-directory> [--dry-run]');
    process.exit(1);
  }

  const dataProcessor = new DataProcessor(brandResolver, supabase, dryRun);
  const dbImporter = new DatabaseImporter(supabase);

  const files = await getJsonFiles(inputDir);
  console.log(`Found ${files.length} JSON files in ${inputDir}`);

  let imported = 0, skipped = 0, errors = 0;
  for (const file of files) {
    try {
      const raw = JSON.parse(await fs.readFile(file, 'utf8'));
      const processed = await dataProcessor.processPuzzle(raw);
      if (dryRun) {
        console.log(`[DRY RUN] Would import: ${processed.title}`);
        imported++;
      } else {
        const result = await dbImporter.importPuzzle(processed, true);
        if (result.imported) {
          console.log(`Imported: ${processed.title}`);
          imported++;
        } else if (result.skipped) {
          console.log(`Skipped (exists): ${processed.title}`);
          skipped++;
        } else {
          console.error(`Error importing ${processed.title}: ${result.error}`);
          errors++;
        }
      }
    } catch (e) {
      console.error(`Error processing ${file}: ${e.message}`);
      errors++;
    }
  }

  console.log('---');
  console.log(`Import complete. Imported: ${imported}, Skipped: ${skipped}, Errors: ${errors}`);
}

main(); 