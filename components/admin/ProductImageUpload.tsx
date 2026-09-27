"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "product-images";

type Props = {
  slug: string;
  value?: string | null;
  onChange: (value: string | null) => void;
};

export default function ProductImageUpload({
  slug,
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be 8 MB or smaller.");
      return;
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeSlug =
      slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "product";

    const path = `${safeSlug}-${Date.now()}.${extension}`;

    setUploading(true);

    try {
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

      if (!data.publicUrl) {
        throw new Error("Supabase did not return a public image URL.");
      }

      onChange(data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload the product image.",
      );
    } finally {
      setUploading(false);
    }
  }

  function clearImage() {
    onChange(null);
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden border border-black/10 bg-white">
        <div className="relative aspect-[4/3] bg-[#e7e2d8]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-black/35">
              <ImagePlus size={22} strokeWidth={1.3} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                No image selected
              </span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] !text-white">
                <Loader2 size={15} className="animate-spin" />
                Uploading
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-black/10 p-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-black px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-white disabled:opacity-50"
          >
            {value ? <Check size={13} /> : <ImagePlus size={13} />}
            {value ? "Replace image" : "Upload image"}
          </button>

          {value && (
            <button
              type="button"
              disabled={uploading}
              onClick={clearImage}
              className="inline-flex items-center gap-2 border border-black/15 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] disabled:opacity-50"
            >
              <Trash2 size={13} />
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(event) => void handleChange(event)}
        className="hidden"
      />

      <p className="text-[11px] leading-5 text-black/45">
        JPG, PNG, WebP or AVIF · maximum 8 MB. The image is stored in
        Supabase Storage and its public URL is saved with the product.
      </p>

      {error && (
        <p className="border border-red-900/15 bg-red-50 p-3 text-xs leading-5 text-red-900">
          {error}
        </p>
      )}
    </div>
  );
}
