import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign In | The Rook & Reed Juicery",
  description: "Sign in or create your Rook & Reed account.",
};

export default function AuthPage() {
  return (
    <main className="bg-[var(--rr-paper)]">
      <section className="rr-container py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="rr-kicker">R&R PASSPORT</span>
            <h1 className="rr-editorial mt-5 max-w-xl text-6xl leading-[0.9] sm:text-8xl">
              Your move.
            </h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-black/60">
              Keep your orders, favourites and future R&R MOVES connected to
              one account.
            </p>
          </div>

          <div className="border-t border-black/10 pt-8">
            <AuthForm />
          </div>
        </div>
      </section>
    </main>
  );
}
