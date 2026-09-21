export type ProductCategory =
  | "presses"
  | "house-compositions"
  | "cane"
  | "interludes"
  | "blenders"
  | "seasonal-records";

export type OrganicStatus =
  | "verified_organic"
  | "supplier_claimed"
  | "conventional"
  | "unknown";

export type Ingredient = {
  name: string;
  amount?: string;
  organicStatus: OrganicStatus;
  source?: string;
};

export type ProductMood =
  | "Bright"
  | "Green"
  | "Tropical"
  | "Citrus"
  | "Spiced"
  | "Deep";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  note: string;
  price: number;
  size: string;
  ingredients: Ingredient[];
  preparation: string;
  freshness: string;
  additives: string;
  concentrate: string;
  featured?: boolean;
  tone: string;
  image?: string;
  moods?: ProductMood[];
};

export const productCategories = [
  {
    slug: "presses",
    name: "The Presses",
    description:
      "Fresh combinations pressed close to the moment they reach your glass.",
  },
  {
    slug: "house-compositions",
    name: "The House Compositions",
    description:
      "R&R signatures built around balance, contrast and character.",
  },
  {
    slug: "cane",
    name: "The Cane",
    description:
      "Fresh sugarcane with bright, clean additions.",
  },
  {
    slug: "interludes",
    name: "The Interludes",
    description:
      "Small, concentrated moments between the bigger moves.",
  },
  {
    slug: "blenders",
    name: "The Blenders",
    description:
      "Thick, fruit-forward compositions made for a slower sip.",
  },
  {
    slug: "seasonal-records",
    name: "The Seasonal Records",
    description:
      "Limited compositions that follow what is good right now.",
  },
] as const;

