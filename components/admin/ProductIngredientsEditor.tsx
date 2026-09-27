"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import type { AdminIngredient } from "@/lib/supabase/ingredients";

export type EditableProductIngredient = {
  ingredient_id: string;
  quantity: string;
  unit: string;
};

type Props = {
  ingredients: AdminIngredient[];
  rows: EditableProductIngredient[];
  onChange: (rows: EditableProductIngredient[]) => void;
};

const units = ["g", "kg", "ml", "L", "piece", "pieces", "tbsp", "tsp", "unit"];

export default function ProductIngredientsEditor({ ingredients, rows, onChange }: Props) {
  const used = useMemo(() => new Set(rows.map((row) => row.ingredient_id)), [rows]);

  function addRow() {
    const next = ingredients.find((ingredient) => !used.has(ingredient.id));
    if (!next) return;

    onChange([...rows, { ingredient_id: next.id, quantity: "", unit: "g" }]);
  }

  function updateRow(index: number, patch: Partial<EditableProductIngredient>) {
    onChange(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, rowIndex) => rowIndex !== index));
  }

  return (
    <section className="border-y border-black/10 py-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Recipe connection
          </p>
          <h3 className="mt-2 font-serif text-3xl">Ingredients</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
            Choose ingredients from the R&R library and record the tested quantity and measurement used for this product.
          </p>
        </div>

        <button
          type="button"
          onClick={addRow}
          disabled={ingredients.length === rows.length}
          className="inline-flex items-center justify-center gap-2 border border-black bg-white px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={14} />
          Add ingredient
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 border border-dashed border-black/20 bg-white p-7 text-sm text-black/50">
          No ingredients selected yet. Add at least one ingredient before an active product can be published.
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {rows.map((row, index) => {
            const selected = ingredients.find((ingredient) => ingredient.id === row.ingredient_id);

            return (
              <div key={`${row.ingredient_id}-${index}`} className="grid gap-3 border border-black/10 bg-white p-3 sm:grid-cols-[24px_1fr_130px_120px_40px] sm:items-end">
                <div className="hidden h-11 items-center justify-center text-black/20 sm:flex">
                  <GripVertical size={15} />
                </div>

                <label className="block">
                  <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">Ingredient</span>
                  <select
                    value={row.ingredient_id}
                    onChange={(event) => updateRow(index, { ingredient_id: event.target.value })}
                    className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black"
                  >
                    <option value="">Select ingredient</option>
                    {ingredients.map((ingredient) => (
                      <option
                        key={ingredient.id}
                        value={ingredient.id}
                        disabled={used.has(ingredient.id) && ingredient.id !== row.ingredient_id}
                      >
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                  {selected && (
                    <span className="mt-1 block text-[9px] uppercase tracking-[0.1em] text-black/35">
                      {selected.organic_status.replaceAll("_", " ")}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">Quantity</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.quantity}
                    onChange={(event) => updateRow(index, { quantity: event.target.value })}
                    placeholder="e.g. 150"
                    className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">Unit</span>
                  <select
                    value={row.unit}
                    onChange={(event) => updateRow(index, { unit: event.target.value })}
                    className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black"
                  >
                    {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  aria-label={`Remove ${selected?.name ?? "ingredient"}`}
                  className="flex h-11 items-center justify-center border border-black/10 text-black/35 transition hover:border-red-900/20 hover:bg-red-50 hover:text-red-900"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
