"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
          "Account created. Please check your email to confirm your account.",
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
      if (!data.user) throw new Error("Unable to complete sign in.");

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
          {isSignup ? "JOIN R&R" : "WELCOME BACK"}
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-none tracking-[-0.04em] text-[#111] sm:text-5xl">
          {isSignup ? "Create your account." : "Sign in."}
        </h1>
      </div>

      {error && (
        <div className="mb-6 border border-red-900/15 bg-red-900/[0.04] px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-6 border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black/70">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignup && (
          <>
            <div>
              <label htmlFor="fullName" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
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
                className="w-full border border-black/15 bg-[#f5f1e8] px-4 py-3.5 text-sm text-[#111] outline-none focus:border-black/50"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full border border-black/15 bg-[#f5f1e8] px-4 py-3.5 text-sm text-[#111] outline-none focus:border-black/50"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
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
            className="w-full border border-black/15 bg-[#f5f1e8] px-4 py-3.5 text-sm text-[#111] outline-none focus:border-black/50"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
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
            className="w-full border border-black/15 bg-[#f5f1e8] px-4 py-3.5 text-sm text-[#111] outline-none focus:border-black/50"
          />
        </div>

        {!isSignup && (
          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-xs text-black/50 underline underline-offset-4 hover:text-black">
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#111111] px-5 py-4 text-sm font-medium text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "PLEASE WAIT..." : isSignup ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
