import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.join(__dirname, '..', 'assets', 'products');

const SOURCE_MAP = {
  'lunchbox-1.jpg': 'backpack.jpg',
  'lunchbox-2.jpg': 'party.jpg',
  'lunchbox-3.jpg': 'carnival.jpg',
  'school-bag-1.jpg': 'backpack.jpg',
  'school-bag-2.jpg': 'backpack.jpg',
  'stationery-1.jpg': 'school-hero.jpg',
  'stationery-2.jpg': 'school-hero.jpg',
  'toys-1.jpg': 'party.jpg',
  'toys-2.jpg': 'carnival.jpg',
  'baby-1.jpg': 'zoo.jpg',
  'baby-2.jpg': 'summer.jpg',
  'snacks-1.jpg': 'party.jpg',
  'snacks-2.jpg': 'carnival.jpg',
  'summer-1.jpg': 'summer.jpg',
  'summer-2.jpg': 'summer.jpg',
  'pool-1.jpg': 'summer.jpg',
  'carnival-1.jpg': 'carnival.jpg',
  'carnival-2.jpg': 'party.jpg',
  'hero-school.jpg': 'school-hero.jpg',
  'hero-summer.jpg': 'summer.jpg',
  'hero-carnival.jpg': 'carnival.jpg',
  'petting-zoo.jpg': 'zoo.jpg',
};

fs.mkdirSync(productsDir, { recursive: true });

for (const [target, source] of Object.entries(SOURCE_MAP)) {
  const sourcePath = path.join(productsDir, source);
  const targetPath = path.join(productsDir, target);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Skip ${target}: missing ${source}`);
    continue;
  }
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Created ${target}`);
}

console.log('Product image assets ready.');
