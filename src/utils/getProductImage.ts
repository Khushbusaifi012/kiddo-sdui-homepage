import { resolveImageSource } from '../campaigns/productImages';
import type { ImageSource } from 'expo-image';

export function getProductImage(imageUrl: string): ImageSource {
  return resolveImageSource(imageUrl);
}
