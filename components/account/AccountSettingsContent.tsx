"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole, LogOut, Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountSettingsContent() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (active) {
        setName(
          profile?.full_name?.trim() ||
            (user.user_metadata?.full_name as string | undefined) ||
            "R&R Guest",
        );
        setLoading(false);
      }
    }

    void loadUser();
    return () => {
      active = false;
    };
  }, [supabase]);

  async function handlePasswordReset() {
    setMessage("");
    setError("");

    if (!email) {
      setError("We could not find your account email.");
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Password reset instructions have been sent to your email.");
  }

  async function handleSignOut() {
    setSigningOut(true);
    setError("");
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setSigningOut(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-24 pt-28 text-[#111] sm:px-8 lg:px-10 lg:pt-36">
      <div className="mx-auto max-w-[1200px]">
        <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] !text-black/45 hover:!text-black">
          <ArrowLeft size={14} /> Passport
        </Link>

        <header className="mt-10 border-b border-black/10 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">R&R PASSPORT / ACCOUNT</p>
          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em] sm:text-7xl">Your details.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50">
            Your profile and security controls, kept deliberately simple.
          </p>
        </header>

        <div className="mt-10 grid gap-px border border-black/10 bg-black/10 lg:grid-cols-2">
          <section className="bg-white p-7 sm:p-10 lg:p-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/35">PROFILE</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em]">Your Passport details.</h2>

            <div className="mt-10 space-y-7">
              <div className="flex gap-4 border-t border-black/10 pt-6">
                <UserRound size={18} strokeWidth={1.35} className="mt-0.5 text-black/45" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">NAME</p>
                  <p className="mt-2 text-sm">{loading ? "Loading..." : name || "R&R Guest"}</p>
                </div>
              </div>

              <div className="flex gap-4 border-t border-black/10 pt-6">
                <Mail size={18} strokeWidth={1.35} className="mt-0.5 text-black/45" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">ACCOUNT EMAIL</p>
                  <p className="mt-2 break-all text-sm">{loading ? "Loading..." : email || "Not available"}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-black/10 pt-7">
              <p className="text-xs leading-6 text-black/45">
                Profile editing and communication preferences can be added when the corresponding database fields and consent handling are enabled.
              </p>
            </div>
          </section>

          <section className="bg-[#111111] p-7 text-white sm:p-10 lg:p-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">SECURITY</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em]">Keep it secure.</h2>

            <button
              type="button"
              onClick={() => void handlePasswordReset()}
              disabled={loading || !email}
              className="mt-10 flex w-full items-center justify-between border border-white/20 px-5 py-5 text-left !text-white transition hover:border-white/50 hover:!text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="flex items-center gap-4">
                <LockKeyhole size={19} strokeWidth={1.35} />
                <span>
                  <span className="block text-sm font-medium !text-white">Reset password</span>
                  <span className="mt-1 block text-xs text-white/45">Send a secure reset link to your account email.</span>
                </span>
              </span>
              <ArrowRight size={17} strokeWidth={1.35} />
            </button>

            {message ? <p className="mt-5 border border-white/15 px-5 py-4 text-sm text-white/75">{message}</p> : null}
            {error ? <p className="mt-5 border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-200">{error}</p> : null}

            <div className="mt-12 border-t border-white/15 pt-7">
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] !text-white/65 transition hover:!text-white disabled:opacity-45"
              >
                <LogOut size={15} strokeWidth={1.35} />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-black/10 pt-8">
          <Link href="/account/orders" className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] !text-black hover:bg-black hover:!text-white">
            Your orders <ArrowRight size={14} />
          </Link>
          <Link href="/account/rewards" className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] !text-black hover:bg-black hover:!text-white">
            R&R Moves <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
