"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your enquiry.");
      }

      setSubmitted(true);
      setForm(initialState);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-black/15 bg-[#f5f1e8] p-8 sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
          MESSAGE SENT
        </p>

        <h2 className="mt-6 font-serif text-5xl leading-[0.88] tracking-[-0.045em] sm:text-6xl">
          Thanks for
          <br />
          reaching out.
        </h2>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-black/55">
          Your enquiry has been sent to Rook & Reed. We&apos;ll get back to you
          using the contact details you provided.
        </p>

        <button
          type="button"
          onClick={() => {
            setForm(initialState);
            setSubmitted(false);
            setError("");
          }}
          className="mt-8 border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-black/15 bg-[#f5f1e8] p-7 sm:p-10 lg:p-12"
    >
      {/* Honeypot. Hidden from normal visitors; bots that fill it are rejected server-side. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
            NAME
          </span>

          <input
            required
            maxLength={100}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="mt-3 h-12 w-full border-b border-black/20 bg-transparent px-0 text-base outline-none transition focus:border-black"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
            EMAIL
          </span>

          <input
            required
            type="email"
            maxLength={254}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="mt-3 h-12 w-full border-b border-black/20 bg-transparent px-0 text-base outline-none transition focus:border-black"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
            PHONE
          </span>

          <input
            maxLength={30}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="mt-3 h-12 w-full border-b border-black/20 bg-transparent px-0 text-base outline-none transition focus:border-black"
            placeholder="Optional"
          />
        </label>

        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
            SUBJECT
          </span>

          <select
            required
            value={form.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            className="mt-3 h-12 w-full border-b border-black/20 bg-transparent px-0 text-base outline-none transition focus:border-black"
          >
            <option value="">Select one</option>
            <option value="General enquiry">General enquiry</option>
            <option value="Events">Events</option>
            <option value="Partnership">Partnership</option>
            <option value="Juice / catering">Juice / catering</option>
            <option value="Feedback">Feedback</option>
            <option value="Supplier">Supplier</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Media">Media</option>
            <option value="Something else">Something else</option>
          </select>
        </label>
      </div>

      <label className="mt-10 block">
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
          MESSAGE
        </span>

        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="mt-3 w-full resize-none border border-black/15 bg-transparent p-4 text-base outline-none transition focus:border-black"
          placeholder="Tell us what is on your mind..."
        />
      </label>

      {error && (
        <div
          role="alert"
          className="mt-7 border border-red-900/15 bg-red-50 p-4 text-sm leading-relaxed text-red-900"
        >
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col justify-between gap-5 border-t border-black/10 pt-7 sm:flex-row sm:items-center">
        <p className="max-w-md text-xs leading-relaxed text-black/40">
          We&apos;ll use the details you provide only to respond to your
          enquiry.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#111] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] !text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
