export type Product = {
  id: number;
  name: string;
  subtitle: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  reviews: number;
  badge?: string;
  emoji: string;
  imagePath?: string;
  bgTone: string;
};

export type CollectionItem = {
  label: string;
  filterValue: string;
  imagePath: string;
  fallbackIcon: string;
};

export const NAV_COLLECTIONS: string[] = [
  "All",
  "Wireless Earbuds",
  "Wireless Headphones",
  "Sound Bars & Home Theater",
  "Portable Speakers",
  "2.1 Speaker",
  "Wired Earphones",
  "Trolley Speakers",
  "Mobile Accessories",
];

export const COLLECTIONS: CollectionItem[] = [
  {
    label: "WIRELESS EARBUDS",
    filterValue: "Wireless Earbuds",
    imagePath: "/collections/earbuds.jpg",
    fallbackIcon: "🎧",
  },
  {
    label: "WIRELESS HEADPHONES",
    filterValue: "Wireless Headphones",
    imagePath: "/collections/headphone.jpg",
    fallbackIcon: "🎧",
  },
  {
    label: "SOUND BARS & HOME THEATER",
    filterValue: "Sound Bars & Home Theater",
    imagePath: "/collections/headphone1.jpg",
    fallbackIcon: "📺",
  },
  {
    label: "PORTABLE SPEAKERS",
    filterValue: "Portable Speakers",
    imagePath: "/collections/powerbank.jpg",
    fallbackIcon: "🔊",
  },
  {
    label: "2.1 SPEAKER",
    filterValue: "2.1 Speaker",
    imagePath: "/collections/powerbank1.jpg",
    fallbackIcon: "🔈",
  },
  {
    label: "WIRED EARPHONES",
    filterValue: "Wired Earphones",
    imagePath: "/collections/mobilecharger.jpg",
    fallbackIcon: "🎙️",
  },
  {
    label: "TROLLEY SPEAKERS",
    filterValue: "Trolley Speakers",
    imagePath: "/collections/powerbank1.jpg",
    fallbackIcon: "📢",
  },
  {
    label: "MOBILE ACCESSORIES",
    filterValue: "Mobile Accessories",
    imagePath: "/collections/mobilecharger.jpg",
    fallbackIcon: "🔋",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "GrowMore Airbud 550 ANC Pro",
    subtitle: "Active Noise Cancelling • 36H Playtime",
    category: "Wireless Earbuds",
    originalPrice: 6999,
    salePrice: 4499,
    reviews: 142,
    badge: "BEST SELLER",
    emoji: "🎧",
    imagePath: "/collections/earbuds.jpg",
    bgTone: "bg-stone-100",
  },
  {
    id: 2,
    name: "GrowMore Studio Bass Over-Ear",
    subtitle: "Wireless & AUX • Soft Memory Cushions",
    category: "Wireless Headphones",
    originalPrice: 7500,
    salePrice: 4999,
    reviews: 98,
    badge: "HOT",
    emoji: "🎧",
    imagePath: "/collections/headphone.jpg",
    bgTone: "bg-zinc-100",
  },
  {
    id: 3,
    name: "GrowMore Pro Headphones Edition",
    subtitle: "Deep Sound • Comfortable Fit • Clear Audio",
    category: "Sound Bars & Home Theater",
    originalPrice: 22000,
    salePrice: 16999,
    reviews: 64,
    badge: "NEW",
    emoji: "🎧",
    imagePath: "/collections/headphone1.jpg",
    bgTone: "bg-neutral-100",
  },
  {
    id: 4,
    name: "GrowMore Fast PowerBank 20K",
    subtitle: "Fast Charging • Compact Body • Multi-Port",
    category: "Portable Speakers",
    originalPrice: 6400,
    salePrice: 4299,
    reviews: 210,
    badge: "SAVE 33%",
    emoji: "🔋",
    imagePath: "/collections/powerbank.jpg",
    bgTone: "bg-stone-100",
  },
  {
    id: 5,
    name: "GrowMore PowerBank Pro Bundle",
    subtitle: "High Capacity • Everyday Backup Power",
    category: "2.1 Speaker",
    originalPrice: 14500,
    salePrice: 10999,
    reviews: 83,
    emoji: "🔋",
    imagePath: "/collections/powerbank1.jpg",
    bgTone: "bg-neutral-100",
  },
  {
    id: 6,
    name: "GrowMore Fast Charger + Cable",
    subtitle: "Quick Charge Adapter • Durable Data Cable",
    category: "Mobile Accessories",
    originalPrice: 5500,
    salePrice: 3699,
    reviews: 119,
    badge: "COMBO",
    emoji: "🔌",
    imagePath: "/collections/mobilecharger.jpg",
    bgTone: "bg-amber-50/60",
  },
];