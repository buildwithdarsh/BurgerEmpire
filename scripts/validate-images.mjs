#!/usr/bin/env node
/**
 * Validate all image URLs in data/menu.json
 * Checks every imageUrl in variants for HTTP 200.
 * Run: node scripts/validate-images.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const menuPath = resolve(__dirname, '../data/menu.json');
const menu = JSON.parse(readFileSync(menuPath, 'utf-8'));

const urls = new Map(); // url → [{itemId, variantType}]

for (const item of menu.items) {
  for (const v of item.variants || []) {
    if (v.imageUrl) {
      if (!urls.has(v.imageUrl)) urls.set(v.imageUrl, []);
      urls.get(v.imageUrl).push({ itemId: item.id, slug: item.slug, variant: v.variantType, name: v.name });
    }
  }
}

console.log(`\nFound ${urls.size} unique image URLs across ${menu.items.length} items\n`);

let ok = 0;
let fail = 0;
const failures = [];

const CONCURRENCY = 10;
const entries = [...urls.entries()];

for (let i = 0; i < entries.length; i += CONCURRENCY) {
  const batch = entries.slice(i, i + CONCURRENCY);
  const results = await Promise.all(
    batch.map(async ([url, refs]) => {
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
        if (res.ok) {
          return { url, status: res.status, ok: true, refs };
        }
        return { url, status: res.status, ok: false, refs };
      } catch (err) {
        return { url, status: err.message || 'TIMEOUT', ok: false, refs };
      }
    })
  );

  for (const r of results) {
    if (r.ok) {
      ok++;
      process.stdout.write('.');
    } else {
      fail++;
      process.stdout.write('X');
      failures.push(r);
    }
  }
}

console.log(`\n\n✅ ${ok} OK  ❌ ${fail} Failed\n`);

if (failures.length > 0) {
  console.log('─── Failed URLs ───\n');
  for (const f of failures) {
    console.log(`  ${f.status} ${f.url}`);
    for (const ref of f.refs) {
      console.log(`       └─ ${ref.itemId} (${ref.variant}) "${ref.name}"`);
    }
  }
  console.log('');
  process.exit(1);
} else {
  console.log('All image URLs are valid! 🎉\n');
}
