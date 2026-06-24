# Kiddo SDUI Homepage Renderer

Production-style **Server-Driven UI (SDUI)** homepage for Kiddo — a React Native renderer that parses mock JSON payloads and dynamically builds the homepage without app store releases.

## Features

- **Component Registry (Factory Pattern)** — maps `BANNER_HERO`, `PRODUCT_GRID_2X2`, `DYNAMIC_COLLECTION`, `EVENT_BOOKING_ROW` to isolated components
- **Graceful degradation** — unknown types (e.g. `NEW_COMPONENT_V2`) are silently dropped
- **Single vertical FlashList** — entire feed virtualized with stable `keyExtractor` + `React.memo` boundaries
- **Nested horizontal collections** — `DYNAMIC_COLLECTION` uses nested `FlatList` with fixed height + `nestedScrollEnabled`
- **Central action dispatcher** — `handleAction()` routes `ADD_TO_CART`, `DEEP_LINK`, `APPLY_MYSTERY_GIFT_COUPON`, `BOOK_EVENT`
- **Live campaign OTA switching** — 3 bundled campaign profiles switch runtime theme + layout instantly
- **Theme injection** — `ThemeProvider` applies server-driven palette to all nested components
- **Full-screen overlay** — Lottie animations with `pointerEvents="none"` (no input blocking)
- **Cart isolation** — Zustand per-product selectors; adding to cart does not re-render other blocks

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 52 + React Native |
| Language | TypeScript (strict mode) |
| List | `@shopify/flash-list` |
| State | Zustand (cart + campaign) |
| Animations | `lottie-react-native` + `expo-image` |

## Project Structure

```
src/
├── actions/actionDispatcher.ts    # Central handleAction coordinator
├── campaigns/                     # 3 mock SDUI payloads (JSON)
├── components/                    # Atomic layout blocks
├── context/ThemeContext.tsx       # OTA theme provider
├── engine/
│   ├── BlockRenderer.tsx          # Memoized block → component resolver
│   ├── ComponentRegistry.ts       # Factory hash-map registry
│   └── types.ts                   # Strict payload & action contracts
├── screens/HomeScreen.tsx         # Master vertical FlashList feed
└── store/
    ├── campaignStore.ts           # Active campaign / payload
    └── cartStore.ts               # Collocated cart quantities
```

## Getting Started

```bash
# Install dependencies
npm install

# Regenerate campaign JSON payloads (optional)
node scripts/generate-campaigns.mjs

# Start Expo
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) or press `a` for Android emulator / `i` for iOS simulator.

## Campaign Profiles

| Campaign | Theme | Special Components |
|----------|-------|-------------------|
| Back to School | Yellow + Blue | Lottie paper planes overlay, Lunchboxes & Bags row |
| Summer Playhouse | Ocean blue | Water splash Lottie, Petting Zoo booking row |
| Mystery Gift Carnival | Carnival red | Confetti overlay, mystery coupon actions |

Use the **Live Campaigns (OTA)** chips at the top to switch campaigns instantly.

## Architecture Notes

### Registry over switch-case

```typescript
const registry: Record<string, BlockComponent> = {
  BANNER_HERO: BannerHero,
  PRODUCT_GRID_2X2: ProductGrid2x2,
  // ...
};
```

### Re-render isolation

`ProductCard` subscribes only to its own quantity:

```typescript
const quantity = useCartStore((s) => s.quantities[productId] ?? 0);
```

`BlockRenderer` is memoized with referential equality on `block.data` — campaign switch replaces the full payload reference, but cart updates only touch the affected `ProductCard`.
