import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');

// Minimal valid 1x1 PNG (orange pixel)
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

fs.mkdirSync(assetsDir, { recursive: true });
for (const name of ['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png']) {
  fs.writeFileSync(path.join(assetsDir, name), PNG);
}
console.log('Created placeholder assets');
