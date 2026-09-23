import AdminProductionOperations from "@/components/admin/AdminProductionOperations";

export const metadata = {
  title: "Production | R&R Control Room",
  description: "Production operations for The Rook & Reed Juicery.",
};

export default function ProductionPage() {
  return <AdminProductionOperations />;
}
