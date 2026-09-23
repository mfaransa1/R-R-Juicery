"use client";

import Link from "next/link";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordResetContent() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (password.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setPassword("");
    setConfirmPassword("");
    setSaving(false);
  }

  return (
    <section className="mx-auto max-w-[760px] px-5 pb-24 pt-28 sm:px-8 lg:px-14 lg:pt-36">
      <div className="border border-black/15 bg-white p-7 sm:p-10 lg:p-14">
        <div className="flex h-11 w-11 items-center justify-center border border-black/15">
          <LockKeyhole size={19} strokeWidth={1.35} />
        </div>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
          R&R PASSPORT
        </p>

        <h1 className="mt-5 font-serif text-5xl leading-[0.88] tracking-[-0.045em] sm:text-7xl">
          Set a new password.
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-black/55 sm:text-base">
          Choose a new password for your R&R account. Use at least eight
          characters.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
              NEW PASSWORD
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full border border-black/15 bg-transparent px-4 py-4 outline-none transition focus:border-black"
              required
              minLength={8}
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
              CONFIRM PASSWORD
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full border border-black/15 bg-transparent px-4 py-4 outline-none transition focus:border-black"
              required
              minLength={8}
            />
          </label>

          {error ? (
            <div className="border border-red-900/20 bg-red-50 px-5 py-4 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="flex gap-3 border border-black/15 bg-[#f5f1e8] px-5 py-4 text-sm text-black/70">
              <Check size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
              <span>Your password has been updated successfully.</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-between bg-[#111] px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{saving ? "Updating..." : "Update password"}</span>
            <ArrowRight size={17} strokeWidth={1.35} />
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-black/15 pt-6">
          <Link
            href="/account"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55 transition hover:text-black"
          >
            Back to passport
          </Link>
          <Link
            href="/auth/login"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55 transition hover:text-black"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
