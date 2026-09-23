"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  getAdminJournal,
  JournalPost,
  saveAdminJournal,
} from "@/lib/supabase/content";

const empty = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  category: "CULTURE",
  image_path: "",
  published_at: "",
  published: false,
};

export default function AdminJournalCMS() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setPosts(await getAdminJournal());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load journal.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function edit(post: JournalPost) {
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      body: post.body || "",
      category: post.category || "CULTURE",
      image_path: post.image_path || "",
      published_at: post.published_at ? post.published_at.slice(0, 16) : "",
      published: post.published,
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;

    setSaving(true);
    setError("");

    try {
      await saveAdminJournal({
        id: editing || undefined,
        ...form,
        published_at: form.published_at
          ? new Date(form.published_at).toISOString()
          : null,
      });
      setEditing(null);
      setForm(empty);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save journal post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Content · Journal
          </p>
          <h1 className="mt-2 font-serif text-4xl">Journal.</h1>
          <p className="mt-2 text-sm text-black/50">
            Write, edit and publish R&R stories.
          </p>
        </div>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]">
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      {error && <div className="border border-red-900/20 bg-red-50 p-4 text-sm text-red-900">{error}</div>}

      <form onSubmit={submit} className="border border-black/10 bg-white p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
          {editing ? "Edit post" : "New post"}
        </p>

        <div className="mt-5 grid gap-4">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border border-black/15 px-4 py-3 text-sm" />
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="border border-black/15 px-4 py-3 text-sm" />
          <div className="grid gap-4 md:grid-cols-2">
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="border border-black/15 px-4 py-3 text-sm" />
            <input value={form.image_path} onChange={(e) => setForm({ ...form, image_path: e.target.value })} placeholder="/images/journal/..." className="border border-black/15 px-4 py-3 text-sm" />
          </div>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt" rows={3} className="border border-black/15 px-4 py-3 text-sm" />
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Article body" rows={12} className="border border-black/15 px-4 py-3 text-sm font-mono" />
          <input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className="border border-black/15 px-4 py-3 text-sm" />
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>

        <button disabled={saving} className="mt-5 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white hover:bg-white hover:!text-black">
          {saving ? "Saving..." : editing ? "Update post" : "Save post"}
        </button>
      </form>

      <div className="overflow-x-auto border border-black/10 bg-white">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center"><Loader2 size={20} className="animate-spin" /></div>
        ) : (
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
              <tr><th className="px-5 py-4">Post</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Published</th><th className="px-5 py-4">State</th><th className="px-5 py-4 text-right">Action</th></tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5 font-serif text-lg">{post.title}</td>
                  <td className="px-5 py-5 text-xs uppercase tracking-[0.1em]">{post.category || "—"}</td>
                  <td className="px-5 py-5 text-sm">{post.published_at ? new Date(post.published_at).toLocaleDateString("en-KE") : "—"}</td>
                  <td className="px-5 py-5 text-xs uppercase tracking-[0.1em]">{post.published ? "Published" : "Draft"}</td>
                  <td className="px-5 py-5 text-right"><button onClick={() => edit(post)} className="border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em]">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
