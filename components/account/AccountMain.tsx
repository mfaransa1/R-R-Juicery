"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

type AccountUser = {
  id: string;
  email: string;
  name: string;
};

export default function AccountMain() {
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("signin");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email ?? "",
          name:
            (currentUser.user_metadata?.full_name as string | undefined) ||
            (currentUser.user_metadata?.name as string | undefined) ||
            currentUser.email?.split("@")[0] ||
            "R&R Guest",
        });
      }

      setCheckingSession(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name:
            (session.user.user_metadata?.full_name as string | undefined) ||
            (session.user.user_metadata?.name as string | undefined) ||
            session.user.email?.split("@")[0] ||
            "R&R Guest",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setSubmitted(false);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) throw signInError;

        setSubmitted(true);
        setPassword("");
        setMessage("Authentication successful.");
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        setPassword("");

        if (data.session) {
          setSubmitted(true);
          setMessage("Your R&R account is ready.");
        } else {
          setSubmitted(true);
          setMessage(
            "Your account has been created. Check your email to confirm your address before signing in."
          );
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    setError("");

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
      setSubmitted(false);
      setMode("signin");
      setName("");
      setEmail("");
      setPassword("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign out."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

      if (resetError) throw resetError;

      setMessage(
        "If an account exists for that email, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start password reset."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="account"
      className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36"
    >
      <div className="mx-auto grid max-w-[1200px] gap-16 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
            {user
              ? "R&R PASSPORT"
              : mode === "signin"
                ? "WELCOME BACK"
                : "JOIN R&R"}
          </p>

          <h2 className="mt-6 font-serif text-6xl leading-[0.82] tracking-[-0.055em] sm:text-8xl">
            {user ? (
              <>
                Your
                <br />
                moves.
              </>
            ) : mode === "signin" ? (
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
            {user
              ? "Your R&R Passport brings your orders, favourites and R&R MOVES journey together."
              : "Your R&R account brings your orders, favourites and R&R MOVES loyalty activity together."}
          </p>

          <div className="mt-10 space-y-4 border-t border-black/15 pt-7">
            <div className="flex gap-4">
              <UserRound
                size={18}
                strokeWidth={1.4}
                className="mt-0.5"
              />

              <div>
                <p className="text-sm font-medium">Your details</p>
                <p className="mt-1 text-sm leading-relaxed text-black/45">
                  {user
                    ? user.email
                    : "Keep your customer information in one place."}
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
                <p className="text-sm font-medium">Your orders</p>
                <p className="mt-1 text-sm leading-relaxed text-black/45">
                  {user
                    ? "Your order history is connected to your account."
                    : "Access your order history when you sign in."}
                </p>
              </div>
            </div>
          </div>

          {user && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/order"
                className="inline-flex items-center gap-3 border border-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
              >
                Track an order
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className="px-2 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45 underline underline-offset-4 transition hover:text-black disabled:opacity-40"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-6 sm:p-10">
          {checkingSession ? (
            <div className="py-16 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                R&R PASSPORT
              </p>
              <p className="mt-5 font-serif text-4xl">
                Checking your account.
              </p>
            </div>
          ) : user ? (
            <div>
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
                    SIGNED IN
                  </p>
                  <p className="mt-2 font-serif text-3xl">
                    {user.name}
                  </p>
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/35">
                  R&R PASSPORT
                </span>
              </div>

              <div className="mt-10 space-y-7">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
                    EMAIL
                  </p>
                  <p className="mt-2 text-sm">{user.email}</p>
                </div>

                <div className="border-t border-black/10 pt-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
                    YOUR ACCOUNT
                  </p>

                  <div className="mt-5 grid gap-px bg-black/10 sm:grid-cols-2">
                    <Link
                      href="/order"
                      className="group bg-white p-5 transition hover:bg-[#f5f1e8]"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                        Orders
                      </span>
                      <ArrowRight
                        size={15}
                        strokeWidth={1.5}
                        className="mt-6 transition-transform group-hover:translate-x-1"
                      />
                    </Link>

                    <Link
                      href="/menu"
                      className="group bg-white p-5 transition hover:bg-[#f5f1e8]"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                        Find a move
                      </span>
                      <ArrowRight
                        size={15}
                        strokeWidth={1.5}
                        className="mt-6 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-7 border border-red-900/15 bg-red-50 p-4 text-sm text-red-900">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex border-b border-black/10">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`-mb-px mr-7 border-b-2 px-1 pb-4 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    mode === "signin"
                      ? "border-black text-black"
                      : "border-transparent text-black/30"
                  }`}
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("signup")}
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
                        value={name}
                        onChange={(event) => setName(event.target.value)}
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
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
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
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-14 w-full border-b border-black/20 bg-transparent px-0 outline-none transition focus:border-black"
                    />
                  </label>

                  {mode === "signin" && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40 hover:text-black disabled:opacity-40"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="border border-red-900/15 bg-red-50 p-4 text-sm leading-6 text-red-900">
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="border border-black/10 bg-[#f5f1e8] p-4 text-sm leading-6 text-black/65">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-between bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>
                      {loading
                        ? "Please wait..."
                        : mode === "signin"
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
                    Secure authentication powered by the R&R account system.
                  </p>
                </form>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                    {mode === "signup" && !user
                      ? "CHECK YOUR EMAIL"
                      : "R&R PASSPORT"}
                  </p>

                  <h3 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em]">
                    {user ? "You're in." : "Almost there."}
                  </h3>

                  <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-black/50">
                    {message ||
                      "Your R&R account has been created successfully."}
                  </p>

                  <div className="mt-8 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setMessage("");
                      }}
                      className="border border-black px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
                    >
                      Back
                    </button>

                    {user && (
                      <Link
                        href="/order"
                        className="inline-flex items-center gap-3 bg-black px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#292929]"
                      >
                        Your orders
                        <ArrowRight size={14} strokeWidth={1.5} />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
