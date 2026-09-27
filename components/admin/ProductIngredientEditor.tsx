"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import {
  getIngredientOptions,
  getProductIngredients,
  replaceProductIngredients,
  type IngredientOption,
} from "@/lib/supabase/productIngredients";

type EditorRow = {
  localId: string;
  ingredient_id: string;
  quantity: string;
  unit: string;
};

const units = ["g", "kg", "ml", "L", "piece", "pieces", "tbsp", "tsp", "unit"];

function makeRow(
  ingredientId = "",
  quantity: number | null = null,
  unit = "g",
): EditorRow {
  return {
    localId: `${Date.now()}-${Math.random()}`,
    ingredient_id: ingredientId,
    quantity: quantity === null ? "" : String(quantity),
    unit: unit || "g",
  };
}

export default function ProductIngredientEditor({
  productId,
  productName,
  onClose,
  onSaved,
}: {
  productId: string;
  productName: string;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [ingredients, setIngredients] = useState<IngredientOption[]>([]);
  const [rows, setRows] = useState<EditorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [options, current] = await Promise.all([
          getIngredientOptions(),
          getProductIngredients(productId),
        ]);

        if (!active) return;

        setIngredients(options);
        setRows(
          current.length
            ? current.map((row) =>
                makeRow(row.ingredient_id, row.quantity, row.unit ?? "g"),
              )
            : [makeRow()],
        );
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product ingredients.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [productId]);

  const usedIds = useMemo(
    () => new Set(rows.map((row) => row.ingredient_id).filter(Boolean)),
    [rows],
  );

  function updateRow(
    localId: string,
    key: keyof Omit<EditorRow, "localId">,
    value: string,
  ) {
    setRows((current) =>
      current.map((row) =>
        row.localId === localId ? { ...row, [key]: value } : row,
      ),
    );
  }

  function addRow() {
    setRows((current) => [...current, makeRow()]);
  }

  function removeRow(localId: string) {
    setRows((current) => {
      const next = current.filter((row) => row.localId !== localId);
      return next.length ? next : [makeRow()];
    });
  }

  async function save() {
    setSaving(true);
    setError("");
    setNotice("");

    const selected = rows.filter((row) => row.ingredient_id);

    if (selected.length !== rows.length) {
      setError("Select an ingredient for every row or remove the empty row.");
      setSaving(false);
      return;
    }

    const ids = selected.map((row) => row.ingredient_id);
    if (new Set(ids).size !== ids.length) {
      setError("Each ingredient can only be added once to a product.");
      setSaving(false);
      return;
    }

    try {
      await replaceProductIngredients(
        productId,
        selected.map((row) => ({
          ingredient_id: row.ingredient_id,
          quantity:
            row.quantity.trim() === "" ? null : Number(row.quantity),
          unit: row.unit.trim() || null,
        })),
      );

      setNotice("Product ingredients saved.");
      onSaved?.();

      window.setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save product ingredients.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl bg-[#f5f1e8]">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
              Product composition
            </p>
            <h2 className="mt-1 font-serif text-3xl">{productName}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-black/15 p-2"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 border border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-900">
            {error}
          </div>
        )}

        {notice && (
          <div className="mx-6 mt-6 border border-black/10 bg-white px-4 py-3 text-sm">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-56 items-center justify-center">
            <Loader2 size={22} className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-5 p-6">
            {rows.map((row, index) => {
              const available = ingredients.filter(
                (ingredient) =>
                  ingredient.id === row.ingredient_id ||
                  !usedIds.has(ingredient.id),
              );

              return (
                <div
                  key={row.localId}
                  className="border border-black/10 bg-white p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                      Ingredient {String(index + 1).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeRow(row.localId)}
                      className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/55 hover:text-black"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
                        Ingredient
                      </span>
                      <select
                        value={row.ingredient_id}
                        onChange={(event) =>
                          updateRow(
                            row.localId,
                            "ingredient_id",
                            event.target.value,
                          )
                        }
                        className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black"
                      >
                        <option value="">Select ingredient</option>
                        {available.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
                        Quantity
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.quantity}
                        onChange={(event) =>
                          updateRow(
                            row.localId,
                            "quantity",
                            event.target.value,
                          )
                        }
                        placeholder="e.g. 250"
                        className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
                        Unit
                      </span>
                      <select
                        value={row.unit}
                        onChange={(event) =>
                          updateRow(row.localId, "unit", event.target.value)
                        }
                        className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black"
                      >
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-2 border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]"
            >
              <Plus size={14} />
              Add ingredient
            </button>

            <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Save ingredients
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
