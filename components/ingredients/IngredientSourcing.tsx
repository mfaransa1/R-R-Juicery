"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "FARM",
    text: "Where the ingredient begins.",
  },
  {
    number: "02",
    title: "SUPPLIER",
    text: "The link between source and R&R.",
  },
  {
    number: "03",
    title: "R&R",
    text: "Selected, received and prepared.",
  },
  {
    number: "04",
    title: "JUICE",
    text: "The final composition in your glass.",
  },
];

export default function IngredientSourcing() {
  return (
    <section className="bg-[#ded8cd]">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <span className="rr-kicker">SOURCING</span>

            <h2 className="rr-editorial mt-5 text-5xl leading-[0.85] sm:text-7xl lg:text-8xl">
              From
              <br />
              <em>source</em>
              <br />
              to glass.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-sm leading-8 text-black/55 sm:text-base">
              Every ingredient has a journey. Our sourcing system is designed
              to make that journey easier to understand.
            </p>

            <div className="mt-14 border-t border-black/15">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-[50px_1fr_auto] items-center gap-5 border-b border-black/15 py-7"
                >
                  <span className="font-mono text-[10px] text-black/35">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="text-sm font-medium tracking-[0.12em]">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-black/45">
                      {step.text}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    strokeWidth={1.2}
                    className="text-black/30"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}