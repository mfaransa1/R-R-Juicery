export type IngredientSeason = {
  label: string;
  months: string;
};

export type Ingredient = {
  slug: string;
  name: string;
  category: "fruit" | "vegetable" | "herb" | "spice" | "cane";
  description: string;
  shortDescription: string;
  organicStatus:
    | "verified_organic"
    | "supplier_claimed"
    | "conventional"
    | "unknown";
  source: string;
  origin: string;
  preparation: string;
  storage: string;
  seasonality: IngredientSeason;
  image: string;
  video?: string;
  color: string;
  featured?: boolean;
};

export const ingredients: Ingredient[] = [
  {
    slug: "pineapple",
    name: "Pineapple",
    category: "fruit",
    description:
      "Bright, tropical and naturally expressive, pineapple brings the character of fresh tropical fruit to the Rook & Reed menu.",
    shortDescription: "Tropical. Bright. Juicy.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed, trimmed and prepared before pressing or blending.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/pineapple.jpg",
    video: "/videos/ingredients/pineapple.mp4",
    color: "#d8ad3d",
    featured: true,
  },

  {
    slug: "orange",
    name: "Orange",
    category: "fruit",
    description:
      "A bright citrus ingredient used across several Rook & Reed compositions.",
    shortDescription: "Citrus. Bright. Fresh.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed, peeled and prepared before pressing.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/orange.jpg",
    video: "/videos/ingredients/orange.mp4",
    color: "#e98b32",
  },

  {
    slug: "ginger",
    name: "Ginger",
    category: "spice",
    description:
      "A distinctive aromatic ingredient that gives several Rook & Reed compositions their characteristic spicy finish.",
    shortDescription: "Warm. Aromatic. Spiced.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed, trimmed and prepared before use.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/ginger.jpg",
    video: "/videos/ingredients/ginger.mp4",
    color: "#b98545",
    featured: true,
  },

  {
    slug: "cucumber",
    name: "Cucumber",
    category: "vegetable",
    description:
      "Clean, crisp and refreshing, cucumber forms part of Rook & Reed's greener compositions.",
    shortDescription: "Clean. Crisp. Green.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed and cut before pressing or blending.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/cucumber.jpg",
    video: "/videos/ingredients/cucumber.mp4",
    color: "#9eaf82",
    featured: true,
  },

  {
    slug: "green-apple",
    name: "Green Apple",
    category: "fruit",
    description:
      "Crisp green apple contributes a fresh fruit character to the greener side of the menu.",
    shortDescription: "Crisp. Tart. Fresh.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed, cored and prepared before pressing.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/green-apple.jpg",
    video: "/videos/ingredients/green-apple.mp4",
    color: "#9cab63",
  },

  {
    slug: "spinach",
    name: "Spinach",
    category: "vegetable",
    description:
      "A leafy green ingredient used in The Green Rook.",
    shortDescription: "Leafy. Green. Earthy.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed thoroughly and prepared before blending.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/spinach.jpg",
    video: "/videos/ingredients/spinach.mp4",
    color: "#5d754b",
  },

  {
    slug: "lemon",
    name: "Lemon",
    category: "fruit",
    description:
      "A sharp citrus note used to bring brightness and contrast to selected compositions.",
    shortDescription: "Sharp. Citrus. Bright.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed and prepared before use.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/lemon.jpg",
    video: "/videos/ingredients/lemon.mp4",
    color: "#d7c54b",
  },

  {
    slug: "mint",
    name: "Mint",
    category: "herb",
    description:
      "A fresh aromatic herb appearing across several Rook & Reed compositions.",
    shortDescription: "Fresh. Aromatic. Cool.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed and prepared before use.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/mint.jpg",
    video: "/videos/ingredients/mint.mp4",
    color: "#91aa82",
  },

  {
    slug: "beetroot",
    name: "Beetroot",
    category: "vegetable",
    description:
      "Deep in colour and earthy in character, beetroot gives selected Rook & Reed compositions their distinctive depth.",
    shortDescription: "Deep. Earthy. Bold.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed, trimmed and prepared before pressing or blending.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/beetroot.jpg",
    video: "/videos/ingredients/beetroot.mp4",
    color: "#7c3f47",
    featured: true,
  },

  {
    slug: "mango",
    name: "Mango",
    category: "fruit",
    description:
      "A rich tropical fruit used in several Rook & Reed compositions.",
    shortDescription: "Tropical. Rich. Golden.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed, peeled and cut before blending.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/mango.jpg",
    video: "/videos/ingredients/mango.mp4",
    color: "#dda044",
    featured: true,
  },

  {
    slug: "passion",
    name: "Passion",
    category: "fruit",
    description:
      "A distinctive tropical ingredient bringing aromatic acidity and character to the menu.",
    shortDescription: "Aromatic. Tropical. Tart.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed and prepared before use.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/passion.jpg",
    video: "/videos/ingredients/passion.mp4",
    color: "#a78437",
  },

  {
    slug: "watermelon",
    name: "Watermelon",
    category: "fruit",
    description:
      "A refreshing fruit appearing in several of the House compositions.",
    shortDescription: "Fresh. Juicy. Light.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed, trimmed and cut before pressing or blending.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/watermelon.jpg",
    video: "/videos/ingredients/watermelon.mp4",
    color: "#d9786e",
  },

  {
    slug: "lime",
    name: "Lime",
    category: "fruit",
    description:
      "A sharp citrus ingredient used to lift selected House compositions and cane drinks.",
    shortDescription: "Sharp. Green. Citrus.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed and prepared before use.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/lime.jpg",
    video: "/videos/ingredients/lime.mp4",
    color: "#9cad59",
  },

  {
    slug: "sugarcane",
    name: "Sugarcane",
    category: "cane",
    description:
      "Fresh sugarcane forms the base of the Rook & Reed cane collection.",
    shortDescription: "Fresh. Cane. Naturally sweet.",
    organicStatus: "unknown",
    source: "REQUIRED INPUT",
    origin: "REQUIRED INPUT",
    preparation: "Washed, trimmed and processed before serving.",
    storage: "REQUIRED INPUT",
    seasonality: {
      label: "Seasonality",
      months: "REQUIRED INPUT",
    },
    image: "/images/ingredients/sugarcane.jpg",
    video: "/videos/ingredients/sugarcane.mp4",
    color: "#b9a66b",
    featured: true,
  },
];

export const featuredIngredients = ingredients.filter(
  (ingredient) => ingredient.featured,
);