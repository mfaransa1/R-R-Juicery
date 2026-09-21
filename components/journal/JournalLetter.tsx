"use client";

import { useState } from "react";

export default function JournalLetter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
  }

  return (
    <section className="bg-[#111] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
          R&R LETTER
        </p>

        <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
          Good things
          <br />
          worth reading.
        </h2>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/55">
          Occasional notes from the House — new juices, music,
          events, ingredients and stories worth sharing.
        </p>

        {submitted ? (
          <div className="mx-auto mt-10 max-w-xl border border-white/20 px-6 py-5 text-sm text-white/70">
            Thank you. The R&R Letter signup is ready for connection
            to the final email service.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="min-h-12 flex-1 border border-white/20 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/50"
            />

            <button
              type="submit"
              className="min-h-12 bg-white px-7 text-xs font-semibold uppercase tracking-[0.18em] !text-black transition hover:bg-white/80"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-white/25">
          No noise. Just the occasional note.
        </p>
      </div>
    </section>
  );
}