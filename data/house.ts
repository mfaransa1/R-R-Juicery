export type HousePillar = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  href: string;
  action: string;
};

export const housePillars: HousePillar[] = [
  {
    id: "juice",
    title: "The Juicery",
    kicker: "BODY",
    description:
      "Fresh juice, thoughtful combinations and visible preparation. This is where the daily rhythm of Rook & Reed begins.",
    href: "/menu",
    action: "Explore the menu",
  },
  {
    id: "chess",
    title: "SHoP",
    kicker: "MIND",
    description:
      "Chess, youth, learning, community and competition. SHoP has its own identity while sharing the House.",
    href: "/chess",
    action: "Discover SHoP",
  },
  {
    id: "jazz",
    title: "The Reed",
    kicker: "SOUL",
    description:
      "Jazz listening, featured artists, vinyl evenings, live sessions and music chosen for the room.",
    href: "/jazz",
    action: "Enter The Reed",
  },
  {
    id: "books",
    title: "The Shelf",
    kicker: "CULTURE",
    description:
      "Books on philosophy, biographies, African literature, music history and chess — selected to encourage curiosity.",
    href: "/journal",
    action: "Explore the Journal",
  },
];

export const housePrinciples = [
  "Come for the juice.",
  "Stay for the music.",
  "Read something.",
  "Play a game.",
  "Meet someone.",
  "Take your time.",
];