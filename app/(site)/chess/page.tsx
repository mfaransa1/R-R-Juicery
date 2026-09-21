import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] px-6 py-32 text-[#111111]">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
          Rook & Reed Juicery
        </p>

        <h1 className="rr-editorial mt-6 text-6xl font-medium leading-none tracking-tight">
          Coming soon.
        </h1>

        <p className="mt-6 max-w-lg text-black/60">
          This part of the Rook & Reed experience is being built.
        </p>

        <Link
          href="/"
          className="rr-button rr-button-primary mt-8 inline-flex"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
