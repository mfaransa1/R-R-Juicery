"use client";

const steps = [
  {
    number: "01",
    word: "SELECT",
    text: "Choose your move from the R&R menu.",
  },
  {
    number: "02",
    word: "PREPARE",
    text: "Ingredients are washed and prepared.",
  },
  {
    number: "03",
    word: "PRESS",
    text: "The juice is pressed or blended.",
  },
  {
    number: "04",
    word: "POUR",
    text: "Your order is prepared for collection or delivery.",
  },
];

export default function OrderProcess() {
  return (
    <section className="bg-[#111] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
              FROM ORDER TO POUR
            </p>

            <h2 className="mt-5 font-serif text-6xl leading-[0.82] tracking-[-0.055em] sm:text-8xl">
              The
              <br />
              journey.
            </h2>
          </div>

          <div className="border-t border-white/10">
            {steps.map((step) => (
              <div
                key={step.number}
                className="grid grid-cols-[55px_1fr] gap-5 border-b border-white/10 py-8 sm:grid-cols-[80px_1fr_1.4fr] sm:gap-8"
              >
                <span className="text-xs text-white/25">
                  {step.number}
                </span>

                <h3 className="font-serif text-3xl tracking-[-0.025em]">
                  {step.word}
                </h3>

                <p className="col-start-2 text-sm leading-relaxed text-white/45 sm:col-start-3">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}