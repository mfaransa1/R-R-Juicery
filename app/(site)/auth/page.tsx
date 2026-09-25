import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "R&R Passport | The Rook & Reed Juicery",
  description:
    "Sign in or create your Rook & Reed Passport.",
};

type AuthPageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function AuthPage({
  searchParams,
}: AuthPageProps) {
  const params = await searchParams;

  const mode = params.mode === "signup" ? "signup" : "signin";

  return (
    <main className="bg-[var(--rr-paper)]">
      <section className="rr-container py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="rr-kicker">
              R&R PASSPORT
            </span>

            <h1 className="rr-editorial mt-5 max-w-xl text-6xl leading-[0.9] sm:text-8xl">
              {mode === "signup" ? (
                <>
                  Start
                  <br />
                  here.
                </>
              ) : (
                <>
                  Your
                  <br />
                  move.
                </>
              )}
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-black/60">
              {mode === "signup"
                ? "Create your R&R Passport and keep your orders, favourites and R&R MOVES connected."
                : "Keep your orders, favourites and future R&R MOVES connected to one account."}
            </p>
          </div>

          <div className="border-t border-black/10 pt-8">
            <AuthForm mode={mode} />
          </div>
        </div>
      </section>
    </main>
  );
}