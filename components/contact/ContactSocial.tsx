import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight} from "lucide-react";

const socials = [
  {
    label: "Instagram",
    handle: "@rookreedjuicery",
    href: "https://instagram.com/rookreedjuicery",
    image: "/images/contact/instagram.jpg",
  },
  {
    label: "TikTok",
    handle: "@rrjuicery",
    href: "https://www.tiktok.com/@rrjuicery",
    image: "/images/contact/tiktok.jpg",
  },
  {
    label: "Facebook",
    handle: "Rook & Reed Juicery",
    href: "https://www.facebook.com/profile.php?id=61594881026412",
    image: "/images/contact/facebook.jpg",
  },
  {
    label: "WhatsApp Channel",
    handle: "R&R updates",
    href: "https://whatsapp.com/channel/0029Vb8ituLEVccM2MSwQu47",
    image: "/images/contact/whatsapp-channel.jpg",
  },
];

export default function ContactSocial() {
  return (
    <section className="bg-[#d8d2c7] py-24 text-[#111] lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            STAY CONNECTED
          </p>

          <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
            Follow
            <br />
            the House.
          </h2>

          <div className="mt-9 space-y-4 border-t border-black/15 pt-7">
            <a
              href="mailto:rookreedjuicery@gmail.com"
              className="flex items-center justify-between border-b border-black/10 pb-4 text-sm"
            >
              <span className="text-black/45">Email</span>
              <span className="font-medium">rookreedjuicery@gmail.com</span>
            </a>

            <a
              href="https://wa.me/254758038852"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between border-b border-black/10 pb-4 text-sm"
            >
              <span className="text-black/45">WhatsApp</span>
              <span className="font-medium">+254 758 038 852</span>
            </a>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group relative min-h-[360px] overflow-hidden bg-[#111]"
            >
              <Image
                src={social.image}
                alt={`${social.label} — Rook & Reed Juicery`}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/35" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                    {social.label}
                  </p>
                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.4}
                    className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </div>

                <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                  {social.handle}
                </h3>
              </div>
            </a>
          ))}

          <Link
            href="/journal"
            className="group relative min-h-[360px] overflow-hidden bg-[#111] sm:col-span-2"
          >
            <Image
              src="/images/contact/journal.jpg"
              alt="R&R Journal"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 text-white">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                  JOURNAL
                </p>

                <h3 className="mt-3 font-serif text-4xl">
                  Stories from the House
                </h3>
              </div>

              <ArrowUpRight
                size={22}
                strokeWidth={1.3}
                className="mb-1 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
