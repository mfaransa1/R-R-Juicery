"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Save, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoyalty() {
  const [rate, setRate] = useState("1");
  const [minimum, setMinimum] = useState("0");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase.from("loyalty_settings").select("*").eq("id", true).maybeSingle();
    if (error) { setError(error.message); return; }
    if (data) { setRate(String(data.moves_per_100_kes)); setMinimum(String(data.minimum_order_kes)); }
  }

  useEffect(() => { void load(); }, []);

  async function save() {
    try {
      setSaving(true); setError(""); setNotice("");
      const supabase = createClient();
      const { error: e } = await supabase.from("loyalty_settings").upsert({
        id: true,
        moves_per_100_kes: Number(rate),
        minimum_order_kes: Number(minimum),
        updated_at: new Date().toISOString(),
      });
      if (e) throw e;
      setNotice("Loyalty settings saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save loyalty settings.");
    } finally { setSaving(false); }
  }

  return <div className="space-y-8">
    <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">Customer Experience</p><h1 className="font-serif text-4xl tracking-[-0.03em] md:text-5xl">R&R Moves.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">Configure the earning rate without hardcoding loyalty economics into the customer interface.</p></div>
      <button onClick={()=>void load()} className="inline-flex items-center justify-center gap-2 border border-black/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"><RefreshCw size={15}/>Refresh</button>
    </div>

    {notice&&<div className="border border-black/10 bg-white px-4 py-3 text-sm">{notice}</div>}
    {error&&<div className="border border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>}

    <section className="border border-black/10 bg-white">
      <div className="border-b border-black/10 p-7 md:p-9"><div className="flex items-center gap-3"><Sparkles size={19} className="text-black/35"/><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">EARNING RULE</p><h2 className="mt-1 font-serif text-2xl">How customers earn Moves</h2></div></div></div>
      <div className="grid gap-px bg-black/10 md:grid-cols-2">
        <label className="bg-white p-7"><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">MOVES PER KSH 100</span><input value={rate} onChange={e=>setRate(e.target.value)} type="number" min="0" step="0.1" className="mt-4 w-full border border-black/15 bg-[#faf8f3] px-4 py-3 text-2xl outline-none focus:border-black"/></label>
        <label className="bg-white p-7"><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">MINIMUM ORDER (KSH)</span><input value={minimum} onChange={e=>setMinimum(e.target.value)} type="number" min="0" step="50" className="mt-4 w-full border border-black/15 bg-[#faf8f3] px-4 py-3 text-2xl outline-none focus:border-black"/></label>
      </div>
      <div className="flex justify-end border-t border-black/10 p-6"><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"><Save size={15}/>{saving?"Saving…":"Save settings"}</button></div>
    </section>
  </div>;
}
