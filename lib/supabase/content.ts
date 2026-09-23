import { createClient } from "@/lib/supabase/client";

export type ContentEvent = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  category: string | null;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  image_path: string | null;
  active: boolean;
};

export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  image_path: string | null;
  published_at: string | null;
  published: boolean;
};

export async function getAdminEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as ContentEvent[];
}

export async function saveAdminEvent(input: Partial<ContentEvent> & Pick<ContentEvent, "title">) {
  const supabase = createClient();

  const payload = {
    title: input.title,
    slug: input.slug || null,
    description: input.description || null,
    category: input.category || null,
    starts_at: input.starts_at || null,
    ends_at: input.ends_at || null,
    location: input.location || null,
    image_path: input.image_path || null,
    active: input.active ?? true,
  };

  const query = input.id
    ? supabase.from("events").update(payload).eq("id", input.id)
    : supabase.from("events").insert(payload);

  const { error } = await query;
  if (error) throw error;
}

export async function getAdminJournal() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as JournalPost[];
}

export async function saveAdminJournal(input: Partial<JournalPost> & Pick<JournalPost, "title" | "slug">) {
  const supabase = createClient();

  const payload = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt || null,
    body: input.body || null,
    category: input.category || null,
    image_path: input.image_path || null,
    published_at: input.published_at || null,
    published: input.published ?? false,
  };

  const query = input.id
    ? supabase.from("journal_posts").update(payload).eq("id", input.id)
    : supabase.from("journal_posts").insert(payload);

  const { error } = await query;
  if (error) throw error;
}
