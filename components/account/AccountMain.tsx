"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  UserRound,
} from "lucide-react";

export default function AccountMain() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="account"
      className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36"
    >
      <div className="mx-auto grid max-w-[1200px] gap-16 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
            {mode === "signin" ? "WELCOME BACK" : "JOIN R&R"}
          </p>

          <h2 className="mt-6 font-serif text-6xl leading-[0.82] tracking-[-0.055em] sm:text-8xl">
            {mode === "signin" ? (
              <>
                Make
                <br />
                your
                <br />
                move.
              </>
            ) : (
              <>
                Start
                <br />
                your
                <br />
                story.
              </>
            )}
          </h2>

          <p className="mt-8 max-w-md text-base leading-relaxed text-black/55">
            Your R&R account will eventually bring your orders,
            favourites and R&R MOVES loyalty activity together.
          </p>

          <div className="mt-10 space-y-4 border-t border-black/15 pt-7">
            <div className="flex gap-4">
              <UserRound
                size={18}
                strokeWidth={1.4}
                className="mt-0.5"
              />

              <div>
                <p className="text-sm font-medium">
                  Your details
                </p>
                <p className="mt-1 text-sm leading-relaxed text-black/45">
                  Keep your customer information in one place.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <LockKeyhole
                size={18}
                strokeWidth={1.4}
                className="mt-0.5"
              />

              <div>
                <p className="text-sm font-medium">
                  Your orders
                </p>
                <p className="mt-1 text-sm leading-relaxed text-black/45">
                  Access your order history when the account
                  system is connected.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-10">
          <div className="flex border-b border-black/10">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setSubmitted(false);
              }}
              className={`-mb-px border-b-2 px-1 pb-4 mr-7 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                mode === "signin"
                  ? "border-black text-black"
                  : "border-transparent text-black/30"
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setSubmitted(false);
              }}
              className={`-mb-px border-b-2 px-1 pb-4 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                mode === "signup"
                  ? "border-black text-black"
                  : "border-transparent text-black/30"
              }`}
            >
              Create account
            </button>
          </div>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >
              {mode === "signup" && (
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                    Name
                  </span>

                  <input
                    required
                    type="text"
                    name="name"
                    className="h-14 w-full border-b border-black/20 bg-transparent px-0 outline-none transition focus:border-black"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                  Email
                </span>

                <input
                  required
                  type="email"
                  name="email"
                  className="h-14 w-full border-b border-black/20 bg-transparent px-0 outline-none transition focus:border-black"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                  Password
                </span>

                <input
                  required
                  type="password"
                  name="password"
                  minLength={6}
                  className="h-14 w-full border-b border-black/20 bg-transparent px-0 outline-none transition focus:border-black"
                />
              </label>

              {mode === "signin" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40 hover:text-black"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="group flex w-full items-center justify-between bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#292929]"
              >
                <span>
                  {mode === "signin"
                    ? "Sign in"
                    : "Create account"}
                </span>

                <ArrowRight
                  size={17}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <p className="pt-2 text-center text-[10px] leading-relaxed text-black/35">
                Authentication will be connected to the R&R
                account system.
              </p>
            </form>
          ) : (
            <div className="py-16 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                DEMO / FRONT-END READY
              </p>

              <h3 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em]">
                You&apos;re in.
              </h3>

              <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-black/50">
                The account interface is ready. Connect the
                authentication provider to make sign-in and
                account creation live.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 border border-black px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}