import ChessHero from "@/components/chess/ChessHero";
import ChessIntro from "@/components/chess/ChessIntro";
import ChessBoard from "@/components/chess/ChessBoard";
import ChessSaturday from "@/components/chess/ChessSaturday";
import ChessCommunity from "@/components/chess/ChessCommunity";
import ChessGallery from "@/components/chess/ChessGallery";
import ChessClosing from "@/components/chess/ChessClosing";

export const metadata = {
  title: "Chess | SHoP | The Rook & Reed Juicery",
  description:
    "Chess, youth, learning, community and competition at The House in Kilimani.",
};

export default function ChessPage() {
  return (
    <main>
      <ChessHero />
      <ChessIntro />
      <ChessBoard />
      <ChessSaturday />
      <ChessCommunity />
      <ChessGallery />
      <ChessClosing />
    </main>
  );
}