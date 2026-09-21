export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] text-[#111111]">
      <div className="text-center">
        <p className="rr-editorial text-4xl font-medium tracking-tight">
          Rook & Reed
        </p>

        <div className="mx-auto mt-5 h-px w-16 overflow-hidden bg-black/15">
          <div className="h-full w-1/2 animate-pulse bg-black" />
        </div>

        <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
          Preparing something fresh
        </p>
      </div>
    </main>
  );
}