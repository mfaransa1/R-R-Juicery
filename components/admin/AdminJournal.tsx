"use client";

import { FileText, Plus } from "lucide-react";
import { journalPosts } from "@/data/journal";

export default function AdminJournal() {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
            OPERATIONS / CONTENT
          </p>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
            Journal.
          </h1>

          <p className="mt-3 text-sm text-black/45">
            Manage stories, culture pieces and R&R editorial.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-3 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          <Plus size={15} strokeWidth={1.3} />
          New story
        </button>
      </div>

      <div className="mt-8 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[850px] text-left">
          <thead>
            <tr className="border-b border-black/10 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/30">
              <th className="px-6 py-4">Story</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {journalPosts.map((post) => (
              <tr
                key={post.slug}
                className="border-b border-black/5 last:border-0"
              >
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10">
                      <FileText
                        size={17}
                        strokeWidth={1.3}
                        className="text-black/35"
                      />
                    </div>

                    <div>
                      <p className="font-serif text-xl">
                        {post.title}
                      </p>

                      <p className="mt-1 max-w-md text-[10px] leading-relaxed text-black/35">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-6 text-[9px] font-semibold uppercase tracking-[0.13em] text-black/40">
                  {post.category}
                </td>

                <td className="px-6 py-6 text-xs text-black/40">
                  {post.date}
                </td>

                <td className="px-6 py-6">
                  <span className="border border-black/10 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em]">
                    {post.date === "REQUIRED INPUT"
                      ? "DRAFT"
                      : "PUBLISHED"}
                  </span>
                </td>

                <td className="px-6 py-6">
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
      </div>
    </div>
  );
}