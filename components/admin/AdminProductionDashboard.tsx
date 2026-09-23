"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Factory, PackageCheck, Timer } from "lucide-react";
import { getProductionOperations, type ProductionRun } from "@/lib/supabase/phase6Operations";

export default function AdminProductionDashboard() {
  const [runs, setRuns] = useState<ProductionRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductionOperations()
      .then((result) => setRuns(result.runs))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(
    () => ({
      queued: runs.filter((x) => x.status === "queued").length,
      active: runs.filter((x) => x.status === "in_progress").length,
      qc: runs.filter((x) => x.status === "quality_check").length,
      ready: runs.filter((x) => x.status === "ready").length,
      completed: runs.filter((x) => x.status === "completed").length,
    }),
    [runs],
  );

  if (loading) {
    return <div className="p-8 text-sm text-black/50">Loading production dashboard…</div>;
  }

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between border-b border-black/10 pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
            Production
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[#111111]">
            Today's operational picture
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-px border border-black/10 bg-black/10 md:grid-cols-5">
        <Mini label="Queued" value={metrics.queued} icon={<Timer size={16} />} />
        <Mini label="In production" value={metrics.active} icon={<Factory size={16} />} />
        <Mini label="Quality check" value={metrics.qc} icon={<AlertTriangle size={16} />} />
        <Mini label="Ready" value={metrics.ready} icon={<PackageCheck size={16} />} />
        <Mini label="Completed" value={metrics.completed} icon={<CheckCircle2 size={16} />} />
      </div>
    </section>
  );
}

function Mini({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center justify-between text-black/30">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
        {icon}
      </div>
      <p className="mt-3 font-serif text-3xl">{value}</p>
    </div>
  );
}
