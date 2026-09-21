import VisitHero from "@/components/visit/VisitHero";
import VisitDetails from "@/components/visit/VisitDetails";
import VisitExperience from "@/components/visit/VisitExperience";
import VisitMap from "@/components/visit/VisitMap";
import VisitHouse from "@/components/visit/VisitHouse";
import VisitContact from "@/components/visit/VisitContact";
import VisitClosing from "@/components/visit/VisitClosing";

export const metadata = {
  title: "Visit | The Rook & Reed Juicery",
  description:
    "Visit The Rook & Reed Juicery at Rook & Reed Plaza, Kilimani, Nairobi.",
};

export default function VisitPage() {
  return (
    <main>
      <VisitHero />
      <VisitDetails />
      <VisitExperience />
      <VisitMap />
      <VisitHouse />
      <VisitContact />
      <VisitClosing />
    </main>
  );
}