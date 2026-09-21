export type EventIdentity = "R&R" | "SHoP";

export type EventItem = {
  slug: string;
  identity: EventIdentity;
  category: string;
  title: string;
  shortTitle: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  featured?: boolean;
  status?: string;
};

export const events: EventItem[] = [
  {
    slug: "sunday-session-01",
    identity: "R&R",
    category: "MUSIC",
    title: "Sunday Session",
    shortTitle: "Sunday Session",
    description:
      "A slower Sunday at The House — juice, conversation and carefully selected music.",
    date: "SUNDAY / DATE TBC",
    time: "TIME TBC",
    location: "The Reed, The House",
    image: "/images/events/sunday-session.jpg",
    featured: true,
    status: "UPCOMING",
  },
  {
    slug: "shop-saturday-chess-01",
    identity: "SHoP",
    category: "CHESS",
    title: "SHoP Saturday Chess",
    shortTitle: "SHoP Saturday",
    description:
      "A Saturday chess gathering for players, learners, young competitors and the wider chess community.",
    date: "EVERY SATURDAY",
    time: "TIME TBC",
    location: "SHoP, The House",
    image: "/images/events/shop-saturday.jpg",
    featured: true,
    status: "RECURRING",
  },
  {
    slug: "vinyl-evening-01",
    identity: "R&R",
    category: "MUSIC",
    title: "Vinyl Evening",
    shortTitle: "Vinyl Evening",
    description:
      "An evening built around records, listening and conversation. One side at a time.",
    date: "DATE TBC",
    time: "TIME TBC",
    location: "The Reed, The House",
    image: "/images/events/vinyl-evening.jpg",
    status: "UPCOMING",
  },
  {
    slug: "featured-artist-session-01",
    identity: "R&R",
    category: "LIVE MUSIC",
    title: "Featured Artist Session",
    shortTitle: "Featured Artist",
    description:
      "An intimate music session featuring an artist from Nairobi's wider creative community.",
    date: "DATE TBC",
    time: "TIME TBC",
    location: "The Reed, The House",
    image: "/images/events/featured-artist.jpg",
    status: "UPCOMING",
  },
  {
    slug: "album-of-the-month-01",
    identity: "R&R",
    category: "LISTENING",
    title: "Album of the Month",
    shortTitle: "Album of the Month",
    description:
      "One record. One month. A dedicated listening experience around an album worth spending time with.",
    date: "DATE TBC",
    time: "TIME TBC",
    location: "The Reed, The House",
    image: "/images/events/album-of-month.jpg",
    status: "UPCOMING",
  },
  {
    slug: "house-reading-01",
    identity: "R&R",
    category: "BOOKS",
    title: "House Reading",
    shortTitle: "House Reading",
    description:
      "A relaxed gathering around books, ideas and conversation from The Shelf.",
    date: "DATE TBC",
    time: "TIME TBC",
    location: "The House",
    image: "/images/events/house-reading.jpg",
    status: "UPCOMING",
  },
  {
    slug: "chess-learning-session-01",
    identity: "SHoP",
    category: "LEARNING",
    title: "Chess Learning Session",
    shortTitle: "Chess Learning",
    description:
      "A placeholder session for chess learning, study and practical play.",
    date: "DATE TBC",
    time: "TIME TBC",
    location: "SHoP, The House",
    image: "/images/events/chess-learning.jpg",
    status: "UPCOMING",
  },
  {
    slug: "house-culture-night-01",
    identity: "R&R",
    category: "CULTURE",
    title: "House Culture Night",
    shortTitle: "Culture Night",
    description:
      "An evening bringing together music, books, conversation and the wider culture of The House.",
    date: "DATE TBC",
    time: "TIME TBC",
    location: "The House",
    image: "/images/events/culture-night.jpg",
    status: "UPCOMING",
  },
];