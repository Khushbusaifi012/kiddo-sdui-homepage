import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'src', 'campaigns');

const asset = (key) => `asset://${key}`;

const HERO_IMAGES = {
  school: asset('hero-school'),
  summer: asset('hero-summer'),
  carnival: asset('hero-carnival'),
  pettingZoo: asset('petting-zoo'),
};

const CATEGORY_ASSETS = {
  lunchboxes: ['lunchbox-1', 'lunchbox-2', 'lunchbox-3'],
  schoolBags: ['school-bag-1', 'school-bag-2', 'lunchbox-3'],
  stationery: ['stationery-1', 'stationery-2'],
  toys: ['toys-1', 'toys-2', 'carnival-1'],
  baby: ['baby-1', 'baby-2'],
  snacks: ['snacks-1', 'snacks-2'],
  summer: ['summer-1', 'summer-2', 'pool-1'],
  carnival: ['carnival-1', 'carnival-2', 'toys-2'],
};

function pickImage(categories, index) {
  const category = categories[index % categories.length];
  const pool = CATEGORY_ASSETS[category] ?? CATEGORY_ASSETS.lunchboxes;
  return asset(pool[index % pool.length]);
}

const SCHOOL_NAMES = {
  lunchboxes: [
    'Spiderman Lunchbox',
    'Insulated Tiffin Set',
    'Bento Box 3-Compartment',
    'Frozen Elsa Lunch Kit',
    'Steel Lunch Box Combo',
    'Mickey Mouse Lunch Bag',
    'Leak-proof Lunch Carrier',
    'Unicorn Lunch Set',
  ],
  schoolBags: [
    'Skyline School Backpack',
    'Rolling Bag with Lunch',
    'Waterproof School Bag',
    'Reflective Safety Backpack',
    'Lightweight Kids Bag',
    'Character Print Backpack',
    'Ergonomic School Bag',
    'Dual Compartment Bag',
  ],
  stationery: [
    'Geometry Box Deluxe',
    'Crayon Set 24 Shades',
    'Notebook Bundle (5pc)',
    'Pencil Pouch Kit',
    'Marker & Highlighter Set',
    'Glue & Scissors Pack',
    'A4 Ruled Notebook',
    'Art & Craft Starter Kit',
  ],
  snacks: [
    'Oats Energy Bar (6pc)',
    'Fruit Bites Multipack',
    'Protein Ladoo Box',
    'Mini Cookies Assorted',
    'Dry Fruit Trail Mix',
    'Banana Chips Pack',
    'Millet Crackers',
    'Yogurt Bites Freeze-Dried',
  ],
};

const SUMMER_NAMES = {
  toys: [
    'Beach Ball Set',
    'Water Gun Super Soaker',
    'Sand Castle Kit',
    'Inflatable Pool Ring',
    'Bubble Machine',
    'Frisbee Flying Disc',
    'Outdoor Cricket Set',
    'Splash Pad Mat',
  ],
  essentials: [
    'Kids Swim Goggles',
    'UV Protection Cap',
    'Cotton Summer Romper',
    'Flip-Flops Pair',
    'Sunscreen Kids SPF 50',
    'Hydration Sipper',
    'Cooling Towel',
    'Mosquito Repellent Patch',
  ],
};

const CARNIVAL_NAMES = {
  deals: [
    'Mystery Gift Box',
    'Surprise Toy Hamper',
    'Carnival Candy Jar',
    'LED Party Wand',
    'Pinata Fillers Kit',
    'Magic Trick Set',
    'Sticker Treasure Pack',
    'Spin Wheel Reward',
  ],
  party: [
    'Confetti Popper (3pc)',
    'Birthday Banner Kit',
    'Party Hat Bundle',
    'Balloon Arch Set',
    'Cake Topper Pack',
    'Return Gift Box',
    'Glitter Face Paint',
    'Noise-free Party Horn',
  ],
};

function buildProducts(config) {
  const { prefix, count, startPrice, categories, nameList } = config;
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const id = `${prefix}-${n}`;
    const name = nameList[index % nameList.length] ?? `${prefix} Item ${n}`;
    return {
      id,
      name,
      price: startPrice + (index % 8) * 23 + 49,
      image_url: pickImage(categories, index),
      badge: n % 4 === 0 ? 'HOT' : n % 5 === 0 ? 'NEW' : undefined,
      action: { type: 'ADD_TO_CART', payload: { id } },
    };
  });
}

