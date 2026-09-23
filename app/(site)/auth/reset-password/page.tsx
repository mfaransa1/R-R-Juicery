import PasswordResetContent from "@/components/auth/PasswordResetContent";

export const metadata = {
  title: "Reset Password | R&R Passport",
  description: "Set a new password for your R&R Passport account.",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#111]">
      <PasswordResetContent />
    </main>
  );
}
