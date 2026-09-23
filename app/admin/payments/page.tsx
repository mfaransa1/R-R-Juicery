import AdminPaymentReconciliation from "@/components/admin/AdminPaymentReconciliation";

export const metadata = {
  title: "Payments | R&R Control Room",
  description: "Payment reconciliation for The Rook & Reed Juicery.",
};

export default function AdminPaymentsPage() {
  return <AdminPaymentReconciliation />;
}
