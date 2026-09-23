"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  AuditLog,
  getAuditLogs,
} from "@/lib/supabase/businessInfrastructure";

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setLogs(await getAuditLogs());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load audit log.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Infrastructure · Governance
          </p>
          <h1 className="mt-2 font-serif text-4xl">Audit log.</h1>
          <p className="mt-2 text-sm text-black/50">
            Review recorded administrative actions and operational changes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      {error && <div className="border border-red-900/20 bg-red-50 p-4 text-sm text-red-900">{error}</div>}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="border border-black/10 bg-white p-10 text-sm text-black/50">
          No audit events have been recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
              <tr>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Action</th>
                <th className="px-5 py-4">Entity</th>
                <th className="px-5 py-4">Actor</th>
                <th className="px-5 py-4">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5 text-xs text-black/50">
                    {new Date(log.created_at).toLocaleString("en-KE")}
                  </td>
                  <td className="px-5 py-5 text-sm font-semibold">{log.action}</td>
                  <td className="px-5 py-5 text-sm">
                    {log.entity_type}
                    {log.entity_id ? (
                      <span className="ml-2 font-mono text-[10px] text-black/35">
                        {log.entity_id}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-5 font-mono text-[10px] text-black/45">
                    {log.actor_id || "System"}
                  </td>
                  <td className="max-w-[350px] px-5 py-5 font-mono text-[10px] text-black/45">
                    {log.metadata ? JSON.stringify(log.metadata) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