export const products: Product[] = [
  {
    slug: "the-first-move",
    name: "The First Move",
    category: "house-compositions",
    categoryLabel: "The House Compositions",
    description:
      "Pineapple, orange and ginger brought together in a bright, clean opening move.",
    note: "Every game begins somewhere.",
    price: 350,
    size: "500ml",
    ingredients: [
      {
        name: "Pineapple",
        organicStatus: "unknown",
      },
      {
        name: "Orange",
        organicStatus: "unknown",
      },
      {
        name: "Ginger",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared and pressed.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    featured: true,
    tone: "pineapple",
    image: "/images/products/the-first-move.jpg",
    moods: ["Bright", "Tropical", "Citrus", "Spiced"],
  },

  {
    slug: "the-green-rook",
    name: "The Green Rook",
    category: "house-compositions",
    categoryLabel: "The House Compositions",
    description:
      "Cucumber, green apple, spinach, lemon and mint in a steady, refreshing composition.",
    note: "Steady. Fresh. Uncomplicated.",
    price: 350,
    size: "500ml",
    ingredients: [
      {
        name: "Cucumber",
        organicStatus: "unknown",
      },
      {
        name: "Green Apple",
        organicStatus: "unknown",
      },
      {
        name: "Spinach",
        organicStatus: "unknown",
      },
      {
        name: "Lemon",
        organicStatus: "unknown",
      },
      {
        name: "Mint",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared and pressed.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    featured: true,
    tone: "cucumber",
    image: "/images/products/the-green-rook.jpg",
    moods: ["Green", "Citrus"],
  },

  {
    slug: "ruby-endgame",
    name: "Ruby Endgame",
    category: "house-compositions",
    categoryLabel: "The House Compositions",
    description:
      "Beetroot, apple, pineapple and ginger for a deeper, bolder finish.",
    note: "A bold finish.",
    price: 350,
    size: "500ml",
    ingredients: [
      {
        name: "Beetroot",
        organicStatus: "unknown",
      },
      {
        name: "Apple",
        organicStatus: "unknown",
      },
      {
        name: "Pineapple",
        organicStatus: "unknown",
      },
      {
        name: "Ginger",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared and pressed.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    featured: true,
    tone: "beet",
    image: "/images/products/ruby-endgame.jpg",
    moods: ["Deep", "Tropical", "Spiced"],
  },

  {
    slug: "golden-reed",
    name: "Golden Reed",
    category: "house-compositions",
    categoryLabel: "The House Compositions",
    description:
      "Mango, passion and orange with bright notes and a smooth finish.",
    note: "Bright notes. Smooth finish.",
    price: 350,
    size: "500ml",
    ingredients: [
      {
        name: "Mango",
        organicStatus: "unknown",
      },
      {
        name: "Passion",
        organicStatus: "unknown",
      },
      {
        name: "Orange",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    tone: "mango",
    image: "/images/products/golden-reed.jpg",
    moods: ["Bright", "Tropical", "Citrus"],
  },

  {
    slug: "queens-passage",
    name: "Queen's Passage",
    category: "house-compositions",
    categoryLabel: "The House Compositions",
    description:
      "Watermelon, pineapple, mint and lime — light, bright and refreshing.",
    note: "A little room to breathe.",
    price: 350,
    size: "500ml",
    ingredients: [
      {
        name: "Watermelon",
        organicStatus: "unknown",
      },
      {
        name: "Pineapple",
        organicStatus: "unknown",
      },
      {
        name: "Mint",
        organicStatus: "unknown",
      },
      {
        name: "Lime",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    tone: "watermelon",
    image: "/images/products/queens-passage.jpg",
    moods: ["Bright", "Green", "Tropical", "Citrus"],
  },

  {
    slug: "sunday-session",
    name: "Sunday Session",
    category: "house-compositions",
    categoryLabel: "The House Compositions",
    description:
      "Watermelon, passion and pineapple for a relaxed fruit-forward composition.",
    note: "Nothing rushed.",
    price: 350,
    size: "500ml",
    ingredients: [
      {
        name: "Watermelon",
        organicStatus: "unknown",
      },
      {
        name: "Passion",
        organicStatus: "unknown",
      },
      {
        name: "Pineapple",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    tone: "passion",
    image: "/images/products/sunday-session.jpg",
    moods: ["Bright", "Tropical"],
  },

  {
    slug: "the-long-game",
    name: "The Long Game",
    category: "cane",
    categoryLabel: "The Cane",
    description:
      "Fresh sugarcane sharpened with ginger, lime and mint.",
    note: "Patience has its rewards.",
    price: 300,
    size: "500ml",
    ingredients: [
      {
        name: "Sugarcane",
        organicStatus: "unknown",
      },
      {
        name: "Ginger",
        organicStatus: "unknown",
      },
      {
        name: "Lime",
        organicStatus: "unknown",
      },
      {
        name: "Mint",
        organicStatus: "unknown",
      },
    ],
    preparation: "Fresh sugarcane pressed to order.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    tone: "cane",
    image: "/images/products/the-long-game.jpg",
    moods: ["Green", "Citrus", "Spiced"],
  },

  {
    slug: "midnight-reed",
    name: "Midnight Reed",
    category: "house-compositions",
    categoryLabel: "The House Compositions",
    description:
      "Pineapple, beetroot, ginger and lime for a darker, sharper composition.",
    note: "For the late thinkers.",
    price: 400,
    size: "500ml",
    ingredients: [
      {
        name: "Pineapple",
        organicStatus: "unknown",
      },
      {
        name: "Beetroot",
        organicStatus: "unknown",
      },
      {
        name: "Ginger",
        organicStatus: "unknown",
      },
      {
        name: "Lime",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared and pressed.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    tone: "beet",
    image: "/images/products/midnight-reed.jpg",
    moods: ["Deep", "Tropical", "Citrus", "Spiced"],
  },

  {
    slug: "kilimani-sunrise",
    name: "Kilimani Sunrise",
    category: "presses",
    categoryLabel: "The Presses",
    description:
      "Orange, mango and passion — bright enough for a Nairobi morning.",
    note: "Nairobi mornings, freshly pressed.",
    price: 350,
    size: "500ml",
    ingredients: [
      {
        name: "Orange",
        organicStatus: "unknown",
      },
      {
        name: "Mango",
        organicStatus: "unknown",
      },
      {
        name: "Passion",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared and pressed.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    tone: "mango",
    image: "/images/products/kilimani-sunrise.jpg",
    moods: ["Bright", "Tropical", "Citrus"],
  },

  {
    slug: "the-quiet-move",
    name: "The Quiet Move",
    category: "presses",
    categoryLabel: "The Presses",
    description:
      "Green apple, cucumber, lemon and mint kept deliberately simple.",
    note: "Sometimes less is more.",
    price: 350,
    size: "500ml",
    ingredients: [
      {
        name: "Green Apple",
        organicStatus: "unknown",
      },
      {
        name: "Cucumber",
        organicStatus: "unknown",
      },
      {
        name: "Lemon",
        organicStatus: "unknown",
      },
      {
        name: "Mint",
        organicStatus: "unknown",
      },
    ],
    preparation: "Freshly prepared and pressed.",
    freshness: "Prepared close to service.",
    additives: "No unnecessary additives.",
    concentrate: "No concentrate.",
    tone: "mint",
    image: "/images/products/the-quiet-move.jpg",
    moods: ["Green", "Citrus"],
  },
];

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getProductsByCategory = (
  category: ProductCategory,
) =>
  products.filter(
    (product) => product.category === category,
  );