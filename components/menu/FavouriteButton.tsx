"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  addFavourite,
  getMyFavourites,
  removeFavourite,
} from "@/lib/supabase/account";

export default function FavouriteButton({
  productId,
}: {
  productId: string;
}) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const favourites = await getMyFavourites();
        setSaved(favourites.some((item) => item.product_id === productId));
      } catch {
        // Anonymous visitors simply see an unsaved button.
      }
    }

    load();
  }, [productId]);

  async function toggle() {
    setBusy(true);
    setNeedsAuth(false);

    try {
      if (saved) {
        await removeFavourite(productId);
        setSaved(false);
      } else {
        await addFavourite(productId);
        setSaved(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save favourite.";

      if (message.toLowerCase().includes("sign in")) {
        setNeedsAuth(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        aria-label={saved ? "Remove favourite" : "Save favourite"}
        aria-pressed={saved}
        disabled={busy}
        onClick={toggle}
        className={`inline-flex h-11 w-11 items-center justify-center border border-black/15 transition ${
          saved ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
        } disabled:opacity-50`}
      >
        <Heart
          size={17}
          strokeWidth={1.7}
          fill={saved ? "currentColor" : "none"}
        />
      </button>

      {needsAuth && (
        <a
          href="/auth"
          className="text-[9px] font-bold uppercase tracking-[0.12em] underline underline-offset-4"
        >
          Sign in to save
        </a>
      )}
    </div>
  );
}
