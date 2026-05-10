/**
 * Downloads menu item images from Zomato CDN → public/menu/
 * Run: node scripts/download-menu-images.mjs
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'menu');

const items = [
  { filename: 'combo-4-burgers.jpeg',          url: 'https://b.zmtcdn.com/data/dish_photos/40a/888511d22819308e573a9311e1f2740a.jpeg' },
  { filename: 'combo-veg-king-x2.jpeg',         url: 'https://b.zmtcdn.com/data/dish_photos/3fb/6ca89aa6291f1e09ac914cb8be1313fb.jpeg' },
  { filename: 'combo-aloo-tikki-crispy-veg.png',url: 'https://b.zmtcdn.com/data/dish_photos/50b/024db1ef60641398763a181d321e350b.png' },
  { filename: 'combo-crispy-chilli-loaded.png', url: 'https://b.zmtcdn.com/data/dish_photos/0dd/e9ea4d64894cf14db8c0fd0cb99ab0dd.png' },
  { filename: 'combo-crispy-chilli-peri.png',   url: 'https://b.zmtcdn.com/data/dish_photos/584/f04700bc1da4ec542b250223be94f584.png' },
  { filename: 'combo-double-crispy-loaded.png', url: 'https://b.zmtcdn.com/data/dish_photos/cf0/a02047fb781bf9bb5dde354cf1975cf0.png' },
  { filename: 'combo-paneer-peri-fries.png',    url: 'https://b.zmtcdn.com/data/dish_photos/136/783e2558f426a8b9490364975e44d136.png' },
  { filename: 'combo-veg-king-chilli.png',      url: 'https://b.zmtcdn.com/data/dish_photos/61a/21e55284fa49b68370fc27989872c61a.png' },
  { filename: 'desi-masala-crunch.png',         url: 'https://b.zmtcdn.com/data/dish_photos/605/a3ef0459ee82350bc45ac74d96e3f605.png' },
  { filename: 'veg-king-burger.png',            url: 'https://b.zmtcdn.com/data/dish_photos/d2a/64824d3ef60a25c83d9370e7beca7d2a.png' },
  { filename: 'paneer-supreme-burger.png',      url: 'https://b.zmtcdn.com/data/dish_photos/15a/be570b5a8bc56864c5fc6576677e315a.png' },
  { filename: 'veg-chilli-loaded-burger.png',   url: 'https://b.zmtcdn.com/data/dish_photos/e6c/4b7bcac64ceb229028bfc94b5abd4e6c.png' },
  { filename: 'double-crispy-cheese-burger.png',url: 'https://b.zmtcdn.com/data/dish_photos/1e3/8ca1db57e753a5769fcb9d68a491a1e3.png' },
  { filename: 'aloo-tikki-twist-burger.png',    url: 'https://b.zmtcdn.com/data/dish_photos/22b/651604abecd94ccaf8be8d896944322b.png' },
  { filename: 'crispy-veg-burger.png',          url: 'https://b.zmtcdn.com/data/dish_photos/31e/cfa55bbdd064b911caab366ab3b1e31e.png' },
  { filename: 'paneer-wrap.png',                url: 'https://b.zmtcdn.com/data/dish_photos/8cb/5af8cc1bcf55ea1fad96397626c7c8cb.png' },
  { filename: 'veg-wrap.png',                   url: 'https://b.zmtcdn.com/data/dish_photos/6e0/df3af509275d103d8e541f9b7c9876e0.png' },
  { filename: 'loaded-fries.png',               url: 'https://b.zmtcdn.com/data/dish_photos/476/7c587e46e68cb501569b967c4178b476.png' },
  { filename: 'peri-peri-fries.jpeg',           url: 'https://b.zmtcdn.com/data/dish_photos/4cb/6a2b5019f5c40175c3f6965369fe04cb.jpeg' },
  { filename: 'salted-fries.jpeg',              url: 'https://b.zmtcdn.com/data/dish_photos/6a7/1912b2473da1c54ae15a54df018186a7.jpeg' },
  { filename: 'oreo-thick-shake.png',           url: 'https://b.zmtcdn.com/data/dish_photos/9b5/ce61d0dddf36b5ae0b21dacc32ad79b5.png' },
  { filename: 'chocolava.png',                  url: 'https://b.zmtcdn.com/data/dish_photos/c12/a0f4499a632236786fb7c8807ef48c12.png' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`Downloading ${items.length} images to public/menu/\n`);
  let ok = 0, fail = 0;
  for (const item of items) {
    const dest = path.join(OUTPUT_DIR, item.filename);
    process.stdout.write(`  ${item.filename} ... `);
    try {
      await download(item.url, dest);
      console.log('✅');
      ok++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} downloaded, ${fail} failed`);
}

main();
