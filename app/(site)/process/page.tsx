import ProcessHero from "@/components/juice/ProcessHero";
import ProcessStatement from "@/components/juice/ProcessStatement";
import ProcessStages from "@/components/juice/ProcessStages";
import ProcessReveal from "@/components/juice/ProcessReveal";
import ProcessClosing from "@/components/juice/ProcessClosing";

export const metadata = {
  title: "How We Make It | The Rook & Reed Juicery",
  description:
    "See how The Rook & Reed Juicery selects, prepares, presses, blends and pours.",
};

export default function ProcessPage() {
  return (
    <main>
      <ProcessHero />

      <ProcessStatement />

      <ProcessStages />

      <ProcessReveal />

      <ProcessClosing />
    </main>
  );
}