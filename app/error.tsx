"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-6 text-[#111111]">
      <div className="w-full max-w-2xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
          Rook & Reed Juicery
        </p>

        <h1 className="rr-editorial mt-6 text-7xl font-medium leading-[0.85] tracking-[-0.04em] sm:text-8xl">
          Something
          <br />
          went wrong.
        </h1>

        <p className="mx-auto mt-8 max-w-md text-sm leading-7 text-black/55">
          We hit an unexpected problem. You can try again
          or return to the Rook & Reed home.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="rr-button rr-button-primary"
          >
            Try again
          </button>

          <Link
            href="/"
            className="rr-button rr-button-secondary"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}