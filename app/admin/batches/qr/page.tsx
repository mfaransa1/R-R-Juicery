import Link from "next/link";
import BatchQrCode from "@/components/admin/BatchQrCode";
import PrintQrButton from "@/components/admin/PrintQrButton";

export const metadata = {
  title: "Batch QR | R&R Control Room",
};

type Props = {
  searchParams: Promise<{
    batch?: string;
  }>;
};

export default async function BatchQrPage({ searchParams }: Props) {
  const params = await searchParams;
  const batchCode = params.batch?.trim() || "";

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 py-12 text-[#111111] lg:px-10">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          href="/admin/batches"
          className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45 transition hover:text-black"
        >
          ← Back to batches
        </Link>

        {/* Missing batch */}
        {!batchCode ? (
          <section className="mt-10 border border-black/10 bg-white p-8">
            <p className="text-sm text-black/60">
              No batch code was supplied.
            </p>

            <Link
              href="/admin/batches"
              className="mt-6 inline-flex border border-black bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] !text-white transition hover:bg-white hover:!text-black"
            >
              Return to batches
            </Link>
          </section>
        ) : (
          /* QR Label */
          <section className="mt-10 border border-black/10 bg-white p-8 text-center">
            {/* Label heading */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
              BOTTLE TRACE QR
            </p>

            {/* Batch number */}
            <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight">
              {batchCode}
            </h1>

            {/* QR */}
            <div className="mt-8 flex justify-center">
              <BatchQrCode
                batchCode={batchCode}
                size={280}
              />
            </div>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-black/55">
              Print this code on the bottle label or batch sticker.
              Customers are taken to the public R&R trace page for this
              batch.
            </p>

            {/* Print */}
            <PrintQrButton />
          </section>
        )}
      </div>
    </main>
  );
}