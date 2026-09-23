import AdminOrderAnalytics from "@/components/admin/AdminOrderAnalytics";
import AdminProductPerformance from "@/components/admin/AdminProductPerformance";

export const metadata = {
  title: "Analytics | R&R Control Room",
  description: "Operational analytics for The Rook & Reed Juicery.",
};

export default function AdminAnalyticsPage() {
  return (
    <main className="space-y-14">
      <AdminOrderAnalytics />
      <AdminProductPerformance />
    </main>
  );
}
