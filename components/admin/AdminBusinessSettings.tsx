"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw, Save } from "lucide-react";
import {
  BusinessSetting,
  getBusinessSettings,
  saveBusinessSetting,
} from "@/lib/supabase/businessInfrastructure";

const defaults = [
  ["business_name", "The Rook & Reed Juicery"],
  ["tagline", "GOOD JUICE. GOOD MUSIC. GOOD COMPANY."],
  ["location", "Rook & Reed Plaza, Kilimani, Nairobi"],
  ["phone", "0758038852"],
  ["email", "rookreedjuicery@gmail.com"],
  ["social_handle", "@rookandreedjuicery"],
  ["opening_hours", "8:00 AM – 8:00 PM"],
];

export default function AdminBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSetting[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await getBusinessSettings();
      setSettings(data);

      const next: Record<string, string> = {};
      data.forEach((item) => {
        next[item.key] = item.value || "";
      });
      setDrafts(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load business settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(key: string) {
    setSaving(key);
    setError("");

    try {
      const existing = settings.find((item) => item.key === key);
      await saveBusinessSetting({
        id: existing?.id,
        key,
        value: drafts[key] || "",
        description: existing?.description || null || undefined,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save setting.");
    } finally {
      setSaving("");
    }
  }

  async function createDefaults() {
    setSaving("defaults");
    setError("");

    try {
      for (const [key, value] of defaults) {
        if (!settings.some((item) => item.key === key)) {
          await saveBusinessSetting({ key, value });
        }
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create settings.");
    } finally {
      setSaving("");
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Infrastructure · Configuration
          </p>
          <h1 className="mt-2 font-serif text-4xl">Business settings.</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/50">
            Maintain operational business values from one place. Public-facing values
            should be changed here only when they are confirmed by the business.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void createDefaults()}
            className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]"
          >
            <Plus size={14} /> Seed defaults
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="border border-red-900/20 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="grid gap-4 border border-black/10 bg-white p-5 md:grid-cols-[220px_1fr_auto] md:items-center"
            >
              <div>
                <p className="font-mono text-xs">{setting.key}</p>
                {setting.description && (
                  <p className="mt-1 text-xs text-black/40">{setting.description}</p>
                )}
              </div>

              <input
                value={drafts[setting.key] ?? ""}
                onChange={(e) =>
                  setDrafts((current) => ({
                    ...current,
                    [setting.key]: e.target.value,
                  }))
                }
                className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
              />

              <button
                type="button"
                disabled={saving === setting.key}
                onClick={() => void save(setting.key)}
                className="inline-flex items-center justify-center gap-2 border border-black bg-black px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white hover:bg-white hover:!text-black"
              >
                <Save size={14} /> {saving === setting.key ? "Saving" : "Save"}
              </button>
            </div>
          ))}

          {settings.length === 0 && (
            <div className="border border-black/10 bg-white p-10 text-sm text-black/50">
              No settings exist yet. Use “Seed defaults” to create the confirmed R&R
              business values already established for the project.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
