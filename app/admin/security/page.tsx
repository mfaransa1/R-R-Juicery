import AdminSecurityHardening from "@/components/admin/AdminSecurityHardening";

export const metadata = {
  title: "Security | R&R Control Room",
  description: "Production security hardening controls.",
};

export default function SecurityPage() {
  return <AdminSecurityHardening />;
}
