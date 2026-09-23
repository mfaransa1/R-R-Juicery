"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, LockKeyhole, LogOut, Save, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getMyProfile, updateMyProfile } from "@/lib/supabase/profile";

export default function AccountSettingsContent() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await getMyProfile();
        if (!active) return;

        if (!result) {
          setError("Please sign in to manage your account.");
          return;
        }

        setEmail(result.email);
        setFullName(result.profile.full_name ?? "");
        setPhone(result.profile.phone ?? "");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load your profile.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateMyProfile({ full_name: fullName, phone });
      setMessage("Your details have been saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your details.");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    setMessage("");
    setError("");

    if (!email) {
      setError("Your account email could not be loaded.");
      return;
    }

    const supabase = createClient();
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
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/account";
  }

  if (loading) {
    return (
      <section className="bg-[#f5f1e8] py-24 text-[#111] lg:py-32">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            ACCOUNT SETTINGS
          </p>
          <div className="mt-10 h-48 animate-pulse bg-black/[0.04]" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f5f1e8] py-20 text-[#111] lg:py-28">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-14">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-black/55 transition hover:text-black"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Passport
        </Link>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              YOUR DETAILS
            </p>
            <h1 className="mt-5 font-serif text-6xl leading-[0.86] tracking-[-0.055em] sm:text-7xl">
              Keep your<br />
              details<br />
              current.
            </h1>
            <p className="mt-7 max-w-sm text-base leading-relaxed text-black/55">
              These details are used for your R&R account and future order communication.
            </p>

            <div className="mt-10 border-t border-black/15 pt-6">
              <div className="flex gap-4">
                <UserRound size={18} strokeWidth={1.4} className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Profile details</p>
                  <p className="mt-1 text-sm leading-relaxed text-black/45">
                    Update your name and phone number without changing your sign-in email.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <LockKeyhole size={18} strokeWidth={1.4} className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Account security</p>
                  <p className="mt-1 text-sm leading-relaxed text-black/45">
                    Password changes are handled securely through Supabase Auth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-10">
            {error ? (
              <div className="mb-7 border border-black/10 bg-[#f5f1e8] px-4 py-3 text-sm text-black/70">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mb-7 flex items-center gap-2 border border-black/10 bg-[#f5f1e8] px-4 py-3 text-sm text-black/70">
                <Check size={15} strokeWidth={1.7} />
                {message}
              </div>
            ) : null}

            <form onSubmit={handleSave}>
              <div>
                <label htmlFor="settings-email" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  Email
                </label>
                <input
                  id="settings-email"
                  value={email}
                  readOnly
                  className="mt-3 w-full border border-black/15 bg-black/[0.025] px-4 py-3 text-sm text-black/55 outline-none"
                />
                <p className="mt-2 text-xs text-black/40">Your sign-in email is managed by authentication.</p>
              </div>

              <div className="mt-7">
                <label htmlFor="settings-name" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  Full name
                </label>
                <input
                  id="settings-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  className="mt-3 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/45"
                  placeholder="Your full name"
                />
              </div>

              <div className="mt-7">
                <label htmlFor="settings-phone" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  Phone number
                </label>
                <input
                  id="settings-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  className="mt-3 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/45"
                  placeholder="07..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-[#111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={15} strokeWidth={1.5} />
                {saving ? "Saving..." : "Save details"}
              </button>
            </form>

            <div className="mt-12 border-t border-black/10 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">
                SECURITY
              </p>
              <button
                type="button"
                onClick={handleResetPassword}
                className="mt-4 text-sm underline underline-offset-4 decoration-black/25 transition hover:decoration-black"
              >
                Send me a password reset email
              </button>
            </div>

            <div className="mt-10 border-t border-black/10 pt-8">
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-black/55 transition hover:text-black"
              >
                <LogOut size={15} strokeWidth={1.5} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
