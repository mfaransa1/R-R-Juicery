"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Mode = "signin" | "signup";

export default function AuthForm({ mode = "signin" }: { mode?: Mode }) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [modeState, setModeState] = useState<Mode>(mode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (modeState === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          window.location.href = "/account";
          return;
        }

        setMessage(
          "Account created. Check your email to confirm your address, then sign in."
        );
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) throw signInError;

        window.location.href = "/account";
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const isSignup = modeState === "signup";

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8 flex border-b border-black/10">
        <button
          type="button"
          onClick={() => {
            setModeState("signin");
            setError("");
            setMessage("");
          }}
          className={`border-b-2 px-1 pb-4 text-xs font-bold uppercase tracking-[0.14em] ${
            !isSignup ? "border-black" : "border-transparent text-black/45"
          }`}
        >
          Sign in
        </button>

        <button
          type="button"
          onClick={() => {
            setModeState("signup");
            setError("");
            setMessage("");
          }}
          className={`ml-8 border-b-2 px-1 pb-4 text-xs font-bold uppercase tracking-[0.14em] ${
            isSignup ? "border-black" : "border-transparent text-black/45"
          }`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignup && (
          <label className="block">
            <span className="rr-kicker">NAME</span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-base outline-none focus:border-black"
              placeholder="Your name"
            />
          </label>
        )}

        <label className="block">
          <span className="rr-kicker">EMAIL</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-base outline-none focus:border-black"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="rr-kicker">PASSWORD</span>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-base outline-none focus:border-black"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <div className="border border-red-900/20 bg-red-50 p-4 text-sm text-red-900">
            {error}
          </div>
        )}

        {message && (
          <div className="border border-black/10 bg-white p-4 text-sm">
            {message}
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="inline-flex min-h-12 items-center justify-center bg-black px-7 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : isSignup
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-sm leading-7 text-black/55">
        Your R&R account will be used for orders, favourites and R&R MOVES.
        <Link href="/faq" className="ml-1 underline underline-offset-4">
          Read the FAQ.
        </Link>
      </p>
    </div>
  );
}
