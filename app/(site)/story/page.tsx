import StoryHero from "@/components/story/StoryHero";
import StoryManifesto from "@/components/story/StoryManifesto";
import StoryRookReed from "@/components/story/StoryRookReed";
import StoryPlace from "@/components/story/StoryPlace";
import StoryCulture from "@/components/story/StoryCulture";
import StoryClosing from "@/components/story/StoryClosing";

export const metadata = {
  title: "Our Story | The Rook & Reed Juicery",
  description:
    "Discover the idea behind The Rook & Reed Juicery.",
};

export default function StoryPage() {
  return (
    <main>
      <StoryHero />

      <StoryManifesto />

      <StoryRookReed />

      <StoryPlace />

      <StoryCulture />

      <StoryClosing />
    </main>
  );
}