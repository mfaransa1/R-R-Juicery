import { createClient } from "@/lib/supabase/client";

export type ContentEvent = {
  id: string;
  slug: string;
  title: string;
  host: string;
  category: string;
  frequency: string | null;
  date_label: string | null;
  time_label: string | null;
  description: string;
  location: string | null;
  image_path: string | null;
  video_path: string | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type JournalPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  date_label: string | null;
  body: string | null;
  image_path: string | null;
  video_path: string | null;
  published: boolean;
  published_at: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

const supabase = createClient();

function errorMessage(error: { message?: string; details?: string; hint?: string; code?: string }) {
  return [
    error.message || "Supabase request failed.",
    error.details ? `Details: ${error.details}` : "",
    error.hint ? `Hint: ${error.hint}` : "",
    error.code ? `Code: ${error.code}` : "",
  ].filter(Boolean).join(" ");
}

export async function getAdminEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(errorMessage(error));
  return (data ?? []) as ContentEvent[];
}

export async function createAdminEvent(input: Partial<ContentEvent> & Pick<ContentEvent, "title">) {
  const slug = input.slug?.trim() || slugify(input.title);
  const payload = {
    slug,
    title: input.title.trim(),
    host: input.host?.trim() || "Rook & Reed",
    category: input.category?.trim() || "R&R",
    frequency: input.frequency?.trim() || null,
    date_label: input.date_label?.trim() || null,
    time_label: input.time_label?.trim() || null,
    description: input.description?.trim() || "",
    location: input.location?.trim() || null,
    image_path: input.image_path?.trim() || null,
    video_path: input.video_path?.trim() || null,
    starts_at: input.starts_at || null,
    ends_at: input.ends_at || null,
    active: input.active ?? true,
    featured: input.featured ?? false,
  };
  const { data, error } = await supabase.from("events").insert(payload).select("*").single();
  if (error) throw new Error(errorMessage(error));
  return data as ContentEvent;
}

export async function updateAdminEvent(id: string, input: Partial<ContentEvent>) {
  const payload = {
    ...(input.slug !== undefined ? { slug: input.slug.trim() } : {}),
    ...(input.title !== undefined ? { title: input.title.trim() } : {}),
    ...(input.host !== undefined ? { host: input.host?.trim() || "Rook & Reed" } : {}),
    ...(input.category !== undefined ? { category: input.category?.trim() || "R&R" } : {}),
    ...(input.frequency !== undefined ? { frequency: input.frequency?.trim() || null } : {}),
    ...(input.date_label !== undefined ? { date_label: input.date_label?.trim() || null } : {}),
    ...(input.time_label !== undefined ? { time_label: input.time_label?.trim() || null } : {}),
    ...(input.description !== undefined ? { description: input.description?.trim() || "" } : {}),
    ...(input.location !== undefined ? { location: input.location?.trim() || null } : {}),
    ...(input.image_path !== undefined ? { image_path: input.image_path?.trim() || null } : {}),
    ...(input.video_path !== undefined ? { video_path: input.video_path?.trim() || null } : {}),
    ...(input.starts_at !== undefined ? { starts_at: input.starts_at || null } : {}),
    ...(input.ends_at !== undefined ? { ends_at: input.ends_at || null } : {}),
    ...(input.active !== undefined ? { active: input.active } : {}),
    ...(input.featured !== undefined ? { featured: input.featured } : {}),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("events").update(payload).eq("id", id).select("*").single();
  if (error) throw new Error(errorMessage(error));
  return data as ContentEvent;
}

export async function getAdminJournal() {
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(errorMessage(error));
  return (data ?? []) as JournalPost[];
}

export async function createAdminJournal(input: Partial<JournalPost> & Pick<JournalPost, "title" | "slug">) {
  const payload = {
    slug: input.slug.trim() || slugify(input.title),
    title: input.title.trim(),
    excerpt: input.excerpt?.trim() || null,
    category: input.category?.trim() || null,
    date_label: input.date_label?.trim() || null,
    body: input.body?.trim() || null,
    image_path: input.image_path?.trim() || null,
    video_path: input.video_path?.trim() || null,
    published: input.published ?? false,
    published_at: input.published ? input.published_at || new Date().toISOString() : input.published_at || null,
    featured: input.featured ?? false,
  };
  const { data, error } = await supabase.from("journal_posts").insert(payload).select("*").single();
  if (error) throw new Error(errorMessage(error));
  return data as JournalPost;
}

export async function updateAdminJournal(id: string, input: Partial<JournalPost>) {
  const payload = {
    ...(input.slug !== undefined ? { slug: input.slug.trim() } : {}),
    ...(input.title !== undefined ? { title: input.title.trim() } : {}),
    ...(input.excerpt !== undefined ? { excerpt: input.excerpt?.trim() || null } : {}),
    ...(input.category !== undefined ? { category: input.category?.trim() || null } : {}),
    ...(input.date_label !== undefined ? { date_label: input.date_label?.trim() || null } : {}),
    ...(input.body !== undefined ? { body: input.body?.trim() || null } : {}),
    ...(input.image_path !== undefined ? { image_path: input.image_path?.trim() || null } : {}),
    ...(input.video_path !== undefined ? { video_path: input.video_path?.trim() || null } : {}),
    ...(input.published !== undefined ? { published: input.published } : {}),
    ...(input.published_at !== undefined ? { published_at: input.published_at || null } : {}),
    ...(input.featured !== undefined ? { featured: input.featured } : {}),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("journal_posts").update(payload).eq("id", id).select("*").single();
  if (error) throw new Error(errorMessage(error));
  return data as JournalPost;
}

export async function getPublicEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("starts_at", { ascending: true, nullsFirst: false });
  if (error) throw new Error(errorMessage(error));
  return (data ?? []) as ContentEvent[];
}

export async function getPublicEventBySlug(slug: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", decodeURIComponent(slug).trim().toLowerCase())
    .eq("active", true)
    .maybeSingle();
  if (error) throw new Error(errorMessage(error));
  return data as ContentEvent | null;
}

export async function getPublicJournal() {
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error(errorMessage(error));
  return (data ?? []) as JournalPost[];
}

export async function getPublicJournalBySlug(slug: string) {
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("slug", decodeURIComponent(slug).trim().toLowerCase())
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(errorMessage(error));
  return data as JournalPost | null;
}

export async function uploadContentImage(bucket: "event-images" | "journal-images", file: File, prefix: string) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${prefix}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(errorMessage(error));
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
