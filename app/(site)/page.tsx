import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import JuiceHero from "@/components/juice/JuiceHero";

const principles = [
  {
    number: "01",
    title: "Organic",
    text: "Ingredients chosen with intention.",
  },
  {
    number: "02",
    title: "Visible",
    text: "See what goes into your juice.",
  },
  {
    number: "03",
    title: "Fresh",
    text: "Prepared for the moment, not the shelf.",
  },
];

const signatures = [
  {
    number: "01",
    name: "The First Move",
    ingredients: "Pineapple · Orange · Ginger",
    note: "Every game begins somewhere.",
    image: "/images/products/the-first-move.jpg",
    tone: "bg-[#e7b83c]",
  },
  {
    number: "02",
    name: "The Green Rook",
    ingredients: "Cucumber · Green Apple · Spinach · Lemon · Mint",
    note: "Steady. Fresh. Uncomplicated.",
    image: "/images/products/the-green-rook.jpg",
    tone: "bg-[#5d8062]",
  },
  {
    number: "03",
    name: "Ruby Endgame",
    ingredients: "Beetroot · Apple · Pineapple · Ginger",
    note: "A bold finish.",
    image: "/images/products/ruby-endgame.jpg",
    tone: "bg-[#7d2638]",
  },
];

const transparencyItems = [
  "Ingredients",
  "Organic status",
  "Source",
  "Preparation",
  "Additives",
  "Freshness",
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* =========================================================
          HERO
      ========================================================= */}
      <JuiceHero />

      {/* =========================================================
          FRESHNESS / PRINCIPLE
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#f5f1e8]">
        <div className="pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full border border-black/5" />
        <div className="pointer-events-none absolute -right-16 top-40 h-40 w-40 rounded-full border border-black/5" />

        <Container>
          <div className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.7fr_1.5fr] lg:gap-24 lg:py-40">
            <FadeIn>
              <div className="flex items-start gap-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#a88752] shadow-[0_0_0_5px_rgba(168,135,82,0.12)]" />
                <p className="rr-kicker text-black/45">The R&R Principle</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div>
                <h2 className="rr-editorial max-w-5xl text-5xl font-medium leading-[0.9] tracking-[-0.045em] sm:text-6xl lg:text-[7.5rem]">
                  Freshness
                  <br />
                  should never
                  <br />
                  be a secret.
                </h2>

                <div className="mt-10 flex max-w-2xl items-start gap-4">
                  <span className="mt-2 h-px w-10 shrink-0 bg-black/25" />
                  <p className="text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
                    We don&apos;t just tell you what&apos;s in your juice.
                    <br className="hidden sm:block" />
                    We show you.
                  </p>
                </div>

                <div className="mt-14 grid gap-0 border-t border-black/10 sm:grid-cols-3">
                  {principles.map((principle, index) => (
                    <div
                      key={principle.number}
                      className="group border-b border-black/10 py-7 transition-colors duration-500 hover:bg-black/[0.025] sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-[0.15em] text-black/35">
                          {principle.number}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-black/10 transition-transform duration-500 group-hover:scale-[2]" />
                      </div>

                      <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.08em]">
                        {principle.title}
                      </h3>

                      <p className="mt-2 max-w-[18rem] text-sm leading-6 text-black/55">
                        {principle.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* =========================================================
          THE PRESS
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border border-white/[0.05]" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-white/[0.04]" />

        <Container>
          <div className="grid min-h-[720px] gap-16 py-24 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:py-32">
            <FadeIn>
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <span className="h-px w-8 bg-[#a88752]" />
                  <p className="rr-kicker text-white/40">R&R Press</p>
                </div>

                <h2 className="rr-editorial mt-7 text-6xl font-medium leading-[0.86] tracking-[-0.045em] sm:text-7xl lg:text-[7.5rem]">
                  From fruit
                  <br />
                  to glass.
                </h2>

                <p className="mt-8 max-w-md text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                  Select. Wash. Prepare. Press. Pour. Clean.
                </p>

                <Button
                  href="/process"
                  variant="outline-light"
                  className="mt-9"
                >
                  Explore the process
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <Link href="/process" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#292929]">
                  <video
                    className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-80 transition duration-[1400ms] ease-out group-hover:scale-105 group-hover:opacity-95"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/images/general/press-poster.jpg"
                    aria-hidden="true"
                  >
                    <source
                      src="/videos/process/press.mp4"
                      type="video/mp4"
                    />
                  </video>

                  <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />

                  <div className="absolute left-6 top-6 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c8aa72]" />
                    Live process
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
                        The Press
                      </p>
                      <p className="mt-2 rr-editorial text-3xl">
                        Prepared in the moment.
                      </p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-lg transition duration-500 group-hover:translate-x-1 group-hover:border-white/60">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* =========================================================
          SIGNATURES
      ========================================================= */}
      <section className="bg-[#f5f1e8]">
        <Container>
          <div className="py-24 sm:py-32 lg:py-40">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <FadeIn>
                <div>
                  <p className="rr-kicker text-black/40">The Menu</p>
                  <h2 className="rr-editorial mt-4 text-6xl font-medium leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-[7rem]">
                    Signatures.
                  </h2>
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <Link
                  href="/menu"
                  className="group flex w-fit items-center gap-4 text-xs font-bold uppercase tracking-[0.12em]"
                >
                  <span className="border-b border-black/25 pb-2 transition-colors group-hover:border-black">
                    View full menu
                  </span>
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </FadeIn>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {signatures.map((juice, index) => (
                <FadeIn key={juice.name} delay={index * 0.08}>
                  <Link href="/menu" className="group block">
                    <div
                      className={`relative aspect-[4/5] overflow-hidden ${juice.tone}`}
                    >
                      <Image
                        src={juice.image}
                        alt={juice.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-90" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />

                      <div className="absolute left-5 top-5 flex items-center gap-3">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-white/70">
                          {juice.number}
                        </span>
                        <span className="h-px w-7 bg-white/30" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                          Freshly pressed
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <h3 className="rr-editorial text-4xl font-medium leading-none tracking-[-0.03em] text-white sm:text-5xl">
                              {juice.name}
                            </h3>
                            <p className="mt-3 max-w-xs text-[10px] uppercase leading-5 tracking-[0.08em] text-white/60">
                              {juice.ingredients}
                            </p>
                          </div>

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition duration-500 group-hover:translate-x-1 group-hover:border-white/70">
                            →
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-black/10 py-5">
                      <p className="text-sm italic text-black/55">{juice.note}</p>
                      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/35">
                        Explore
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================
          KNOW YOUR JUICE
      ========================================================= */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-[#f5f1e8]/45" />

        <Container>
          <div className="relative grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:py-40">
            <FadeIn>
              <div>
                <p className="rr-kicker text-black/40">Know Your Juice</p>

                <h2 className="rr-editorial mt-5 max-w-xl text-6xl font-medium leading-[0.86] tracking-[-0.045em] sm:text-7xl lg:text-[6.8rem]">
                  Know what
                  <br />
                  you&apos;re
                  <br />
                  drinking.
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="lg:pt-16">
                <p className="max-w-xl text-lg leading-8 text-black/65">
                  Every R&R composition should have a story. Ingredients,
                  source, preparation, freshness and what goes into the glass
                  should never feel hidden.
                </p>

                <div className="mt-10 grid grid-cols-2 border-t border-black/10">
                  {transparencyItems.map((item, index) => (
                    <div
                      key={item}
                      className={`group flex items-center justify-between border-b border-black/10 py-5 text-xs font-bold uppercase tracking-[0.1em] ${
                        index % 2 === 0 ? "border-r pr-5" : "pl-5"
                      }`}
                    >
                      <span>{item}</span>
                      <span className="text-black/20 transition-transform duration-300 group-hover:translate-x-1">
                        +
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  href="/ingredients"
                  variant="secondary"
                  className="mt-8"
                >
                  Explore ingredients
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* =========================================================
          THE HOUSE
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#d8d2c7]">
        <div className="pointer-events-none absolute -right-24 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-black/[0.06]" />
        <div className="pointer-events-none absolute -right-10 top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full border border-black/[0.06]" />

        <Container>
          <div className="py-24 sm:py-32 lg:py-40">
            <FadeIn>
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-black/25" />
                <p className="rr-kicker text-black/40">The House</p>
              </div>
            </FadeIn>

            <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-end">
              <FadeIn delay={0.05}>
                <h2 className="rr-editorial text-6xl font-medium leading-[0.84] tracking-[-0.05em] sm:text-7xl lg:text-[8rem]">
                  Juice.
                  <br />
                  Chess.
                  <br />
                  Jazz.
                  <br />
                  Books.
                </h2>
              </FadeIn>

              <FadeIn delay={0.12}>
                <div className="lg:pb-3">
                  <p className="max-w-xl text-lg leading-8 text-black/65">
                    R&R is more than a juice bar. It is a place to sit, think,
                    listen, read, talk and stay a little longer.
                  </p>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button href="/house" variant="primary">
                      Enter the House
                    </Button>

                    <Button href="/jazz" variant="secondary">
                      The Reed
                    </Button>

                    <Button href="/chess" variant="secondary">
                      Chess at R&R
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.16}>
              <div className="mt-16 grid grid-cols-2 border-y border-black/10 sm:grid-cols-4">
                {["Mind", "Soul", "Body", "Company"].map((item, index) => (
                  <div
                    key={item}
                    className={`py-5 text-[10px] font-bold uppercase tracking-[0.16em] text-black/45 ${
                      index !== 0 ? "border-l border-black/10 pl-5 sm:pl-6" : ""
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* =========================================================
          SATURDAY / SHOP
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(168,135,82,0.12),transparent_32%)]" />

        <Container>
          <div className="relative grid gap-12 py-24 sm:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-40">
            <FadeIn>
              <div>
                <div className="flex items-center gap-4">
                  <span className="h-px w-8 bg-[#a88752]" />
                  <p className="rr-kicker text-white/40">Every Saturday</p>
                </div>

                <h2 className="rr-editorial mt-6 text-7xl font-medium leading-[0.82] tracking-[-0.05em] sm:text-8xl lg:text-[9rem]">
                  Make
                  <br />
                  your move.
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <p className="max-w-md text-lg leading-8 text-white/60">
                  Saturday brings chess, community and competition through SHoP.
                  R&R is part of the House, serving the people and the moments
                  around the board.
                </p>

                <Button
                  href="/chess"
                  variant="outline-light"
                  className="mt-9"
                >
                  Discover Saturday
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* =========================================================
          VISIT / CLOSING
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#f5f1e8]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 bg-black/10" />

        <Container>
          <div className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1fr] lg:py-40">
            <FadeIn>
              <div>
                <p className="rr-kicker text-black/40">Visit R&R</p>

                <h2 className="rr-editorial mt-5 text-6xl font-medium leading-[0.86] tracking-[-0.045em] sm:text-7xl lg:text-[6.8rem]">
                  Come by.
                  <br />
                  Stay awhile.
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="border-t border-black/10">
                <div className="grid grid-cols-2 border-b border-black/10 py-6">
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-black/45">
                    Address
                  </span>
                  <span className="text-sm leading-6">
                    Rook & Reed Plaza
                    <br />
                    Kilimani, Nairobi
                  </span>
                </div>

                <div className="grid grid-cols-2 border-b border-black/10 py-6">
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-black/45">
                    Hours
                  </span>
                  <span className="text-sm leading-6">
                    Daily
                    <br />
                    8:00 AM – 8:00 PM
                  </span>
                </div>

                <div className="grid grid-cols-2 border-b border-black/10 py-6">
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-black/45">
                    Contact
                  </span>
                  <span className="text-sm leading-6">
                    0758 038 852
                    <br />
                    rookreedjuicery@gmail.com
                  </span>
                </div>

                <div className="pt-8">
                  <Button href="/visit" variant="primary">
                    Get directions
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}
