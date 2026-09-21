import FadeIn from "@/components/motion/FadeIn";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function JuiceHero() {
  return (
    <section className="rr-hero">
      <div className="absolute inset-0 bg-[#0b0b0b]">
        <video
          className="rr-hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/general/hero-poster.jpg"
          aria-hidden="true"
        >
          <source
            src="/videos/hero/rook-reed-hero.mp4"
            type="video/mp4"
          />
        </video>

        <div className="rr-hero-atmosphere" />
        <div className="rr-hero-overlay" />
        <div className="rr-hero-grain" />
      </div>

      <Container>
        <div className="rr-hero-content flex min-h-[100svh] items-end">
          <div className="w-full pb-20 pt-36 sm:pb-24 lg:pb-28">
            <div className="max-w-[980px]">
              <FadeIn>
                <div className="flex items-center gap-4">
                  <span className="h-px w-8 bg-white/50" />

                  <p className="rr-kicker text-white/70">
                    Kilimani · Nairobi
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <h1 className="rr-display mt-7 max-w-[980px] text-[clamp(4rem,10.5vw,9.5rem)]">
                  Good juice.
                  <br />
                  Good music.
                  <br />
                  Good company.
                </h1>
              </FadeIn>

              <FadeIn delay={0.16}>
                <div className="mt-8 max-w-xl">
                  <p className="text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                    A fresh juice and cultural house in
                    Kilimani — made for good mornings,
                    long conversations and everything in
                    between.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.24}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/menu" variant="light">
                    Explore the menu
                  </Button>

                  <Button
                    href="/process"
                    variant="outline-light"
                  >
                    See how we make it
                  </Button>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.32}>
              <div className="mt-16 flex flex-col gap-5 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  <span>Organic</span>
                  <span>Freshly Prepared</span>
                  <span>Visible Process</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                    Scroll to explore
                  </span>

                  <span className="rr-scroll-line" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}