"use client";

import { motion } from "motion/react";

const words = [
  {
    number: "01",
    title: "MIND",
    description:
      "A place for thought, strategy, curiosity and the quiet concentration of a good game.",
  },
  {
    number: "02",
    title: "SOUL",
    description:
      "A place for music, expression, conversation and the feeling that comes from a great record.",
  },
  {
    number: "03",
    title: "BODY",
    description:
      "Fresh ingredients, thoughtful preparation and juice made for the moment.",
  },
];

export default function StoryManifesto() {
  return (
    <section className="bg-[#f5f1e8]">
      <div className="rr-container py-24 sm:py-32 lg:py-44">
        <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <span className="rr-kicker">THE IDEA</span>
          </div>

          <div>
            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
              }}
              className="rr-editorial max-w-6xl text-5xl leading-[0.87] sm:text-7xl lg:text-8xl"
            >
              A place where
              <br />
              <em>good things meet.</em>
            </motion.h2>

            <p className="mt-9 max-w-2xl text-sm leading-8 text-black/55 sm:text-base">
              Rook & Reed brings together three simple ideas: something
              to nourish the body, something to engage the mind and
              something to feed the soul.
            </p>

            <div className="mt-16 border-t border-black/15">
              {words.map((word, index) => (
                <motion.div
                  key={word.number}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -20 : 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.06,
                  }}
                  className="grid gap-5 border-b border-black/15 py-8 sm:grid-cols-[60px_220px_1fr] sm:items-start"
                >
                  <span className="font-mono text-[10px] text-black/30">
                    {word.number}
                  </span>

                  <h3 className="rr-editorial text-4xl leading-none sm:text-5xl">
                    {word.title}
                  </h3>

                  <p className="max-w-lg text-sm leading-7 text-black/50">
                    {word.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}