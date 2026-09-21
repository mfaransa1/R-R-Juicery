export type FAQCategory =
  | "JUICE"
  | "INGREDIENTS"
  | "ORDERS"
  | "THE HOUSE"
  | "EVENTS"
  | "VISIT";

export type FAQItem = {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
};

export const faqItems: FAQItem[] = [
  {
    id: "what-is-rook-reed",
    category: "THE HOUSE",
    question: "What is The Rook & Reed Juicery?",
    answer:
      "R&R is a juice and cultural space built around good juice, good music and good company. The House brings together juice, jazz, books, conversation and hospitality.",
  },
  {
    id: "where-are-you",
    category: "VISIT",
    question: "Where are you located?",
    answer:
      "We are at Rook & Reed Plaza, Kilimani, Nairobi.",
  },
  {
    id: "opening-hours",
    category: "VISIT",
    question: "What are your opening hours?",
    answer:
      "R&R is open daily from 8:00 AM to 8:00 PM.",
  },
  {
    id: "what-is-in-juice",
    category: "JUICE",
    question: "What is in my juice?",
    answer:
      "Every product page is designed to show the ingredients and preparation information available for that juice. Our approach is simple: we don't just tell you what's in your juice. We show you.",
  },
  {
    id: "freshness",
    category: "JUICE",
    question: "How fresh is the juice?",
    answer:
      "Freshness information is provided as part of the product transparency system. Final storage and freshness specifications will be published as the production standards are finalized.",
  },
  {
    id: "additives",
    category: "INGREDIENTS",
    question: "Do you add concentrates or unnecessary additives?",
    answer:
      "Our product information includes dedicated fields for additives and concentrates so that the information can be clearly communicated for each product.",
  },
  {
    id: "organic",
    category: "INGREDIENTS",
    question: "Are your ingredients organic?",
    answer:
      "Organic status is recorded ingredient by ingredient rather than being treated as a blanket claim. Each ingredient can be marked as verified organic, supplier claimed, conventional or unknown.",
  },
  {
    id: "ingredients-source",
    category: "INGREDIENTS",
    question: "Where do your ingredients come from?",
    answer:
      "Our sourcing model follows the journey from FARM to SUPPLIER to R&R to JUICE. Specific farm, supplier and certification information will be published as the sourcing records are finalized.",
  },
  {
    id: "order",
    category: "ORDERS",
    question: "Can I order juice?",
    answer:
      "Yes. The website is structured to support online ordering, pickup and delivery. Final ordering and payment functionality will be connected as the commerce system is completed.",
  },
  {
    id: "payment",
    category: "ORDERS",
    question: "How can I pay?",
    answer:
      "The planned payment methods are CASH, M-PESA and PDQ/CARD.",
  },
  {
    id: "delivery",
    category: "ORDERS",
    question: "Do you deliver?",
    answer:
      "Delivery is part of the planned R&R ordering experience. The working delivery model includes free delivery above KSh 2,000 within the service area, with distance-based tiers below that threshold.",
  },
  {
    id: "house",
    category: "THE HOUSE",
    question: "What is The House?",
    answer:
      "The House is the physical and cultural space shared by two identities. R&R represents juice, jazz, books, conversation and hospitality, while SHoP represents chess, youth, learning, community and competition.",
  },
  {
    id: "shop",
    category: "THE HOUSE",
    question: "What is SHoP?",
    answer:
      "SHoP is the chess and community side of The House, centered around chess, youth, learning, community and competition.",
  },
  {
    id: "saturday-chess",
    category: "EVENTS",
    question: "Is there chess every Saturday?",
    answer:
      "SHoP has a Saturday chess tournament as part of its recurring chess programming. Check the Events page for the latest details.",
  },
  {
    id: "jazz",
    category: "EVENTS",
    question: "Do you have jazz events?",
    answer:
      "The Reed is the music side of The House, with programming around jazz, listening sessions, vinyl, featured artists and other music experiences.",
  },
  {
    id: "events",
    category: "EVENTS",
    question: "Where can I see upcoming events?",
    answer:
      "Visit the Events page for the current programme, including R&R and SHoP events.",
  },
  {
    id: "books",
    category: "THE HOUSE",
    question: "Do you have books?",
    answer:
      "Yes. The Shelf is part of the House concept, with a focus on philosophy, biographies, African literature, music history and chess books.",
  },
  {
    id: "contact",
    category: "VISIT",
    question: "How can I contact R&R?",
    answer:
      "You can call or WhatsApp 0758 038 852, or email rookreedjuicery@gmail.com.",
  },
];