import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  MessageCircle,
} from "lucide-react";

const exploreLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Process", href: "/process" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Sourcing", href: "/sourcing" },
  { label: "Journal", href: "/journal" },
];

const houseLinks = [
  { label: "The House", href: "/house" },
  { label: "Chess", href: "/chess" },
  { label: "Jazz", href: "/jazz" },
  { label: "Events", href: "/events" },
  { label: "Visit", href: "/visit" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#111111] text-white">
      {/* =========================================================
          CLOSING STATEMENT
      ========================================================= */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
                THE ROOK &amp; REED JUICERY
              </p>

              <h2 className="mt-6 max-w-5xl font-serif text-[clamp(3.6rem,8vw,8.5rem)] leading-[0.82] tracking-[-0.065em]">
                Good Juice.
                <br />
                Good Music.
                <br />
                Good Company.
              </h2>
            </div>

            <div className="lg:pb-2 lg:pl-8">
              <p className="max-w-sm text-sm leading-7 text-white/50">
                A fresh juice and cultural house in Kilimani — built around
                good juice, good music and good company.
              </p>

              <Link
                href="/visit"
                className="group mt-7 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white"
              >
                Find the House
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_1fr_1fr_1fr]">
          {/* BRAND */}
          <div>
            <Link
              href="/"
              aria-label="Rook & Reed Juicery home"
              className="inline-block"
            >
              <Image
                src="/logos/rook-reed-logo.png"
                alt="Rook & Reed Juicery"
                width={220}
                height={110}
                className="h-auto w-[170px] brightness-0 invert sm:w-[190px]"
              />
            </Link>

            <p className="mt-8 max-w-xs text-sm leading-7 text-white/45">
              Fresh juice, jazz, chess, books and conversation — under one
              roof in Kilimani, Nairobi.
            </p>

            <div className="mt-8 flex items-center gap-5">
              <a
                href="https://instagram.com/rookandreedjuicery"
                target="_blank"
                rel="noreferrer"
                aria-label="Rook & Reed on Instagram"
                className="text-white/45 transition-colors hover:text-white"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
  Instagram
</span>
              </a>

              <a
                href="https://wa.me/254758038852"
                target="_blank"
                rel="noreferrer"
                aria-label="Rook & Reed on WhatsApp"
                className="text-white/45 transition-colors hover:text-white"
              >
                <MessageCircle size={18} strokeWidth={1.4} />
              </a>
            </div>
          </div>

          {/* EXPLORE */}
          <FooterColumn title="Explore" links={exploreLinks} />

          {/* THE HOUSE */}
          <FooterColumn title="The House" links={houseLinks} />

          {/* FIND US */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
              Find Us
            </p>

            <div className="mt-7 space-y-7">
              <div>
                <div className="flex items-start gap-3">
                  <MapPin
                    size={15}
                    strokeWidth={1.3}
                    className="mt-0.5 shrink-0 text-white/35"
                  />

                  <div>
                    <p className="text-sm leading-6 text-white/80">
                      Rook &amp; Reed Plaza
                    </p>

                    <p className="text-sm leading-6 text-white/45">
                      Kilimani, Nairobi
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Open Daily
                </p>

                <p className="mt-2 text-sm text-white/75">
                  8:00 AM — 8:00 PM
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Contact
                </p>

                <a
                  href="tel:+254758038852"
                  className="mt-2 block text-sm text-white/75 transition-colors hover:text-white"
                >
                  0758 038 852
                </a>

                <a
                  href="mailto:rookreedjuicery@gmail.com"
                  className="mt-2 block break-words text-sm text-white/45 transition-colors hover:text-white"
                >
                  rookreedjuicery@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            SECONDARY NAVIGATION
        ======================================================= */}
        <div className="mt-20 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                Need a hand?
              </p>

              <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
                {supportLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
              GOOD JUICE / GOOD MUSIC / GOOD COMPANY
            </p>
          </div>
        </div>

        {/* =======================================================
            COPYRIGHT BAR
        ======================================================= */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                © {new Date().getFullYear()} Rook &amp; Reed Juicery
              </p>

              <span className="hidden h-3 w-px bg-white/10 sm:block" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                Built by Kurarin Solutions
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/faq"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30 transition-colors hover:text-white"
              >
                FAQ
              </Link>

              <Link
                href="/contact"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30 transition-colors hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/visit"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30 transition-colors hover:text-white"
              >
                Visit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
        {title}
      </p>

      <nav className="mt-7 flex flex-col items-start gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
          >
            <span>{link.label}</span>

            <ArrowUpRight
              size={12}
              strokeWidth={1.4}
              className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-50"
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}