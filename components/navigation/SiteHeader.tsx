"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import SiteNav from "./SiteNav";
import CartButton from "@/components/cart/CartButton";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={[
          "rr-header",
          scrolled ? "rr-header-scrolled" : "rr-header-hero",
        ].join(" ")}
      >
        <div className="rr-container">
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              aria-label="The Rook & Reed Juicery home"
              className="relative block h-14 w-[150px] sm:h-16 sm:w-[175px]"
            >
              <Image
                src="/logos/rook-reed-logo.png"
                alt="The Rook & Reed Juicery"
                fill
                priority
                sizes="(max-width: 640px) 150px, 175px"
                className="object-contain object-left"
              />
            </Link>

            <SiteNav />

            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="hidden text-[10px] font-bold uppercase tracking-[0.1em] lg:block"
              >
                R&R Passport
              </Link>

              {/* Live cart */}
              <CartButton />

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                className={[
                  "flex h-10 w-10 items-center justify-center border lg:hidden",
                  scrolled ? "border-black/15" : "border-white/40",
                ].join(" ")}
              >
                <span className="flex w-4 flex-col gap-[5px]">
                  <span
                    className={[
                      "h-px w-full",
                      scrolled ? "bg-black" : "bg-white",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "h-px w-full",
                      scrolled ? "bg-black" : "bg-white",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "h-px w-full",
                      scrolled ? "bg-black" : "bg-white",
                    ].join(" ")}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}