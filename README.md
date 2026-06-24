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
- **Full-screen overlay component** — `FullScreenOverlay.tsx` with `pointerEvents="none"` (implemented; disabled in demo UI)
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

### Prerequisites

- **Node.js** 18+ and **npm**
- For mobile: **Expo Go** app on your phone (optional)

### Install & run (recommended — web)

```bash
# Clone the repo and enter the project folder
cd kiddo-sdui-homepage

# Install dependencies
npm install

# Start the app in the browser
npm run start:web
```

Open **http://localhost:8081** in your browser. The Kiddo homepage should load with campaign chips, product grids, and cart actions.

> **Note:** The demo video was recorded using `npm run start:web` because Expo Go on a local device could not connect due to network/firewall restrictions. The same React Native codebase runs on mobile via Expo Go on a standard network.

### Other run commands

```bash
# Expo dev server (for Expo Go / emulator)
npm start

# Tunnel mode (if phone cannot reach laptop on same WiFi)
npm run start:tunnel

# TypeScript check
npm run typecheck
```

### Optional setup scripts

```bash
# Regenerate campaign JSON payloads
node scripts/generate-campaigns.mjs

# Prepare bundled product images (run after fresh clone if images are missing)
node scripts/prepare-product-images.mjs
```

### Troubleshooting

**`npm install` fails with SSL certificate error**

A `.npmrc` file with `strict-ssl=false` is included for networks that block npm TLS. If install still fails, try:

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED=0
npm install
```

**Expo Go: "failed to download remote update"**

- Use the same WiFi on phone and laptop, or try **phone hotspot**
- Allow **Node.js** through Windows Firewall (private network)
- Or use `npm run start:web` for browser demo

**Port 8081 already in use**

Stop the other terminal running Expo (`Ctrl + C`), then run `npm run start:web` again.

### Mobile (Expo Go)

```bash
npm start
```

Scan the QR code with **Expo Go** (Android/iOS). Phone and laptop must be on the same network (or use `npm run start:tunnel`).

## Campaign Profiles

| Campaign | Theme | Special Components |
|----------|-------|-------------------|
| Back to School | Yellow + Blue | Lunchboxes & Bags row |
| Summer Playhouse | Ocean blue | Petting Zoo booking row |
| Mystery Gift Carnival | Carnival red | Mystery coupon actions |

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
