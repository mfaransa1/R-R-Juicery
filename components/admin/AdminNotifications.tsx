"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Loader2, RefreshCw } from "lucide-react";
import {
  AdminNotification,
  getAdminNotifications,
  markNotificationRead,
} from "@/lib/supabase/businessInfrastructure";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setNotifications(await getAdminNotifications());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function read(id: string) {
    try {
      await markNotificationRead(id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, read_at: new Date().toISOString() }
            : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update notification.");
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Infrastructure · Operations
          </p>
          <h1 className="mt-2 font-serif text-4xl">Notifications.</h1>
          <p className="mt-2 text-sm text-black/50">
            Operational messages and alerts for the Control Room.
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
      ) : notifications.length === 0 ? (
        <div className="border border-black/10 bg-white p-10 text-sm text-black/50">
          <Bell size={20} className="mb-4" />
          No operational notifications yet.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={`border border-black/10 bg-white p-5 ${
                item.read_at ? "opacity-55" : ""
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">
                      {item.type}
                    </span>
                    {!item.read_at && (
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    )}
                  </div>
                  <h2 className="mt-2 font-serif text-xl">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-black/60">{item.message}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.1em] text-black/35">
                    {new Date(item.created_at).toLocaleString("en-KE")}
                  </p>
                </div>

                {!item.read_at && (
                  <button
                    type="button"
                    onClick={() => void read(item.id)}
                    className="inline-flex items-center gap-2 self-start border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em]"
                  >
                    <Check size={13} /> Mark read
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
