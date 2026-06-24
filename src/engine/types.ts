export type ActionType =
  | 'ADD_TO_CART'
  | 'DEEP_LINK'
  | 'APPLY_MYSTERY_GIFT_COUPON'
  | 'BOOK_EVENT'
  | 'VIEW_CAMPAIGN';

export interface Action {
  type: ActionType;
  payload?: Record<string, unknown>;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
}

export interface OverlayConfig {
  type: 'FULL_SCREEN_OVERLAY';
  animation_url: string;
  media_type?: 'lottie' | 'webp';
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  badge?: string;
  action?: Action;
}

export interface BannerHeroData {
  title: string;
  subtitle?: string;
  image_url: string;
  cta_label?: string;
}

export interface ProductGridData {
  title?: string;
  products: ProductItem[];
}

export interface DynamicCollectionData {
  title: string;
  subtitle?: string;
  theme_tag?: string;
  items: ProductItem[];
}

export interface EventBookingData {
  title: string;
  description: string;
  price: number;
  image_url: string;
  slots: string[];
}

export interface BlockNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
  action?: Action;
}

export interface HomepagePayload {
  campaign_id: string;
  campaign_name: string;
  theme: ThemeConfig;
  overlay?: OverlayConfig;
  blocks: BlockNode[];
}

export interface BlockComponentProps {
  block: BlockNode;
}

export const KNOWN_BLOCK_TYPES = [
  'BANNER_HERO',
  'PRODUCT_GRID_2X2',
  'DYNAMIC_COLLECTION',
  'EVENT_BOOKING_ROW',
] as const;

export type KnownBlockType = (typeof KNOWN_BLOCK_TYPES)[number];

export function isKnownBlockType(type: string): type is KnownBlockType {
  return (KNOWN_BLOCK_TYPES as readonly string[]).includes(type);
}

export function asBannerHeroData(data: Record<string, unknown>): BannerHeroData {
  return {
    title: String(data.title ?? ''),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    image_url: String(data.image_url ?? ''),
    cta_label: data.cta_label ? String(data.cta_label) : undefined,
  };
}

export function asProductGridData(data: Record<string, unknown>): ProductGridData {
  const products = Array.isArray(data.products) ? (data.products as ProductItem[]) : [];
  return {
    title: data.title ? String(data.title) : undefined,
    products,
  };
}

export function asDynamicCollectionData(data: Record<string, unknown>): DynamicCollectionData {
  const items = Array.isArray(data.items) ? (data.items as ProductItem[]) : [];
  return {
    title: String(data.title ?? ''),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    theme_tag: data.theme_tag ? String(data.theme_tag) : undefined,
    items,
  };
}

export function asEventBookingData(data: Record<string, unknown>): EventBookingData {
  const slots = Array.isArray(data.slots) ? data.slots.map(String) : [];
  return {
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    image_url: String(data.image_url ?? ''),
    slots,
  };
}
