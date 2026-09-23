"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UserSummary = {
  email: string;
  name: string;
};

export default function AccountSession() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          email: user.email ?? "",
          name:
            (user.user_metadata?.full_name as string | undefined) ||
            user.email?.split("@")[0] ||
            "R&R Guest",
        });
      }

      setLoading(false);
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user;

      setUser(
        nextUser
          ? {
              email: nextUser.email ?? "",
              name:
                (nextUser.user_metadata?.full_name as string | undefined) ||
                nextUser.email?.split("@")[0] ||
                "R&R Guest",
            }
          : null
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  if (loading) {
    return (
      <div className="border-t border-black/10 py-8 text-sm text-black/50">
        Checking your passport...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="border-t border-black/10 py-8">
        <p className="text-sm leading-7 text-black/60">
          You are not signed in.
        </p>
        <a
          href="/auth"
          className="mt-5 inline-flex bg-black px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
        >
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="border-t border-black/10 py-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="rr-kicker">SIGNED IN</span>
          <h2 className="rr-editorial mt-3 text-4xl">{user.name}</h2>
          <p className="mt-2 text-sm text-black/55">{user.email}</p>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="border border-black/15 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-black hover:text-white"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
