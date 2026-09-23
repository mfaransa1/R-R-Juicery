import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Create Account | The Rook & Reed Juicery",
  description: "Create your Rook & Reed account.",
};

export default function SignupPage() {
  return (
    <main className="bg-[var(--rr-paper)]">
      <section className="rr-container py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="rr-kicker">R&R PASSPORT</span>
            <h1 className="rr-editorial mt-5 max-w-xl text-6xl leading-[0.9] sm:text-8xl">
              Join the House.
            </h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-black/60">
              Create your account for orders, favourites and R&R MOVES.
            </p>
          </div>

          <div className="border-t border-black/10 pt-8">
            <AuthForm mode="signup" />
          </div>
        </div>
      </section>
    </main>
  );
}
