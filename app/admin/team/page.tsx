import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import TeamManager from "@/components/admin/TeamManager";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/admin");

  const admin = createAdminClient();
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (usersError) throw new Error(usersError.message);
  const ids = usersData.users.map((item) => item.id);
  const { data: profiles, error: profilesError } = ids.length
    ? await admin.from("profiles").select("id,full_name,phone,role,created_at,updated_at").in("id", ids).order("created_at", { ascending: false })
    : { data: [], error: null };
  if (profilesError) throw new Error(profilesError.message);

  const emailById = new Map(usersData.users.map((item) => [item.id, item.email || ""]));
  const team = (profiles ?? [])
    .filter((item) => item.role === "staff" || item.role === "admin")
    .map((item) => ({ ...item, email: emailById.get(item.id) || "" }));

  return <TeamManager initialTeam={team} currentUserId={user.id} />;
}
