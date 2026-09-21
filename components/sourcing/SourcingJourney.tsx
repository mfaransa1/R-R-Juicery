"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

const journey = [
  {
    number: "01",
    title: "FARM",
    description:
      "The journey begins where the ingredient is grown or produced.",
    image: "/images/sourcing/farm.jpg",
    video: "/videos/sourcing/farm.mp4",
    caption: "Where the ingredient begins.",
  },
  {
    number: "02",
    title: "SUPPLIER",
    description:
      "Ingredients move through the supply relationship that brings them closer to R&R.",
    image: "/images/sourcing/supplier.jpg",
    video: "/videos/sourcing/harvest.mp4",
    caption: "The link between source and R&R.",
  },
  {
    number: "03",
    title: "R&R",
    description:
      "Ingredients arrive at the Juicery where they are received, checked and prepared.",
    image: "/images/sourcing/rr-receiving.jpg",
    video: "/videos/sourcing/receiving.mp4",
    caption: "Received. Prepared. Made visible.",
  },
  {
    number: "04",
    title: "JUICE",
    description:
      "The final ingredient journey becomes part of a fresh Rook & Reed composition.",
    image: "/images/sourcing/delivery.jpg",
    video: "/videos/sourcing/delivery.mp4",
    caption: "From source to your glass.",
  },
];

export default function SourcingJourney() {
  return (
    <section className="bg-[#111111] text-white">
      {journey.map((step, index) => (
        <SourcingStep
          key={step.number}
          step={step}
          index={index}
          last={index === journey.length - 1}
        />
      ))}
    </section>
  );
}

function SourcingStep({
  step,
  index,
  last,
}: {
  step: (typeof journey)[number];
  index: number;
  last: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["8%", "-8%"],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.05, 1, 1.05],
  );

  return (
    <section
      ref={ref}
      className="relative border-t border-white/10"
    >
      <div className="rr-container py-20 sm:py-28 lg:py-36">
        <div
          className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-24 ${
            index % 2 === 1
              ? "lg:[&>*:first-child]:order-2"
              : ""
          }`}
        >
          <div className="relative overflow-hidden">
            <div className="relative aspect-[4/5] sm:aspect-[5/6]">
              <motion.div
                style={{
                  y: imageY,
                  scale: imageScale,
                }}
                className="absolute -inset-[7%]"
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={step.image}
                  className="absolute inset-0 h-full w-full object-cover opacity-45"
                >
                  <source
                    src={step.video}
                    type="video/mp4"
                  />
                </video>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <span className="max-w-xs text-[9px] uppercase tracking-[0.18em] text-white/60">
                  {step.caption}
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25">
                  <ArrowRight
                    size={15}
                    strokeWidth={1.2}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
              {step.number}
            </span>

            <h2 className="rr-editorial mt-5 text-7xl leading-[0.78] sm:text-8xl lg:text-[9rem]">
              {step.title}
            </h2>

            <p className="mt-8 max-w-lg text-sm leading-8 text-white/50 sm:text-base">
              {step.description}
            </p>

            {!last && (
              <div className="mt-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/25">
                <ArrowDown
                  size={14}
                  strokeWidth={1.2}
                />
                Continue the journey
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}