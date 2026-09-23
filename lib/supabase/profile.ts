import { createClient } from "@/lib/supabase/client";

export type RrProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "staff" | "admin";
  created_at: string;
  updated_at: string;
};

export async function getMyProfile(): Promise<RrProfile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id,email,full_name,phone,role,created_at,updated_at",
    )
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return data as RrProfile;
}
