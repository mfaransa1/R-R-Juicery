import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Process", href: "/process" },
  { label: "House", href: "/house" },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="rr-container">
        <div className="py-16 sm:py-20 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
            {/* Brand */}
            <div>
              <div className="relative h-28 w-[300px] max-w-full sm:h-32 sm:w-[350px]">
                <Image
                  src="/logos/rook-reed-logo.png"
                  alt="The Rook & Reed Juicery"
                  fill
                  sizes="(max-width: 640px) 300px, 350px"
                  className="object-contain object-left"
                />
              </div>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
                A fresh juice and cultural house in
                Kilimani — built around good juice, good
                music and good company.
              </p>
            </div>

            {/* Explore */}
            <div>
              <p className="rr-kicker text-white/40">
                Explore
              </p>

              <nav className="mt-5 flex flex-col gap-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <p className="rr-kicker text-white/40">
                Find Us
              </p>

              <div className="mt-5 space-y-3 text-sm leading-6 text-white/75">
                <p>
                  Rook & Reed Plaza
                  <br />
                  Kilimani, Nairobi
                </p>

                <p>
                  Daily
                  <br />
                  8:00 AM – 8:00 PM
                </p>

                <a
                  href="tel:+254758038852"
                  className="block transition-colors hover:text-white"
                >
                  0758 038 852
                </a>

                <a
                  href="mailto:rookreedjuicery@gmail.com"
                  className="block break-words transition-colors hover:text-white"
                >
                  rookreedjuicery@gmail.com
                </a>

                <a
                  href="https://wa.me/254758038852"
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors hover:text-white"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 h-px bg-white/15" />

          <div className="flex flex-col gap-4 pt-6 text-[10px] font-medium uppercase tracking-[0.12em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Rook & Reed Juicery
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/faq"
                className="transition-colors hover:text-white"
              >
                FAQ
              </Link>

              <Link
                href="/contact"
                className="transition-colors hover:text-white"
              >
                Contact
              </Link>

              <span>Built for the House</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}