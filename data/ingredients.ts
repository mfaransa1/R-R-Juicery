export type OrganicStatus =
  | "verified_organic"
  | "supplier_claimed"
  | "conventional"
  | "unknown";

export type Ingredient = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  origin: string;
  organicStatus: OrganicStatus;
  seasonality: string;
  preparation: string;
  storage: string;
  notes: string;
  tone: string;
  featured?: boolean;
};

export const ingredients: Ingredient[] = [
  {
    slug: "pineapple",
    name: "Pineapple",
    shortName: "Pineapple",
    description:
      "Bright, tropical and naturally expressive. Pineapple brings acidity, sweetness and body to several R&R compositions.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed, trimmed and prepared before pressing or blending.",
    storage:
      "Stored according to fresh-produce handling requirements.",
    notes:
      "Used across several R&R house compositions and presses.",
    tone: "pineapple",
    featured: true,
  },
  {
    slug: "orange",
    name: "Orange",
    shortName: "Orange",
    description:
      "Citrus brightness with a familiar sweetness. Orange gives R&R compositions a clean, lively character.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed, peeled or prepared according to the recipe, then pressed or blended.",
    storage:
      "Stored in a cool, clean environment before preparation.",
    notes:
      "Featured in The First Move and Kilimani Sunrise.",
    tone: "orange",
    featured: true,
  },
  {
    slug: "ginger",
    name: "Ginger",
    shortName: "Ginger",
    description:
      "Sharp, warming and aromatic. Ginger gives a composition a distinct lift and finish.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed, trimmed and portioned before use.",
    storage:
      "Stored in a cool, dry environment appropriate for fresh ginger.",
    notes:
      "Used in juices, sugarcane compositions and Interludes.",
    tone: "ginger",
    featured: true,
  },
  {
    slug: "cucumber",
    name: "Cucumber",
    shortName: "Cucumber",
    description:
      "Clean, cool and uncomplicated. Cucumber gives green compositions a refreshing base.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed and prepared fresh before pressing.",
    storage:
      "Kept chilled and handled as fresh produce.",
    notes:
      "A defining ingredient in The Green Rook and The Quiet Move.",
    tone: "cucumber",
    featured: true,
  },
  {
    slug: "green-apple",
    name: "Green Apple",
    shortName: "Green Apple",
    description:
      "Crisp, tart and bright. Green apple provides acidity and freshness without overwhelming a composition.",
    origin: "Kenya / supplier dependent · To be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed, inspected and prepared before pressing.",
    storage:
      "Stored under appropriate fresh-produce conditions.",
    notes:
      "Used in The Green Rook and The Quiet Move.",
    tone: "apple",
  },
  {
    slug: "spinach",
    name: "Spinach",
    shortName: "Spinach",
    description:
      "A leafy green ingredient that adds depth and character to green compositions.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Availability varies by supply and season.",
    preparation:
      "Washed thoroughly and prepared before blending or pressing.",
    storage:
      "Kept chilled and protected from excess moisture.",
    notes:
      "Used in The Green Rook.",
    tone: "spinach",
  },
  {
    slug: "lemon",
    name: "Lemon",
    shortName: "Lemon",
    description:
      "Bright acidity and clean citrus aroma. Lemon is used to sharpen and balance compositions.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed and prepared fresh before use.",
    storage:
      "Stored in a cool, clean environment.",
    notes:
      "Used in The Green Rook, The Quiet Move and Interludes.",
    tone: "lemon",
  },
  {
    slug: "mint",
    name: "Mint",
    shortName: "Mint",
    description:
      "Cool, aromatic and expressive. Mint gives several R&R drinks a fresh finishing note.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Availability varies by supply.",
    preparation:
      "Washed carefully and prepared close to service.",
    storage:
      "Kept chilled and protected from drying.",
    notes:
      "Used as a finishing ingredient across several compositions.",
    tone: "mint",
  },
  {
    slug: "beetroot",
    name: "Beetroot",
    shortName: "Beetroot",
    description:
      "Deep in colour and character. Beetroot gives R&R compositions their distinctive ruby depth.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed, trimmed and prepared before pressing.",
    storage:
      "Stored in suitable fresh-produce conditions.",
    notes:
      "Featured in Ruby Endgame and Midnight Reed.",
    tone: "beet",
    featured: true,
  },
  {
    slug: "mango",
    name: "Mango",
    shortName: "Mango",
    description:
      "Rich, tropical and naturally sweet. Mango provides body and a smooth fruit character.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Availability varies by variety and season.",
    preparation:
      "Washed, peeled and prepared according to the recipe.",
    storage:
      "Stored according to ripeness and fresh-produce requirements.",
    notes:
      "Featured in Golden Reed and Kilimani Sunrise.",
    tone: "mango",
    featured: true,
  },
  {
    slug: "passion",
    name: "Passion",
    shortName: "Passion",
    description:
      "Aromatic, tart and intensely fruity. Passion brings a distinctive high note to the menu.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed and prepared fresh before use.",
    storage:
      "Stored under appropriate fresh-fruit conditions.",
    notes:
      "Used in Golden Reed, Sunday Session and Kilimani Sunrise.",
    tone: "passion",
  },
  {
    slug: "watermelon",
    name: "Watermelon",
    shortName: "Watermelon",
    description:
      "Light, hydrating and naturally sweet. Watermelon creates an easy, refreshing base.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed, cut and prepared fresh before service.",
    storage:
      "Prepared portions are kept chilled.",
    notes:
      "Featured in Queen's Passage and Sunday Session.",
    tone: "watermelon",
  },
  {
    slug: "lime",
    name: "Lime",
    shortName: "Lime",
    description:
      "Sharp citrus acidity that adds lift and balance.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Seasonal availability varies.",
    preparation:
      "Washed and prepared fresh before use.",
    storage:
      "Stored in a cool, clean environment.",
    notes:
      "Used to brighten sugarcane and selected house compositions.",
    tone: "lime",
  },
  {
    slug: "sugarcane",
    name: "Sugarcane",
    shortName: "Sugarcane",
    description:
      "Fresh cane with a naturally sweet character. Pressed close to service and paired with bright ingredients.",
    origin: "Kenya · Supplier information to be confirmed",
    organicStatus: "unknown",
    seasonality: "Availability varies by supply.",
    preparation:
      "Washed, trimmed and passed through the sugarcane press.",
    storage:
      "Whole cane is stored appropriately before preparation.",
    notes:
      "The foundation of The Cane.",
    tone: "cane",
    featured: true,
  },
];

export function getIngredient(slug: string) {
  return ingredients.find(
    (ingredient) => ingredient.slug === slug,
  );
}