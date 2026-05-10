/**
 * Removes backgrounds from all menu images using remove.bg API
 * Outputs transparent PNGs to public/menu/ (overwrites originals)
 * Run: node scripts/remove-bg.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MENU_DIR = path.join(__dirname, '..', 'public', 'menu');
const API_KEY = 'fUsUtYPQ8SqYtUnqAbkTLDK2';

async function removeBg(inputPath, outputPath) {
  const fileBlob = await fs.openAsBlob(inputPath);
  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', fileBlob);

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': API_KEY },
    body: formData,
  });

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
  } else {
    const err = await response.text();
    throw new Error(`${response.status}: ${err}`);
  }
}

async function main() {
  const files = fs.readdirSync(MENU_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  console.log(`Processing ${files.length} images with remove.bg...\n`);

  let ok = 0, fail = 0;
  for (const file of files) {
    const inputPath = path.join(MENU_DIR, file);
    // Always output as .png (transparent)
    const outputName = file.replace(/\.(jpg|jpeg)$/i, '.png');
    const outputPath = path.join(MENU_DIR, outputName);
    process.stdout.write(`  ${file} → ${outputName} ... `);
    try {
      await removeBg(inputPath, outputPath);
      // Remove original if it was a jpeg (now replaced by png)
      if (outputName !== file) fs.unlinkSync(inputPath);
      console.log('✅');
      ok++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} processed, ${fail} failed`);
}

main();
