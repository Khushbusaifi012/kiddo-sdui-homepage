import type { ComponentType } from 'react';
import type { BlockComponentProps } from './types';
import { BannerHero } from '../components/BannerHero';
import { ProductGrid2x2 } from '../components/ProductGrid2x2';
import { DynamicCollection } from '../components/DynamicCollection';
import { EventBookingRow } from '../components/EventBookingRow';

type BlockComponent = ComponentType<BlockComponentProps>;

const registry: Record<string, BlockComponent> = {
  BANNER_HERO: BannerHero,
  PRODUCT_GRID_2X2: ProductGrid2x2,
  DYNAMIC_COLLECTION: DynamicCollection,
  EVENT_BOOKING_ROW: EventBookingRow,
};

export function resolveBlockComponent(type: string): BlockComponent | null {
  return registry[type] ?? null;
}

export function registerBlockComponent(type: string, component: BlockComponent): void {
  registry[type] = component;
}

export function getRegisteredBlockTypes(): string[] {
  return Object.keys(registry);
}
