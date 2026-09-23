"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  ContentEvent,
  getAdminEvents,
  saveAdminEvent,
} from "@/lib/supabase/content";

const empty = {
  title: "",
  slug: "",
  description: "",
  category: "R&R",
  starts_at: "",
  ends_at: "",
  location: "",
  image_path: "",
  active: true,
};

export default function AdminEventsCMS() {
  const [events, setEvents] = useState<ContentEvent[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setEvents(await getAdminEvents());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function edit(event: ContentEvent) {
    setEditing(event.id);
    setForm({
      title: event.title,
      slug: event.slug || "",
      description: event.description || "",
      category: event.category || "R&R",
      starts_at: event.starts_at ? event.starts_at.slice(0, 16) : "",
      ends_at: event.ends_at ? event.ends_at.slice(0, 16) : "",
      location: event.location || "",
      image_path: event.image_path || "",
      active: event.active,
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    setError("");

    try {
      await saveAdminEvent({
        id: editing || undefined,
        ...form,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      });

      setEditing(null);
      setForm(empty);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save event.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Content · Events
          </p>
          <h1 className="mt-2 font-serif text-4xl">Events.</h1>
          <p className="mt-2 text-sm text-black/50">
            Publish and maintain the House calendar.
          </p>
        </div>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]">
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      {error && <div className="border border-red-900/20 bg-red-50 p-4 text-sm text-red-900">{error}</div>}

      <form onSubmit={submit} className="border border-black/10 bg-white p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
          {editing ? "Edit event" : "New event"}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="border border-black/15 px-4 py-3 text-sm md:col-span-2" />
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="border border-black/15 px-4 py-3 text-sm" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category e.g. MUSIC, CHESS, BOOKS" className="border border-black/15 px-4 py-3 text-sm" />
          <input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} className="border border-black/15 px-4 py-3 text-sm" />
          <input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} className="border border-black/15 px-4 py-3 text-sm" />
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="border border-black/15 px-4 py-3 text-sm" />
          <input value={form.image_path} onChange={(e) => setForm({ ...form, image_path: e.target.value })} placeholder="/images/events/..." className="border border-black/15 px-4 py-3 text-sm" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} className="border border-black/15 px-4 py-3 text-sm md:col-span-2" />
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Published / active
        </label>

        <button disabled={saving} className="mt-5 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white hover:bg-white hover:!text-black">
          {saving ? "Saving..." : editing ? "Update event" : "Publish event"}
        </button>
      </form>

      <div className="overflow-x-auto border border-black/10 bg-white">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center"><Loader2 size={20} className="animate-spin" /></div>
        ) : (
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
              <tr><th className="px-5 py-4">Event</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">State</th><th className="px-5 py-4 text-right">Action</th></tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5 font-serif text-lg">{event.title}</td>
                  <td className="px-5 py-5 text-xs uppercase tracking-[0.1em]">{event.category || "—"}</td>
                  <td className="px-5 py-5 text-sm">{event.starts_at ? new Date(event.starts_at).toLocaleString("en-KE") : "TBC"}</td>
                  <td className="px-5 py-5 text-xs uppercase tracking-[0.1em]">{event.active ? "Published" : "Draft"}</td>
                  <td className="px-5 py-5 text-right"><button onClick={() => edit(event)} className="border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em]">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
