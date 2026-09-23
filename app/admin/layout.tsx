import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // `profiles` does not contain an email column. The authenticated email
  // comes from Supabase Auth instead.
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || (profile.role !== "staff" && profile.role !== "admin")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#111]">
      <AdminNav
        name={profile.full_name || user.email || "R&R Staff"}
        email={user.email || ""}
        role={profile.role}
      />
      <div className="lg:pl-[250px]">{children}</div>
    </div>
  );
}
