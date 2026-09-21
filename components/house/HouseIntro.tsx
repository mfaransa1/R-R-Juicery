"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function HouseIntro() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section
      ref={ref}
      id="inside"
      className="overflow-hidden bg-[var(--rr-paper)]"
    >
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div>
            <span className="rr-kicker">A PLACE TO LINGER</span>

            <h2 className="rr-editorial mt-7 text-5xl leading-[0.92] sm:text-7xl lg:text-[6.5rem]">
              Not just
              <br />
              <em>a juicery.</em>
            </h2>
          </div>

          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <motion.div
                style={{
                  y: imageY,
                  scale: imageScale,
                }}
                className="absolute inset-[-8%]"
              >
                <Image
                  src="/images/house/house-interior.jpg"
                  alt="Interior atmosphere at The Rook & Reed House"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </motion.div>

              <div className="absolute inset-0 bg-black/10" />

              <div className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.2em] text-white/75">
                KILIMANI / NAIROBI
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="mt-8 max-w-xl text-base leading-8 text-black/65 sm:text-lg"
            >
              The House is the wider world around Rook & Reed. A place where
              fresh juice meets music, books, chess, conversation and the
              simple pleasure of spending time somewhere that feels alive.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}