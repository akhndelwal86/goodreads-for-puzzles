import fetch from 'node-fetch';
import { fileTypeFromBuffer } from 'file-type';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);
  const buffer = await response.buffer();
  if (buffer.length > MAX_FILE_SIZE) throw new Error('Image too large');
  return buffer;
}

async function validateImage(buffer) {
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !ALLOWED_MIME_TYPES.includes(type.mime)) {
    throw new Error('Invalid image type');
  }
  return type;
}

async function uploadToSupabase(buffer, ext, puzzleId, supabase) {
  const fileName = `main-images/puzzle-${puzzleId}-${uuidv4()}.${ext}`;
  const { error } = await supabase.storage
    .from('puzzle-photos')
    .upload(fileName, buffer, {
      contentType: `image/${ext}`,
      upsert: false
    });
  if (error) throw new Error('Supabase upload failed: ' + error.message);
  // Get public URL
  const { data: urlData } = supabase.storage.from('puzzle-photos').getPublicUrl(fileName);
  if (!urlData || !urlData.publicUrl) throw new Error('Failed to get public URL');
  return urlData.publicUrl;
}

export async function processPuzzleImage(imageUrl, puzzleId, supabase, dryRun = false) {
  if (!imageUrl || imageUrl.startsWith('https://your-supabase-url')) return imageUrl; // Already uploaded
  if (dryRun) return '[DRY RUN] Would upload image for ' + puzzleId;
  let buffer, type;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      buffer = await downloadImage(imageUrl);
      type = await validateImage(buffer);
      return await uploadToSupabase(buffer, type.ext, puzzleId, supabase);
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise(res => setTimeout(res, 500 * attempt));
    }
  }
} 