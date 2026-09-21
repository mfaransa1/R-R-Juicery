import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-6 text-[#111111]">
      <div className="w-full max-w-2xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
          Rook & Reed Juicery
        </p>

        <p className="rr-editorial mt-8 text-8xl font-medium leading-none tracking-[-0.05em] sm:text-9xl">
          404
        </p>

        <h1 className="rr-editorial mt-4 text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
          This move doesn't exist.
        </h1>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-black/55">
          The page you're looking for has moved, hasn't
          been created yet, or isn't part of the House.
        </p>

        <Link
          href="/"
          className="rr-button rr-button-primary mt-8 inline-flex"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}