"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "./SiteNav";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="rr-mobile-panel lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex min-h-screen flex-col">
            <div className="flex h-20 items-center justify-between border-b border-black/10 px-4 sm:px-6">
              <Link
                href="/"
                onClick={onClose}
                aria-label="The Rook & Reed Juicery home"
                className="relative block h-14 w-[150px]"
              >
                <Image
                  src="/logos/rook-reed-logo.png"
                  alt="The Rook & Reed Juicery"
                  fill
                  priority
                  sizes="150px"
                  className="object-contain object-left"
                />
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 items-center justify-center border border-black/15"
              >
                <span className="relative block h-4 w-4">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-black" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-black" />
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col px-4 pb-8 pt-8 sm:px-6">
              <SiteNav
                mobile
                onNavigate={onClose}
              />

              <div className="mt-auto pt-12">
                <div className="mb-6 h-px bg-black/10" />

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="border border-black/15 px-4 py-4 text-center text-[10px] font-bold uppercase tracking-[0.12em]"
                  >
                    R&R Passport
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="bg-black px-4 py-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                  >
                    Your Bag
                  </Link>
                </div>

                <div className="mt-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
                    Kilimani · Nairobi
                  </p>

                  <p className="mt-2 text-sm text-black/70">
                    Good Juice. Good Music. Good Company.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}