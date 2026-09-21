export type JournalCategory =
  | "JUICE"
  | "THE HOUSE"
  | "THE REED"
  | "SHoP"
  | "INGREDIENTS"
  | "CULTURE";

export type JournalPost = {
  slug: string;
  category: JournalCategory;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
};

export const journalPosts: JournalPost[] = [
  {
    slug: "why-we-show-you-whats-in-your-juice",
    category: "JUICE",
    title: "Why We Show You What's In Your Juice",
    excerpt:
      "Transparency changes the way we think about what we drink. At R&R, the process belongs in the experience.",
    date: "REQUIRED INPUT",
    readTime: "5 MIN READ",
    image: "/images/journal/transparency.jpg",
    featured: true,
  },
  {
    slug: "the-long-game",
    category: "JUICE",
    title: "The Long Game",
    excerpt:
      "Sugarcane, ginger, lime and mint — a composition built around brightness, freshness and a little bite.",
    date: "REQUIRED INPUT",
    readTime: "4 MIN READ",
    image: "/images/journal/the-long-game.jpg",
  },
  {
    slug: "inside-the-reed",
    category: "THE REED",
    title: "Inside The Reed",
    excerpt:
      "Why music belongs in the House, and why sometimes the best thing to do is simply listen.",
    date: "REQUIRED INPUT",
    readTime: "6 MIN READ",
    image: "/images/journal/the-reed.jpg",
  },
  {
    slug: "the-ritual-of-the-board",
    category: "SHoP",
    title: "The Ritual of the Board",
    excerpt:
      "There is something about sitting across from another person and giving the game your full attention.",
    date: "REQUIRED INPUT",
    readTime: "5 MIN READ",
    image: "/images/journal/chess-board.jpg",
  },
  {
    slug: "from-farm-to-juice",
    category: "INGREDIENTS",
    title: "From Farm to Juice",
    excerpt:
      "A closer look at the journey an ingredient takes before it reaches the bottle.",
    date: "REQUIRED INPUT",
    readTime: "7 MIN READ",
    image: "/images/journal/from-farm.jpg",
  },
  {
    slug: "the-bookshelf",
    category: "CULTURE",
    title: "The Bookshelf",
    excerpt:
      "The books that help shape the conversations happening around the House.",
    date: "REQUIRED INPUT",
    readTime: "4 MIN READ",
    image: "/images/journal/bookshelf.jpg",
  },
];