"use client";

import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { uploadContentImage } from "@/lib/supabase/content";

type Props = { bucket: "event-images" | "journal-images"; value: string; prefix: string; onChange: (url: string) => void };

export default function ContentImageUpload({ bucket, value, prefix, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function choose(file?: File) {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 8 * 1024 * 1024) { setError("Image must be 8 MB or smaller."); return; }
    setBusy(true);
    try { onChange(await uploadContentImage(bucket, file, prefix)); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to upload image."); }
    finally { setBusy(false); }
  }

  return <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">Cover image</p>
      {value && <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/50 hover:text-black"><X size={12}/> Remove</button>}
    </div>
    {value ? <div className="relative aspect-[16/9] overflow-hidden border border-black/10 bg-[#e7e2d8]"><Image src={value} alt="Content cover" fill sizes="(max-width: 768px) 100vw, 700px" className="object-cover" /></div> : <div className="flex aspect-[16/9] items-center justify-center border border-dashed border-black/15 bg-[#f5f1e8] text-center"><div><Upload className="mx-auto h-5 w-5 text-black/35"/><p className="mt-3 text-xs text-black/45">Upload a cover image</p></div></div>}
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(e) => void choose(e.target.files?.[0])}/>
    <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-black disabled:opacity-50">{busy ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14}/>} {busy ? "Uploading..." : value ? "Replace image" : "Upload image"}</button>
    {error && <p className="text-xs text-red-900">{error}</p>}
  </div>;
}
