import SourcingHero from "@/components/sourcing/SourcingHero";
import SourcingIntro from "@/components/sourcing/SourcingIntro";
import SourcingJourney from "@/components/sourcing/SourcingJourney";
import SourcingStandards from "@/components/sourcing/SourcingStandards";
import SourcingMap from "@/components/sourcing/SourcingMap";
import SourcingTraceability from "@/components/sourcing/SourcingTraceability";
import SourcingClosing from "@/components/sourcing/SourcingClosing";

export const metadata = {
  title: "Sourcing | The Rook & Reed Juicery",
  description:
    "Follow the journey from ingredient source to Rook & Reed juice.",
};

export default function SourcingPage() {
  return (
    <main>
      <SourcingHero />

      <SourcingIntro />

      <SourcingJourney />

      <SourcingStandards />

      <SourcingMap />

      <SourcingTraceability />

      <SourcingClosing />
    </main>
  );
}