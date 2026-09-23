import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ batchCode: string }>;
};

export default async function TraceBatchPage({ params }: PageProps) {
  const { batchCode } = await params;
  const supabase = await createClient();

  const { data: batch, error } = await supabase
    .from("batches")
    .select(`
      id,
      batch_code,
      production_date,
      use_by_date,
      status,
      notes,
      product:products(id,name,slug,category_label,size),
      ingredient:ingredients(id,name,origin,source,organic_status),
      supplier:suppliers(id,name)
    `)
    .eq("batch_code", batchCode)
    .in("status", ["completed", "released", "ready"])
    .single();

  if (error || !batch) {
    notFound();
  }

  const { data: events } = await supabase
    .from("batch_traceability_events")
    .select("id,event_type,description,created_at")
    .eq("batch_id", batch.id)
    .order("created_at", { ascending: true });

  const product = Array.isArray(batch.product) ? batch.product[0] ?? null : batch.product;
  const ingredient = Array.isArray(batch.ingredient) ? batch.ingredient[0] ?? null : batch.ingredient;
  const supplier = Array.isArray(batch.supplier) ? batch.supplier[0] ?? null : batch.supplier;

  return (
    <main className="min-h-screen bg-[#f5f1e8]">
      <section className="border-b border-black/10 bg-[#111111] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/45">
            R&R TRACEABILITY
          </p>
          <h1 className="mt-4 font-serif text-5xl tracking-[-0.04em] md:text-7xl">
            Know Your Juice.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
            This batch record shows the information Rook & Reed has recorded
            for this production batch.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-px border border-black/10 bg-black/10 md:grid-cols-2">
            <Info label="Batch" value={batch.batch_code} />
            <Info label="Status" value={batch.status} />
            <Info label="Product" value={product?.name ?? "Not recorded"} />
            <Info label="Size" value={product?.size ?? "Not recorded"} />
            <Info label="Production date" value={batch.production_date ?? "Not recorded"} />
            <Info label="Use by" value={batch.use_by_date ?? "Not recorded"} />
            <Info label="Ingredient" value={ingredient?.name ?? "Not recorded"} />
            <Info label="Supplier" value={supplier?.name ?? "Not recorded"} />
          </div>

          <div className="mt-10 border border-black/10 bg-white p-7 md:p-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
              Recorded sourcing
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <InfoPlain label="Source" value={ingredient?.source ?? "Not recorded"} />
              <InfoPlain label="Origin" value={ingredient?.origin ?? "Not recorded"} />
              <InfoPlain
                label="Organic status"
                value={ingredient?.organic_status ?? "unknown"}
              />
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
              Traceability timeline
            </p>

            <div className="mt-6 space-y-3">
              {(events ?? []).length > 0 ? (
                events!.map((event) => (
                  <div
                    key={event.id}
                    className="border-l-2 border-black/15 bg-white px-5 py-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/45">
                      {event.event_type.replaceAll("_", " ")}
                    </p>
                    {event.description && (
                      <p className="mt-2 text-sm leading-7 text-black/60">
                        {event.description}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-black/35">
                      {new Date(event.created_at).toLocaleString("en-KE")}
                    </p>
                  </div>
                ))
              ) : (
                <div className="border border-black/10 bg-white p-8 text-sm text-black/50">
                  No additional traceability events have been recorded for this batch.
                </div>
              )}
            </div>
          </div>

          {batch.notes && (
            <div className="mt-10 border border-black/10 bg-[#111111] p-7 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                Batch notes
              </p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                {batch.notes}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
        {label}
      </p>
      <p className="mt-3 text-sm font-medium text-[#111111]">{value}</p>
    </div>
  );
}

function InfoPlain({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
        {label}
      </p>
      <p className="mt-2 text-sm text-black/65">{value}</p>
    </div>
  );
}
