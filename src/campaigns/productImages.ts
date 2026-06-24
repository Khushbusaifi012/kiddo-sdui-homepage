import type { ImageSource } from 'expo-image';

export const PRODUCT_IMAGE_MAP: Record<string, ImageSource> = {
  'lunchbox-1': require('../../assets/products/lunchbox-1.jpg'),
  'lunchbox-2': require('../../assets/products/lunchbox-2.jpg'),
  'lunchbox-3': require('../../assets/products/lunchbox-3.jpg'),
  'school-bag-1': require('../../assets/products/school-bag-1.jpg'),
  'school-bag-2': require('../../assets/products/school-bag-2.jpg'),
  'stationery-1': require('../../assets/products/stationery-1.jpg'),
  'stationery-2': require('../../assets/products/stationery-2.jpg'),
  'toys-1': require('../../assets/products/toys-1.jpg'),
  'toys-2': require('../../assets/products/toys-2.jpg'),
  'baby-1': require('../../assets/products/baby-1.jpg'),
  'baby-2': require('../../assets/products/baby-2.jpg'),
  'snacks-1': require('../../assets/products/snacks-1.jpg'),
  'snacks-2': require('../../assets/products/snacks-2.jpg'),
  'summer-1': require('../../assets/products/summer-1.jpg'),
  'summer-2': require('../../assets/products/summer-2.jpg'),
  'pool-1': require('../../assets/products/pool-1.jpg'),
  'carnival-1': require('../../assets/products/carnival-1.jpg'),
  'carnival-2': require('../../assets/products/carnival-2.jpg'),
  'hero-school': require('../../assets/products/hero-school.jpg'),
  'hero-summer': require('../../assets/products/hero-summer.jpg'),
  'hero-carnival': require('../../assets/products/hero-carnival.jpg'),
  'petting-zoo': require('../../assets/products/petting-zoo.jpg'),
};

const CATEGORY_ROTATION = [
  'lunchbox-1',
  'school-bag-1',
  'stationery-1',
  'toys-1',
  'baby-1',
  'snacks-1',
  'lunchbox-2',
  'school-bag-2',
  'stationery-2',
  'toys-2',
  'baby-2',
  'snacks-2',
  'summer-1',
  'pool-1',
  'carnival-1',
  'carnival-2',
];

export function imageAssetForCategory(category: string, index: number): string {
  const pools: Record<string, string[]> = {
    lunchboxes: ['lunchbox-1', 'lunchbox-2', 'lunchbox-3'],
    schoolBags: ['school-bag-1', 'school-bag-2', 'lunchbox-3'],
    stationery: ['stationery-1', 'stationery-2'],
    toys: ['toys-1', 'toys-2', 'carnival-1'],
    baby: ['baby-1', 'baby-2'],
    snacks: ['snacks-1', 'snacks-2'],
    summer: ['summer-1', 'summer-2', 'pool-1'],
    carnival: ['carnival-1', 'carnival-2', 'toys-2'],
  };

  const pool = pools[category] ?? CATEGORY_ROTATION;
  return pool[index % pool.length] ?? CATEGORY_ROTATION[index % CATEGORY_ROTATION.length] ?? 'lunchbox-1';
}

export function toAssetUrl(assetKey: string): string {
  return `asset://${assetKey}`;
}

export function resolveImageSource(imageUrl: string): ImageSource {
  if (imageUrl.startsWith('asset://')) {
    const key = imageUrl.slice('asset://'.length);
    const mapped = PRODUCT_IMAGE_MAP[key];
    if (mapped) {
      return mapped;
    }
  }

  return { uri: imageUrl };
}
