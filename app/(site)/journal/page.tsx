import JournalHero from "@/components/journal/JournalHero";
import JournalFeatured from "@/components/journal/JournalFeatured";
import JournalGrid from "@/components/journal/JournalGrid";
import JournalTopics from "@/components/journal/JournalTopics";
import JournalLetter from "@/components/journal/JournalLetter";
import JournalClosing from "@/components/journal/JournalClosing";

export const metadata = {
  title: "Journal | The Rook & Reed Juicery",
  description:
    "Stories from The Rook & Reed — juice, ingredients, music, chess, books, culture and life around The House.",
};

export default function JournalPage() {
  return (
    <main>
      <JournalHero />
      <JournalFeatured />
      <JournalGrid />
      <JournalTopics />
      <JournalLetter />
      <JournalClosing />
    </main>
  );
}