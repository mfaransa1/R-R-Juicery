import HouseHero from "@/components/house/HouseHero";
import HouseIntro from "@/components/house/HouseIntro";
import HouseSwitcher from "@/components/house/HouseSwitcher";
import HouseReed from "@/components/house/HouseReed";
import HouseShelf from "@/components/house/HouseShelf";
import HouseManifesto from "@/components/house/HouseManifesto";

export const metadata = {
  title: "The House | The Rook & Reed Juicery",
  description:
    "Juice, jazz, books, chess and conversation under one roof in Kilimani, Nairobi.",
};

export default function HousePage() {
  return (
    <main>
      <HouseHero />

      <HouseIntro />

      <HouseSwitcher />

      <HouseReed />

      <HouseShelf />

      <HouseManifesto />

      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover opacity-40"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/videos/hero/house-closing.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="rr-container relative py-32 sm:py-44 lg:py-56">
          <span className="rr-kicker text-white/45">
            ROOK + REED
          </span>

          <h2 className="rr-editorial mt-7 max-w-6xl text-6xl leading-[0.82] sm:text-8xl lg:text-[9rem]">
            Come with
            <br />
            an appetite.
            <br />
            <em>Leave with a story.</em>
          </h2>
        </div>
      </section>
    </main>
  );
}