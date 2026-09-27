import { createClient } from "@/lib/supabase/client";

export type PublicJazzEvent = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  date_label: string | null;
  time_label: string | null;
  location: string | null;
  image_path: string | null;
  video_path: string | null;
  featured: boolean;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

export async function getPublicJazzEvents(): Promise<PublicJazzEvent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      [
        "id",
        "title",
        "slug",
        "description",
        "date_label",
        "time_label",
        "location",
        "image_path",
        "video_path",
        "featured",
        "active",
        "starts_at",
        "ends_at",
      ].join(","),
    )
    .eq("active", true)
    .order("starts_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as PublicJazzEvent[];
}
