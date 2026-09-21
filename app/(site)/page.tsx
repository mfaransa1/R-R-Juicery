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
    name: "The First Move",
    ingredients: "Pineapple · Orange · Ginger",
    note: "Every game begins somewhere.",
    tone: "bg-[#e7b83c]",
  },
  {
    name: "The Green Rook",
    ingredients:
      "Cucumber · Green Apple · Spinach · Lemon · Mint",
    note: "Steady. Fresh. Uncomplicated.",
    tone: "bg-[#5d8062]",
  },
  {
    name: "Ruby Endgame",
    ingredients:
      "Beetroot · Apple · Pineapple · Ginger",
    note: "A bold finish.",
    tone: "bg-[#7d2638]",
  },
];

export default function HomePage() {
  return (
    <>
      <main>
        {/* =====================================================
            HERO
        ===================================================== */}
        <JuiceHero />
       
        {/* =====================================================
            FRESHNESS
        ===================================================== */}
        <section className="bg-[#f5f1e8]">
          <Container>
            <div className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:py-40">
              <FadeIn>
                <p className="rr-kicker text-black/45">
                  The R&R Principle
                </p>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div>
                  <h2 className="rr-editorial max-w-4xl text-5xl font-medium leading-[0.92] tracking-[-0.035em] sm:text-6xl lg:text-8xl">
                    Freshness should never be a secret.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
                    We don't just tell you what's in your
                    juice. We show you.
                  </p>

                  <div className="mt-12 grid gap-0 border-t border-black/10 sm:grid-cols-3">
                    {principles.map((principle) => (
                      <div
                        key={principle.number}
                        className="border-b border-black/10 py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
                      >
                        <span className="text-[10px] font-bold tracking-[0.15em] text-black/35">
                          {principle.number}
                        </span>

                        <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.08em]">
                          {principle.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-black/55">
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

        {/* =====================================================
            THE PRESS
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#111111] text-white">
          <Container>
            <div className="grid min-h-[680px] items-center gap-16 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:py-32">
              <FadeIn>
                <div>
                  <p className="rr-kicker text-white/40">
                    R&R Press
                  </p>

                  <h2 className="rr-editorial mt-6 text-6xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                    From fruit
                    <br />
                    to glass.
                  </h2>

                  <p className="mt-8 max-w-md text-base leading-7 text-white/60">
                    Select. Wash. Prepare. Press. Pour.
                    Clean.
                  </p>

                  <Button
                    href="/process"
                    variant="outline-light"
                    className="mt-8"
                  >
                    Explore the process
                  </Button>
                </div>
              </FadeIn>

              <FadeIn delay={0.12}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#292929] sm:aspect-[5/4] lg:aspect-[4/3]">
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                      The Press
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* =====================================================
            SIGNATURES
        ===================================================== */}
        <section className="bg-[#f5f1e8]">
          <Container>
            <div className="py-24 sm:py-32 lg:py-40">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <FadeIn>
                  <div>
                    <p className="rr-kicker text-black/40">
                      The Menu
                    </p>

                    <h2 className="rr-editorial mt-4 text-6xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                      Signatures.
                    </h2>
                  </div>
                </FadeIn>

                <FadeIn delay={0.08}>
                  <Link
                    href="/menu"
                    className="rr-button rr-button-secondary w-fit"
                  >
                    View full menu
                  </Link>
                </FadeIn>
              </div>

              <div className="mt-14 grid gap-4 lg:grid-cols-3">
                {signatures.map((juice, index) => (
                  <FadeIn
                    key={juice.name}
                    delay={index * 0.08}
                  >
                    <Link
                      href="/menu"
                      className="group block"
                    >
                      <div
                        className={`relative aspect-[4/5] overflow-hidden ${juice.tone}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                          <div className="text-center">
                            <span className="rr-editorial text-7xl font-medium leading-none tracking-[-0.05em] text-black/90 sm:text-8xl">
                              R&R
                            </span>

                            <div className="mx-auto mt-4 h-px w-12 bg-black/25" />

                            <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-black/60">
                              Freshly pressed
                            </p>
                          </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 to-transparent p-5 pt-20">
                          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                            0{index + 1}
                          </span>
                        </div>
                      </div>

                      <div className="border-b border-black/10 py-5">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="rr-editorial text-3xl font-medium">
                            {juice.name}
                          </h3>

                          <span className="text-sm text-black/45">
                            →
                          </span>
                        </div>

                        <p className="mt-2 text-xs uppercase tracking-[0.08em] text-black/45">
                          {juice.ingredients}
                        </p>

                        <p className="mt-3 text-sm italic text-black/60">
                          {juice.note}
                        </p>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* =====================================================
            KNOW YOUR JUICE
        ===================================================== */}
        <section className="bg-white">
          <Container>
            <div className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1fr] lg:gap-24 lg:py-40">
              <FadeIn>
                <div>
                  <p className="rr-kicker text-black/40">
                    Know Your Juice
                  </p>

                  <h2 className="rr-editorial mt-5 max-w-xl text-6xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-7xl">
                    Know what
                    <br />
                    you're drinking.
                  </h2>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="lg:pt-16">
                  <p className="max-w-xl text-lg leading-8 text-black/65">
                    Every R&R composition should have a
                    story. Ingredients, source, preparation,
                    freshness and what goes into the glass
                    should never feel hidden.
                  </p>

                  <div className="mt-10 grid grid-cols-2 border-t border-black/10">
                    {[
                      "Ingredients",
                      "Organic status",
                      "Source",
                      "Preparation",
                      "Additives",
                      "Freshness",
                    ].map((item) => (
                      <div
                        key={item}
                        className="border-b border-r border-black/10 py-5 text-xs font-bold uppercase tracking-[0.1em] last:border-r-0"
                      >
                        {item}
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

        {/* =====================================================
            THE HOUSE
        ===================================================== */}
        <section className="bg-[#d8d2c7]">
          <Container>
            <div className="py-24 sm:py-32 lg:py-40">
              <FadeIn>
                <p className="rr-kicker text-black/40">
                  The House
                </p>
              </FadeIn>

              <div className="mt-5 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-end">
                <FadeIn delay={0.05}>
                  <h2 className="rr-editorial text-6xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
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
                  <div>
                    <p className="max-w-xl text-lg leading-8 text-black/65">
                      R&R is more than a juice bar. It is
                      a place to sit, think, listen, read,
                      talk and stay a little longer.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        href="/house"
                        variant="primary"
                      >
                        Enter the House
                      </Button>

                      <Button
                        href="/jazz"
                        variant="secondary"
                      >
                        The Reed
                      </Button>

                      <Button
                        href="/chess"
                        variant="secondary"
                      >
                        Chess at R&R
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </Container>
        </section>

        {/* =====================================================
            SATURDAY
        ===================================================== */}
        <section className="bg-[#111111] text-white">
          <Container>
            <div className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-40">
              <FadeIn>
                <div>
                  <p className="rr-kicker text-white/40">
                    Every Saturday
                  </p>

                  <h2 className="rr-editorial mt-5 text-7xl font-medium leading-[0.85] tracking-[-0.045em] sm:text-8xl lg:text-[9rem]">
                    Make
                    <br />
                    your move.
                  </h2>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <p className="max-w-md text-lg leading-8 text-white/60">
                    Saturday brings chess, community and
                    competition through SHoP. R&R is part
                    of the House, serving the people and
                    the moments around the board.
                  </p>

                  <Button
                    href="/chess"
                    variant="outline-light"
                    className="mt-8"
                  >
                    Discover Saturday
                  </Button>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* =====================================================
            VISIT
        ===================================================== */}
        <section className="bg-[#f5f1e8]">
          <Container>
            <div className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1fr] lg:py-40">
              <FadeIn>
                <div>
                  <p className="rr-kicker text-black/40">
                    Visit R&R
                  </p>

                  <h2 className="rr-editorial mt-5 text-6xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-7xl">
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
                    <Button
                      href="/visit"
                      variant="primary"
                    >
                      Get directions
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}