function grids(productList, prefix) {
  const blocks = [];
  for (let i = 0; i < productList.length; i += 4) {
    const chunk = productList.slice(i, i + 4);
    if (chunk.length < 4) break;
    blocks.push({
      id: `${prefix}-grid-${i / 4 + 1}`,
      type: 'PRODUCT_GRID_2X2',
      data: { title: `Top Picks ${i / 4 + 1}`, products: chunk },
    });
  }
  return blocks;
}

function collection(id, title, subtitle, tag, items) {
  return {
    id,
    type: 'DYNAMIC_COLLECTION',
    data: { title, subtitle, theme_tag: tag, items },
  };
}

function fillerGrids(prefix, count, startPrice, categories, nameList) {
  return Array.from({ length: count }, (_, index) => {
    const i = index + 1;
    return {
      id: `${prefix}-filler-${i}`,
      type: 'PRODUCT_GRID_2X2',
      data: {
        title: `Quick Buys ${i}`,
        products: buildProducts({
          prefix: `${prefix}-f-${i}`,
          count: 4,
          startPrice: startPrice + i * 8,
          categories,
          nameList,
        }),
      },
    };
  });
}

function unknownBlock() {
  return {
    id: 'unsupported-v2',
    type: 'NEW_COMPONENT_V2',
    data: { message: 'This block should be dropped safely' },
  };
}

const schoolCategories = ['lunchboxes', 'schoolBags', 'stationery', 'toys', 'baby', 'snacks'];
const schoolNameList = [
  ...SCHOOL_NAMES.lunchboxes,
  ...SCHOOL_NAMES.schoolBags,
  ...SCHOOL_NAMES.stationery,
  ...SCHOOL_NAMES.snacks,
];

const summerCategories = ['toys', 'summer', 'baby', 'snacks'];
const summerNameList = [...SUMMER_NAMES.toys, ...SUMMER_NAMES.essentials];

const carnivalCategories = ['toys', 'carnival', 'baby', 'snacks'];
const carnivalNameList = [...CARNIVAL_NAMES.deals, ...CARNIVAL_NAMES.party];

const schoolProducts = buildProducts({
  prefix: 'school',
  count: 48,
  startPrice: 99,
  categories: schoolCategories,
  nameList: schoolNameList,
});

const summerProducts = buildProducts({
  prefix: 'summer',
  count: 48,
  startPrice: 129,
  categories: summerCategories,
  nameList: summerNameList,
});

const carnivalProducts = buildProducts({
  prefix: 'carnival',
  count: 48,
  startPrice: 79,
  categories: carnivalCategories,
  nameList: carnivalNameList,
});

// Curated lunchbox & bag row with explicit images
const lunchboxRow = SCHOOL_NAMES.lunchboxes.map((name, i) => ({
  id: `lunchbox-${i + 1}`,
  name,
  price: 149 + i * 40,
  image_url: asset(CATEGORY_ASSETS.lunchboxes[i % CATEGORY_ASSETS.lunchboxes.length]),
  badge: i === 0 ? 'BESTSELLER' : undefined,
  action: { type: 'ADD_TO_CART', payload: { id: `lunchbox-${i + 1}` } },
}));

const summerEssentialsRow = SUMMER_NAMES.essentials.map((name, i) => ({
  id: `summer-essential-${i + 1}`,
  name,
  price: 99 + i * 35,
  image_url: asset(CATEGORY_ASSETS.summer[i % CATEGORY_ASSETS.summer.length]),
  action: { type: 'ADD_TO_CART', payload: { id: `summer-essential-${i + 1}` } },
}));

const carnivalDealsRow = CARNIVAL_NAMES.deals.map((name, i) => ({
  id: `carnival-deal-${i + 1}`,
  name,
  price: 59 + i * 30,
  image_url: asset(CATEGORY_ASSETS.carnival[i % CATEGORY_ASSETS.carnival.length]),
  badge: i === 0 ? 'MYSTERY' : undefined,
  action:
    i === 0
      ? { type: 'APPLY_MYSTERY_GIFT_COUPON', payload: { code: 'MYSTERY50' } }
      : { type: 'ADD_TO_CART', payload: { id: `carnival-deal-${i + 1}` } },
}));

