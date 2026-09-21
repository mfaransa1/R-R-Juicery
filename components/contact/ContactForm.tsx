"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /*
     * Connect this to the final contact API / Resend workflow later.
     * For now this provides the complete front-end interaction.
     */
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-black/15 bg-[#f5f1e8] p-8 sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
          MESSAGE RECEIVED
        </p>

        <h2 className="mt-6 font-serif text-5xl leading-[0.88] tracking-[-0.045em] sm:text-6xl">
          Thanks for
          <br />
          reaching out.
        </h2>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-black/55">
          The contact form is currently in front-end mode. Connect
          the final email/API endpoint when the production backend is
          ready.
        </p>

        <button
          type="button"
          onClick={() => {
            setForm(initialState);
            setSubmitted(false);
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
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
            NAME
          </span>

          <input
            required
            value={form.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
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
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            className="mt-3 h-12 w-full border-b border-black/20 bg-transparent px-0 text-base outline-none transition focus:border-black"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
            PHONE
          </span>

          <input
            value={form.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
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
            onChange={(event) =>
              updateField("subject", event.target.value)
            }
            className="mt-3 h-12 w-full border-b border-black/20 bg-transparent px-0 text-base outline-none transition focus:border-black"
          >
            <option value="">Select one</option>
            <option value="general">General enquiry</option>
            <option value="events">Events</option>
            <option value="partnership">Partnership</option>
            <option value="catering">Juice / catering</option>
            <option value="feedback">Feedback</option>
            <option value="other">Something else</option>
          </select>
        </label>
      </div>

      <label className="mt-10 block">
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
          MESSAGE
        </span>

        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) =>
            updateField("message", event.target.value)
          }
          className="mt-3 w-full resize-none border border-black/15 bg-transparent p-4 text-base outline-none transition focus:border-black"
          placeholder="Tell us what is on your mind..."
        />
      </label>

      <div className="mt-8 flex flex-col justify-between gap-5 border-t border-black/10 pt-7 sm:flex-row sm:items-center">
        <p className="max-w-md text-xs leading-relaxed text-black/40">
          We&apos;ll use the details you provide to respond to your
          enquiry.
        </p>

        <button
          type="submit"
          className="bg-[#111] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] !text-white transition hover:bg-black/80"
        >
          Send message
        </button>
      </div>
    </form>
  );
}