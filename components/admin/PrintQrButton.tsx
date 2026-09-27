"use client";

export default function PrintQrButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-7 border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white transition hover:bg-white hover:!text-black print:hidden"
    >
      Print QR Label
    </button>
  );
}