const campaigns = {
  'back-to-school': {
    campaign_id: 'back-to-school',
    campaign_name: 'Back to School Mega-Sale',
    theme: {
      primary: '#FFD100',
      secondary: '#0057D9',
      background: '#FFFBE6',
      surface: '#FFFFFF',
      text: '#1A1A2E',
      accent: '#0057D9',
    },
    blocks: [
      {
        id: 'hero-school',
        type: 'BANNER_HERO',
        data: {
          title: 'Back to School Mega-Sale',
          subtitle: 'Lunchboxes, bags & stationery — up to 50% off',
          image_url: HERO_IMAGES.school,
          cta_label: 'Shop Now',
        },
        action: { type: 'DEEP_LINK', payload: { url: '/category/back-to-school' } },
      },
      collection('lunchboxes-bags', 'Lunchboxes & Bags', 'Editor picks for school season', 'MEGA SALE', lunchboxRow),
      ...grids(schoolProducts.slice(8, 32), 'school-a'),
      collection('snacks-under-99', 'Snacks under ₹99', 'Quick bites for tiffin breaks', 'VALUE', schoolProducts.slice(32, 40)),
      ...grids(schoolProducts.slice(32, 48), 'school-b'),
      ...fillerGrids('school', 16, 89, schoolCategories, schoolNameList),
      unknownBlock(),
    ],
  },
  'summer-playhouse': {
    campaign_id: 'summer-playhouse',
    campaign_name: 'Summer Playhouse Festival',
    theme: {
      primary: '#0077BE',
      secondary: '#00B4D8',
      background: '#E8F6FF',
      surface: '#FFFFFF',
      text: '#023047',
      accent: '#00B4D8',
    },
    blocks: [
      {
        id: 'hero-summer',
        type: 'BANNER_HERO',
        data: {
          title: 'Summer Playhouse Festival',
          subtitle: 'Splash into fun — toys, pools & outdoor play',
          image_url: HERO_IMAGES.summer,
          cta_label: 'Explore Festival',
        },
        action: { type: 'VIEW_CAMPAIGN', payload: { name: 'summer-playhouse' } },
      },
      collection('summer-essentials', 'Summer Essentials', 'Beat the heat with curated picks', 'COOL', summerEssentialsRow),
      {
        id: 'petting-zoo',
        type: 'EVENT_BOOKING_ROW',
        data: {
          title: 'Petting Zoo Tickets',
          description: 'Interactive farm experience for kids aged 3-10. Includes feeding session.',
          price: 499,
          image_url: HERO_IMAGES.pettingZoo,
          slots: ['10 AM', '1 PM', '4 PM'],
        },
        action: { type: 'BOOK_EVENT', payload: { event_id: 'petting-zoo' } },
      },
      ...grids(summerProducts.slice(8, 32), 'summer-a'),
      collection('pool-party', 'Pool Party Picks', 'Floaters, goggles & swimwear', 'SPLASH', summerProducts.slice(32, 40)),
      ...grids(summerProducts.slice(32, 48), 'summer-b'),
      ...fillerGrids('summer', 16, 79, summerCategories, summerNameList),
      unknownBlock(),
    ],
  },
  'mystery-carnival': {
    campaign_id: 'mystery-carnival',
    campaign_name: 'Mystery Gift Carnival',
    theme: {
      primary: '#E63946',
      secondary: '#C1121F',
      background: '#FFF0F0',
      surface: '#FFFFFF',
      text: '#370617',
      accent: '#F77F00',
    },
    blocks: [
      {
        id: 'hero-carnival',
        type: 'BANNER_HERO',
        data: {
          title: 'Mystery Gift Carnival',
          subtitle: 'Spin the wheel — unlock surprise rewards on every order',
          image_url: HERO_IMAGES.carnival,
          cta_label: 'Claim Mystery Gift',
        },
        action: { type: 'APPLY_MYSTERY_GIFT_COUPON', payload: {} },
      },
      collection('mystery-deals', 'Mystery Deal Row', 'Tap to reveal carnival specials', 'CARNIVAL', carnivalDealsRow),
      ...grids(carnivalProducts.slice(8, 32), 'carnival-a'),
      collection('party-favors', 'Party Favors', 'Confetti, caps & celebration kits', 'POP', carnivalProducts.slice(32, 40)),
      ...grids(carnivalProducts.slice(32, 48), 'carnival-b'),
      ...fillerGrids('carnival', 16, 59, carnivalCategories, carnivalNameList),
      unknownBlock(),
    ],
  },
};

for (const [name, payload] of Object.entries(campaigns)) {
  const filePath = path.join(outDir, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${filePath} (${payload.blocks.length} blocks)`);
}
