 "use client";

import Link from "next/link";
import { ExternalLink, PackageCheck, QrCode, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import BatchQrCode from "@/components/admin/BatchQrCode";
import {
  getAdminBatches,
  getBatchProducts,
  type AdminBatch,
  type BatchProduct,
} from "@/lib/supabase/batchesAdmin";

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<AdminBatch[]>([]);
  const [products, setProducts] = useState<BatchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AdminBatch | null>(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const rows = await getAdminBatches();
      const productRows = await getBatchProducts(
        rows.map((row) => row.product_id ?? ""),
      );

      setBatches(rows);
      setProducts(productRows);
    } catch (err) {
      console.error("ADMIN BATCHES ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load batches.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  return (
    <main className="space-y-8">
      <header className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
            Production control
          </p>
          <h1 className="rr-editorial mt-2 text-5xl">Batches</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/55">
            Manage production batches, generate bottle QR codes, and open the
            public traceability record for each batch.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 border border-black/15 bg-white px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-black"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>

          <Link
            href="/admin/production"
            className="inline-flex items-center gap-2 border border-black bg-black px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] !text-white hover:bg-white hover:!text-black"
          >
            <PackageCheck className="h-3.5 w-3.5" />
            Production
          </Link>
        </div>
      </header>

      {error && (
        <div className="border border-red-900/20 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center border border-black/10 bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
            Loading batches
          </p>
        </div>
      ) : !batches.length ? (
        <div className="border border-black/10 bg-white p-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            No batches yet
          </p>
          <p className="mt-3 text-sm text-black/55">
            Complete a production run, then create its traceability batch.
          </p>
        </div>
      ) : (
        <section className="overflow-hidden border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-[#f5f1e8] text-left">
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em]">Batch</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em]">Product</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em]">Produced</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em]">Output</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em]">Status</th>
                  <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.16em]">Trace</th>
                </tr>
              </thead>

              <tbody>
                {batches.map((batch) => {
                  const product = batch.product_id
                    ? productMap.get(batch.product_id)
                    : undefined;

                  return (
                    <tr key={batch.id} className="border-b border-black/10 last:border-0">
                      <td className="px-5 py-5 align-top">
                        <p className="font-mono text-sm font-semibold">
                          {batch.batch_code}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-black/35">
                          {batch.id}
                        </p>
                      </td>

                      <td className="px-5 py-5 align-top">
                        <p className="text-sm font-medium">
                          {product?.name || "Product unavailable"}
                        </p>
                        {product?.slug && (
                          <Link
                            href={`/menu/${product.slug}`}
                            target="_blank"
                            className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45 hover:text-black"
                          >
                            View product
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </td>

                      <td className="px-5 py-5 align-top text-sm text-black/60">
                        {batch.production_date
                          ? new Date(batch.production_date).toLocaleDateString("en-KE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : new Date(batch.created_at).toLocaleDateString("en-KE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                      </td>

                      <td className="px-5 py-5 align-top text-sm text-black/60">
                        {batch.output_quantity != null
                          ? `${batch.output_quantity}${batch.output_unit ? ` ${batch.output_unit}` : ""}`
                          : "—"}
                      </td>

                      <td className="px-5 py-5 align-top">
                        <span className="inline-flex border border-black/10 bg-[#f5f1e8] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em]">
                          {batch.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-5 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelected(batch)}
                            className="inline-flex items-center gap-2 border border-black bg-black px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] !text-white hover:bg-white hover:!text-black"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            QR
                          </button>

                          <Link
                            href={`/trace/${encodeURIComponent(batch.batch_code)}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 border border-black/15 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-black"
                          >
                            Trace
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto bg-white p-6">
            <div className="flex items-start justify-between gap-5 border-b border-black/10 pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                  Bottle QR
                </p>
                <h2 className="mt-2 font-mono text-xl font-semibold">
                  {selected.batch_code}
                </h2>
                <p className="mt-2 text-sm text-black/50">
                  {productMap.get(selected.product_id ?? "")?.name ||
                    "R&R batch"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
              >
                Close
              </button>
            </div>

            <div className="py-7">
              <BatchQrCode batchCode={selected.batch_code} />
            </div>

            <div className="flex gap-2">
              <Link
                href={`/trace/${encodeURIComponent(selected.batch_code)}`}
                target="_blank"
                className="flex-1 border border-black bg-black px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.14em] !text-white hover:bg-white hover:!text-black"
              >
                Open Trace
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 border border-black/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-black"
              >
                Print QR
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
