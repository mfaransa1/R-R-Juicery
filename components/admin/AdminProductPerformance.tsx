"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { getControlRoomAnalytics } from "@/lib/supabase/adminAnalytics";

const money = (value: number) =>
  `KSh ${Math.round(value).toLocaleString("en-KE")}`;

export default function AdminProductPerformance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<{
    name: string;
    category: string;
    active: boolean;
    featured: boolean;
    units: number;
    revenue: number;
  }[]>([]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const { products, items } = await getControlRoomAnalytics();

      const map = new Map<string, {
        name: string;
        category: string;
        active: boolean;
        featured: boolean;
        units: number;
        revenue: number;
      }>();

      products.forEach((product) => {
        map.set(product.id, {
          name: product.name,
          category: product.category_label || product.category,
          active: product.active,
          featured: product.featured,
          units: 0,
          revenue: 0,
        });
      });

      items.forEach((item) => {
        const product = map.get(item.product_id);
        if (!product) return;

        product.units += Number(item.quantity || 0);
        product.revenue += Number(item.line_total || 0);
      });

      setData(
        Array.from(map.values()).sort(
          (a, b) => b.revenue - a.revenue,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product performance.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const totalRevenue = useMemo(
    () => data.reduce((sum, product) => sum + product.revenue, 0),
    [data],
  );

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 size={21} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Product intelligence
          </p>
          <h2 className="mt-2 font-serif text-3xl">Product performance.</h2>
          <p className="mt-2 text-sm text-black/45">
            Revenue and unit movement from recorded order items.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 border border-black/15 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em]"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="border border-black/10 bg-white p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
          Recorded product revenue
        </p>
        <p className="mt-2 font-serif text-4xl">{money(totalRevenue)}</p>
      </div>

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Units</th>
              <th className="px-5 py-4">Revenue</th>
              <th className="px-5 py-4">State</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.name} className="border-b border-black/10 last:border-0">
                <td className="px-5 py-5">
                  <p className="font-serif text-lg">{product.name}</p>
                  {product.featured && (
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-black/35">
                      Featured
                    </p>
                  )}
                </td>
                <td className="px-5 py-5 text-xs uppercase tracking-[0.08em] text-black/55">
                  {product.category}
                </td>
                <td className="px-5 py-5 font-mono text-sm">
                  {product.units}
                </td>
                <td className="px-5 py-5 font-mono text-sm">
                  {money(product.revenue)}
                </td>
                <td className="px-5 py-5 text-xs uppercase tracking-[0.08em]">
                  {product.active ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
