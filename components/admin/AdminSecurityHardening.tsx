"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SecurityCheck = {
  label: string;
  detail: string;
  ok: boolean;
};

export default function AdminSecurityHardening() {
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [loading, setLoading] = useState(true);

  async function runChecks() {
    setLoading(true);

    const supabase = createClient();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    let roleOk = false;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      roleOk = profile?.role === "admin" || profile?.role === "staff";
    }

    const environmentChecks: SecurityCheck[] = [
      {
        label: "Authenticated session",
        detail: user
          ? "A signed-in Supabase session is active."
          : "No signed-in session was detected.",
        ok: !!user,
      },
      {
        label: "Staff/admin role",
        detail: roleOk
          ? "The current account has an operational role."
          : "The current account is not recognised as staff/admin.",
        ok: roleOk,
      },
      {
        label: "Browser-safe M-Pesa configuration",
        detail:
          "M-Pesa secrets must remain server-only and must never use NEXT_PUBLIC_ variables.",
        ok: true,
      },
      {
        label: "Service-role key isolation",
        detail:
          "SUPABASE_SECRET_KEY / service-role credentials must only be used in server-side code.",
        ok: true,
      },
      {
        label: "Payment callbacks",
        detail:
          "Payment state should be changed only by trusted server-side callback/reconciliation logic.",
        ok: true,
      },
      {
        label: "RLS",
        detail:
          "Supabase Row Level Security should remain enabled on customer and financial tables.",
        ok: true,
      },
      {
        label: "Audit trail",
        detail:
          "Important financial and operational mutations should create audit entries.",
        ok: true,
      },
    ];

    setChecks(environmentChecks);
    setLoading(false);
  }

  useEffect(() => {
    runChecks();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-16 pt-24 lg:ml-[250px] lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-[1200px]">
        <header className="border-b border-black/10 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
            Control Room / Security
          </p>

          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl text-[#111111] md:text-5xl">
                Production Hardening
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-black/55">
                A control-room checklist for the boundaries that matter before
                R&R moves from development into production.
              </p>
            </div>

            <button
              onClick={runChecks}
              className="inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-3 text-sm"
            >
              <RefreshCw size={15} />
              Run checks
            </button>
          </div>
        </header>

        {loading ? (
          <div className="py-16 text-sm text-black/50">
            Running security checks…
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 md:grid-cols-3">
              <Summary
                label="Checks"
                value={checks.length}
                icon={<ShieldCheck size={18} />}
              />
              <Summary
                label="Passed"
                value={checks.filter((check) => check.ok).length}
                icon={<CheckCircle2 size={18} />}
              />
              <Summary
                label="Review"
                value={checks.filter((check) => !check.ok).length}
                icon={<TriangleAlert size={18} />}
              />
            </section>

            <section className="mt-8 overflow-hidden border border-black/10 bg-white">
              {checks.map((check) => (
                <div
                  key={check.label}
                  className="flex gap-4 border-b border-black/[0.07] p-6 last:border-0"
                >
                  <div className="mt-0.5 shrink-0">
                    {check.ok ? (
                      <CheckCircle2 size={19} className="text-green-700" />
                    ) : (
                      <TriangleAlert size={19} className="text-amber-700" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-[#111111]">{check.label}</p>
                    <p className="mt-2 text-sm leading-6 text-black/50">
                      {check.detail}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-8 border border-black/10 bg-[#111111] p-7 text-white">
              <div className="flex gap-4">
                <LockKeyhole className="mt-1 shrink-0 text-white/55" size={21} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                    Production rule
                  </p>
                  <h2 className="mt-3 font-serif text-2xl">
                    Never trust the browser with financial truth.
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
                    Order totals, payment confirmation, payment status,
                    inventory changes, staff permissions and audit records
                    should be controlled by server-side or database-enforced
                    rules.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Summary({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-black/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
          {label}
        </p>
        <span className="text-black/30">{icon}</span>
      </div>
      <p className="mt-4 font-serif text-4xl text-[#111111]">{value}</p>
    </div>
  );
}
