"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  MapPin,
  Plus,
} from "lucide-react";

const stages = [
  {
    number: "01",
    title: "FARM",
    description:
      "Origin information for the agricultural source.",
    status: "INPUT NEEDED",
  },
  {
    number: "02",
    title: "SUPPLIER",
    description:
      "Supplier identity, documentation and delivery records.",
    status: "INPUT NEEDED",
  },
  {
    number: "03",
    title: "R&R",
    description:
      "Receiving, inspection, storage and preparation records.",
    status: "READY",
  },
  {
    number: "04",
    title: "JUICE",
    description:
      "Final product, batch and preparation information.",
    status: "READY",
  },
];

const records = [
  {
    ingredient: "Pineapple",
    source: "REQUIRED INPUT",
    status: "UNKNOWN",
    updated: "Not recorded",
  },
  {
    ingredient: "Orange",
    source: "REQUIRED INPUT",
    status: "UNKNOWN",
    updated: "Not recorded",
  },
  {
    ingredient: "Ginger",
    source: "REQUIRED INPUT",
    status: "UNKNOWN",
    updated: "Not recorded",
  },
  {
    ingredient: "Cucumber",
    source: "REQUIRED INPUT",
    status: "UNKNOWN",
    updated: "Not recorded",
  },
];

export default function AdminSourcing() {
  const [view, setView] = useState<
    "overview" | "records"
  >("overview");

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
            OPERATIONS / SUPPLY CHAIN
          </p>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
            Sourcing.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/45">
            Track the journey from source to finished juice
            without inventing missing provenance.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-3 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          <Plus size={15} strokeWidth={1.3} />
          Add record
        </button>
      </div>

      <div className="mt-8 flex gap-6 border-b border-black/10">
        <button
          type="button"
          onClick={() => setView("overview")}
          className={`border-b-2 pb-4 text-[9px] font-semibold uppercase tracking-[0.18em] ${
            view === "overview"
              ? "border-black text-black"
              : "border-transparent text-black/30"
          }`}
        >
          Journey
        </button>

        <button
          type="button"
          onClick={() => setView("records")}
          className={`border-b-2 pb-4 text-[9px] font-semibold uppercase tracking-[0.18em] ${
            view === "records"
              ? "border-black text-black"
              : "border-transparent text-black/30"
          }`}
        >
          Records
        </button>
      </div>

      {view === "overview" ? (
        <>
          <section className="mt-10">
            <div className="grid gap-px border border-black/10 bg-black/10 md:grid-cols-2 xl:grid-cols-4">
              {stages.map((stage, index) => (
                <div
                  key={stage.number}
                  className="bg-white p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] text-black/25">
                      {stage.number}
                    </span>

                    {stage.status === "READY" ? (
                      <CheckCircle2
                        size={17}
                        strokeWidth={1.3}
                      />
                    ) : (
                      <CircleAlert
                        size={17}
                        strokeWidth={1.3}
                        className="text-black/35"
                      />
                    )}
                  </div>

                  <h2 className="mt-12 font-serif text-4xl tracking-[-0.04em]">
                    {stage.title}
                  </h2>

                  <p className="mt-4 min-h-[52px] text-xs leading-relaxed text-black/45">
                    {stage.description}
                  </p>

                  <div className="mt-7 border-t border-black/10 pt-4">
                    <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-black/35">
                      {stage.status}
                    </span>
                  </div>

                  {index < stages.length - 1 && (
                    <ArrowRight
                      size={16}
                      strokeWidth={1.3}
                      className="mt-6 hidden text-black/20 xl:block"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-8 xl:grid-cols-[1fr_0.65fr]">
            <div className="border border-black/10 bg-white p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                    TRACEABILITY
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    Source map
                  </h2>
                </div>

                <MapPin
                  size={20}
                  strokeWidth={1.3}
                  className="text-black/30"
                />
              </div>

              <div className="mt-8 flex min-h-[300px] items-center justify-center border border-black/10 bg-[#f5f1e8]">
                <div className="text-center">
                  <MapPin
                    size={30}
                    strokeWidth={1.2}
                    className="mx-auto text-black/25"
                  />

                  <p className="mt-5 font-serif text-2xl">
                    Sourcing map
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-relaxed text-black/40">
                    Exact farm, supplier and geographic records
                    can be displayed here once verified data is
                    available.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] p-7 text-white">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                FUTURE / QR
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[0.9] tracking-[-0.04em]">
                One batch.
                <br />
                One story.
              </h2>

              <p className="mt-6 text-sm leading-relaxed text-white/45">
                Future QR traceability can connect a batch ID to
                production date, product, ingredients, source,
                preparation and storage information.
              </p>

              <div className="mt-10 border-t border-white/10 pt-5">
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
                  BATCH SYSTEM
                </p>

                <p className="mt-2 text-xs text-white/45">
                  Ready for backend implementation.
                </p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="mt-10 overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-black/10 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/30">
                <th className="px-6 py-4">Ingredient</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {records.map((record) => (
                <tr
                  key={record.ingredient}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-6 py-5 font-serif text-xl">
                    {record.ingredient}
                  </td>

                  <td className="px-6 py-5 text-xs text-black/40">
                    {record.source}
                  </td>

                  <td className="px-6 py-5">
                    <span className="border border-black/10 px-3 py-1.5 text-[8px] font-semibold tracking-[0.14em]">
                      {record.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-xs text-black/35">
                    {record.updated}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      type="button"
                      className="text-[9px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}