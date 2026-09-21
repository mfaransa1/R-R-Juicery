import JazzHero from "@/components/jazz/JazzHero";
import JazzIntro from "@/components/jazz/JazzIntro";
import NowPlaying from "@/components/jazz/NowPlaying";
import JazzSessions from "@/components/jazz/JazzSessions";
import JazzCulture from "@/components/jazz/JazzCulture";
import JazzReedRoom from "@/components/jazz/JazzReedRoom";
import JazzClosing from "@/components/jazz/JazzClosing";

export const metadata = {
  title: "Jazz | The Reed | The Rook & Reed Juicery",
  description:
    "The Reed — jazz, records, listening culture, artists and conversation at The Rook & Reed Juicery.",
};

export default function JazzPage() {
  return (
    <main>
      <JazzHero />
      <JazzIntro />
      <NowPlaying />
      <JazzSessions />
      <JazzCulture />
      <JazzReedRoom />
      <JazzClosing />
    </main>
  );
}