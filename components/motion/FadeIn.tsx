"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 24,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y,
      }}
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      variants={variants}
      transition={{
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}