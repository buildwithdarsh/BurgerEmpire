// Generate OG placeholder images for SEO
// Run: node scripts/generate-og-images.mjs
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const PUBLIC = new URL('../public', import.meta.url).pathname;

// Brand colours
const BG = '#FFF9F0';
const GOLD = '#EB7A29';
const DARK = '#1A1A1A';

function makeSvg(title, width = 1200, height = 630) {
  const escaped = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${BG}"/>
  <rect y="0" width="100%" height="8" fill="${GOLD}"/>
  <rect y="${height - 8}" width="100%" height="8" fill="${GOLD}"/>
  <text x="50%" y="45%" text-anchor="middle" dominant-baseline="central"
    font-family="Arial Black, Helvetica, sans-serif" font-size="64" font-weight="900" fill="${DARK}">
    Burger Empire
  </text>
  <text x="50%" y="60%" text-anchor="middle" dominant-baseline="central"
    font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#666">
    ${escaped}
  </text>
</svg>`;
}

const images = [
  // Core OG images
  { path: 'images/og-home.jpg', title: "Gwalior's Original Burger Brand" },
  { path: 'images/og-menu.jpg', title: 'Our Menu — Burgers from ₹69' },
  // Blog OG images
  { path: 'images/og/blog-best-burgers-2025.jpg', title: 'Best Burgers in Gwalior 2025' },
  { path: 'images/og/blog-vs-mcdonalds.jpg', title: 'Burger Empire vs McDonald\'s' },
  { path: 'images/og/blog-student-food.jpg', title: 'Best Student Food in Gwalior' },
  { path: 'images/og/blog-our-story.jpg', title: 'Our Story — Since 2018' },
  { path: 'images/og/blog-late-night.jpg', title: 'Late Night Food in Gwalior' },
  // Outlet images
  { path: 'images/outlets/city-center.jpg', title: 'City Center Outlet' },
  { path: 'images/outlets/lashkar.jpg', title: 'Lashkar Outlet' },
  { path: 'images/outlets/mahalgaon.jpg', title: 'Mahalgaon Outlet' },
  { path: 'images/outlets/dd-nagar.jpg', title: 'D.D. Nagar Outlet' },
  { path: 'images/outlets/morar.jpg', title: 'Morar Outlet' },
  { path: 'images/outlets/kila-road.jpg', title: 'Kila Road Outlet' },
];

for (const img of images) {
  const outPath = join(PUBLIC, img.path);
  const dir = dirname(outPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const svg = Buffer.from(makeSvg(img.title));
  await sharp(svg).jpeg({ quality: 85 }).toFile(outPath);
  console.log(`✓ ${img.path}`);
}

console.log('\nDone! Replace these placeholders with real branded images before launch.');
