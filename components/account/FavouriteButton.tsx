"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import {
  addFavourite,
  getMyFavourites,
  removeFavourite,
} from "@/lib/supabase/account";

type FavouriteButtonProps = {
  productId: string;
};

export default function FavouriteButton({
  productId,
}: FavouriteButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadFavourite() {
      try {
        const favourites = await getMyFavourites();

        if (!mounted) return;

        setSaved(
          favourites.some(
            (item) => item.product_id === productId,
          ),
        );
      } catch {
        // Visitors who are not signed in simply see the unsaved state.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadFavourite();

    return () => {
      mounted = false;
    };
  }, [productId]);

  async function toggleFavourite() {
    if (busy) return;

    setBusy(true);

    try {
      if (saved) {
        await removeFavourite(productId);
        setSaved(false);
      } else {
        await addFavourite(productId);
        setSaved(true);
      }
    } catch {
      // Keep the existing state if the request fails.
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggleFavourite()}
      disabled={loading || busy}
      aria-label={
        saved
          ? "Remove from favourites"
          : "Save to favourites"
      }
      aria-pressed={saved}
      className={[
        "inline-flex h-12 w-12 items-center justify-center",
        "border border-black/15 bg-white",
        "transition",
        "hover:border-black hover:bg-black hover:text-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
      ].join(" ")}
    >
      <Bookmark
        size={18}
        strokeWidth={1.5}
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
}