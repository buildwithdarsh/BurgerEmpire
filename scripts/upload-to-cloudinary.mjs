/**
 * One-time migration: upload all images from public/ to Cloudinary.
 *
 * Run:  node scripts/upload-to-cloudinary.mjs
 *
 * Uploads to burgerempire/<relative-path> on Cloudinary, preserving folder structure.
 * Skips favicons and manifest files (those must stay in public/).
 */

import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync } from 'fs';
import { join, relative, parse } from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dakd6siup',
  api_key: process.env.CLOUDINARY_API_KEY || '426735438483193',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4KVgLd2Qv7ZTDbUfdRKUv7tX-L4',
  secure: true,
});

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
const SKIP_FILES = new Set(['favicon.ico', 'site.webmanifest', 'robots.txt']);
const PREFIX = 'burgerempire';

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      // Skip hidden dirs
      if (!entry.startsWith('.')) results.push(...walkDir(fullPath));
    } else {
      const { ext } = parse(entry);
      if (IMAGE_EXTS.has(ext.toLowerCase()) && !SKIP_FILES.has(entry)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function uploadFile(filePath) {
  const rel = relative(PUBLIC_DIR, filePath);
  const { dir, name } = parse(rel);
  const folder = dir ? `${PREFIX}/${dir}` : PREFIX;
  const publicId = `${folder}/${name}`;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      unique_filename: false,
      use_filename: false,
    });
    console.log(`  ✅ ${rel} → ${result.public_id} (${(result.bytes / 1024).toFixed(1)}KB)`);
    return { path: rel, publicId: result.public_id, url: result.secure_url };
  } catch (err) {
    console.error(`  ❌ ${rel} — ${err.message}`);
    return null;
  }
}

async function main() {
  const files = walkDir(PUBLIC_DIR);
  console.log(`\nFound ${files.length} images in public/\n`);

  const results = [];
  // Upload sequentially to avoid rate limits
  for (const file of files) {
    const result = await uploadFile(file);
    if (result) results.push(result);
  }

  console.log(`\n✅ Uploaded ${results.length}/${files.length} images to Cloudinary\n`);

  // Print mapping for reference
  console.log('--- Path Mapping (old → new) ---');
  for (const r of results) {
    console.log(`  /${r.path}  →  ${r.publicId}`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
