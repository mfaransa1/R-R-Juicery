"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function AuthForm({ mode = "signin" }: { mode?: Mode }) {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          window.location.href = "/account";
          return;
        }

        setMessage(
          "Your R&R Passport has been created. Please check your email to confirm your account.",
        );

        setLoading(false);
        return;
      }

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) throw signInError;

      if (!data.user) {
        throw new Error("Unable to complete sign in.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        if (profileError.code === "PGRST116") {
          window.location.href = "/account";
          return;
        }

        throw profileError;
      }

      if (profile?.role === "staff" || profile?.role === "admin") {
        window.location.href = "/admin";
        return;
      }

      window.location.href = "/account";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
          {isSignup ? "JOIN R&R" : "R&R PASSPORT"}
        </p>

        <h1 className="mt-4 font-serif text-4xl leading-none tracking-[-0.04em] text-[#111] sm:text-5xl">
          {isSignup ? "Get your Passport." : "Welcome back."}
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-black/55">
          {isSignup
            ? "Create your R&R Passport to keep your orders, saved juices and R&R Moves together."
            : "Sign in to your R&R Passport to continue your journey at the House."}
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-red-900/15 bg-red-900/[0.04] px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-6 border border-black/10 bg-black/[0.03] px-4 py-3 text-sm leading-6 text-black/70">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignup && (
          <>
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50"
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full border border-black/15 bg-[#f5f1e8] px-4 py-3.5 text-sm text-[#111] outline-none transition-colors focus:border-black/50"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full border border-black/15 bg-[#f5f1e8] px-4 py-3.5 text-sm text-[#111] outline-none transition-colors focus:border-black/50"
              />
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-black/15 bg-[#f5f1e8] px-4 py-3.5 text-sm text-[#111] outline-none transition-colors focus:border-black/50"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-black/15 bg-[#f5f1e8] px-4 py-3.5 text-sm text-[#111] outline-none transition-colors focus:border-black/50"
          />
        </div>

        {!isSignup && (
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-black/50 underline underline-offset-4 transition-colors hover:text-black"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 bg-[#111111] px-5 py-4 text-sm font-medium !text-white transition-colors hover:bg-black/80 hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "PLEASE WAIT..."
            : isSignup
              ? "GET YOUR PASSPORT"
              : "SIGN IN"}

          {!loading && <ArrowRight size={16} strokeWidth={1.5} />}
        </button>
      </form>

      <div className="mt-10 border-t border-black/10 pt-7">
        {isSignup ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-black/55">
              Already have an R&R Passport?
            </p>

            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Sign in
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-black">
                New here?
              </p>

              <p className="mt-1 text-sm text-black/50">
                Get a new R&R Passport.
              </p>
            </div>

            <Link
              href="/auth?mode=signup"
              className="inline-flex items-center justify-center gap-2 border border-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-black hover:!text-white"
            >
              Get your Passport
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}