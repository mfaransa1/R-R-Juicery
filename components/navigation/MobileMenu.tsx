"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import SiteNav from "./SiteNav";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={onClose}
          />

          <motion.aside
            id="mobile-navigation"
            aria-label="Mobile navigation"
            aria-modal="true"
            role="dialog"
            className="fixed inset-0 z-[100] flex h-[100dvh] flex-col bg-[#f5f1e8] text-black lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-black/10 px-4 sm:px-6">
              <Link
                href="/"
                onClick={onClose}
                aria-label="The Rook & Reed Juicery home"
                className="relative block h-14 w-[145px] sm:w-[160px]"
              >
                <Image
                  src="/logos/rook-reed-logo.png"
                  alt="The Rook & Reed Juicery"
                  fill
                  priority
                  sizes="160px"
                  className="object-contain object-left"
                />
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 items-center justify-center border border-black/15 transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f1e8]"
              >
                <span className="relative block h-4 w-4" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="px-4 pb-8 pt-5 sm:px-6">
                <div className="mb-7 flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
                    The House
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/30">
                    Kilimani · Nairobi
                  </p>
                </div>

                <SiteNav mobile onNavigate={onClose} />

                <div className="mt-8 border-t border-black/10 pt-7">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="flex min-h-14 items-center justify-center border border-black/15 px-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      R&R Passport
                    </Link>

                    <Link
                      href="/checkout"
                      onClick={onClose}
                      className="flex min-h-14 items-center justify-center bg-black px-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] !text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                    >
                      Your Bag
                    </Link>
                  </div>
                </div>

                <div className="mt-10 border-t border-black/10 pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/40">
                      Open daily
                    </p>
                    <p className="text-xs font-medium text-black/65">
                      8:00 AM — 8:00 PM
                    </p>
                  </div>

                  <p className="mt-4 rr-editorial text-2xl">
                    Good Juice. Good Music. Good Company.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
