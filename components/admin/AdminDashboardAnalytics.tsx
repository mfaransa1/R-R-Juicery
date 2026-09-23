"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  ShoppingBag,
  UsersRound,
} from "lucide-react";
import {
  AnalyticsOrder,
  AnalyticsOrderItem,
  AnalyticsProduct,
  getControlRoomAnalytics,
} from "@/lib/supabase/adminAnalytics";

const money = (value: number) =>
  `KSh ${Math.round(value).toLocaleString("en-KE")}`;

const label = (value: string) => value.replaceAll("_", " ");

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfPreviousDay(date = new Date()) {
  const value = startOfDay(date);
  value.setDate(value.getDate() - 1);
  return value;
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function Metric({
  label: title,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: ReactNode;
}) {
  return (
    <div className="border border-black/10 bg-white p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
        {title}
      </p>
      <p className="mt-3 font-serif text-3xl tracking-[-0.03em]">{value}</p>
      {note && <p className="mt-2 text-xs text-black/40">{note}</p>}
    </div>
  );
}

function Change({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        positive ? "text-emerald-800" : "text-red-800"
      }`}
    >
      {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
      {Math.abs(value).toFixed(0)}%
    </span>
  );
}

export default function AdminDashboardAnalytics() {
  const [orders, setOrders] = useState<AnalyticsOrder[]>([]);
  const [items, setItems] = useState<AnalyticsOrderItem[]>([]);
  const [products, setProducts] = useState<AnalyticsProduct[]>([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await getControlRoomAnalytics();
      setOrders(data.orders);
      setItems(data.items);
      setProducts(data.products);
      setCustomersCount(data.customers.length);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Control Room analytics.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const analytics = useMemo(() => {
    const today = startOfDay();
    const yesterday = startOfPreviousDay();

    const todayOrders = orders.filter(
      (order) => new Date(order.created_at) >= today,
    );

    const yesterdayOrders = orders.filter((order) => {
      const created = new Date(order.created_at);
      return created >= yesterday && created < today;
    });

    const revenue = (list: AnalyticsOrder[]) =>
      list.reduce((sum, order) => sum + Number(order.total || 0), 0);

    const paidRevenue = todayOrders
      .filter((order) => order.payment_status === "paid")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    const preparing = orders.filter((order) =>
      ["confirmed", "preparing", "pressing"].includes(order.status),
    ).length;

    const ready = orders.filter((order) => order.status === "ready").length;

    const pending = orders.filter((order) => order.status === "pending").length;

    const completed = orders.filter(
      (order) => order.status === "completed",
    ).length;

    const productMap = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();

    items.forEach((item) => {
      const product = products.find((entry) => entry.id === item.product_id);
      if (!product) return;

      const existing = productMap.get(product.id) ?? {
        name: product.name,
        quantity: 0,
        revenue: 0,
      };

      existing.quantity += Number(item.quantity || 0);
      existing.revenue += Number(item.line_total || 0);
      productMap.set(product.id, existing);
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const last7 = Array.from({ length: 7 }, (_, index) => {
      const day = startOfDay();
      day.setDate(day.getDate() - (6 - index));

      const next = new Date(day);
      next.setDate(next.getDate() + 1);

      const dayOrders = orders.filter((order) => {
        const created = new Date(order.created_at);
        return created >= day && created < next;
      });

      return {
        label: day.toLocaleDateString("en-KE", { weekday: "short" }),
        revenue: revenue(dayOrders),
        orders: dayOrders.length,
      };
    });

    const maxRevenue = Math.max(...last7.map((day) => day.revenue), 1);

    return {
      todayRevenue: revenue(todayOrders),
      todayPaidRevenue: paidRevenue,
      todayOrders: todayOrders.length,
      yesterdayRevenue: revenue(yesterdayOrders),
      yesterdayOrders: yesterdayOrders.length,
      revenueChange: percentChange(
        revenue(todayOrders),
        revenue(yesterdayOrders),
      ),
      orderChange: percentChange(
        todayOrders.length,
        yesterdayOrders.length,
      ),
      preparing,
      ready,
      pending,
      completed,
      topProducts,
      last7,
      maxRevenue,
    };
  }, [orders, items, products]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw size={22} className="animate-spin" />
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
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Control Room · Intelligence
          </p>
          <h1 className="font-serif text-4xl tracking-[-0.03em] md:text-5xl">
            Today at R&R.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Live operational signals from orders, customers and products.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center justify-center gap-2 border border-black/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Today's revenue"
          value={money(analytics.todayRevenue)}
          note={
            <span className="inline-flex items-center gap-2">
              <Change value={analytics.revenueChange} /> vs yesterday
            </span>
          }
        />
        <Metric
          label="Today's orders"
          value={String(analytics.todayOrders)}
          note={
            <span className="inline-flex items-center gap-2">
              <Change value={analytics.orderChange} /> vs yesterday
            </span>
          }
        />
        <Metric
          label="Customers"
          value={customersCount.toLocaleString("en-KE")}
          note="Customer accounts"
        />
        <Metric
          label="Paid today"
          value={money(analytics.todayPaidRevenue)}
          note="Recorded paid orders"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-black/10 bg-[#f5f1e8] p-5">
          <Clock3 size={17} />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Pending
          </p>
          <p className="mt-2 font-serif text-3xl">{analytics.pending}</p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <Package size={17} />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Preparing
          </p>
          <p className="mt-2 font-serif text-3xl">{analytics.preparing}</p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <CheckCircle2 size={17} />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Ready
          </p>
          <p className="mt-2 font-serif text-3xl">{analytics.ready}</p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <ShoppingBag size={17} />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Completed
          </p>
          <p className="mt-2 font-serif text-3xl">{analytics.completed}</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="border border-black/10 bg-white p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                Revenue
              </p>
              <h2 className="mt-2 font-serif text-3xl">Last 7 days.</h2>
            </div>
            <BarChart3 size={19} strokeWidth={1.3} />
          </div>

          <div className="mt-8 flex h-64 items-end gap-3 border-b border-black/10">
            {analytics.last7.map((day) => (
              <div
                key={day.label}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div className="relative flex-1">
                  <div
                    className="absolute bottom-0 left-1/2 w-full max-w-10 -translate-x-1/2 bg-[#111]"
                    style={{
                      height: `${Math.max(
                        (day.revenue / analytics.maxRevenue) * 88,
                        day.revenue ? 5 : 0,
                      )}%`,
                    }}
                    title={money(day.revenue)}
                  />
                </div>
                <div className="pb-3 pt-3 text-center">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                    {day.label}
                  </p>
                  <p className="mt-1 text-[9px] text-black/35">
                    {day.orders} orders
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-black/10 bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Product performance
          </p>
          <h2 className="mt-2 font-serif text-3xl">Top moves.</h2>

          <div className="mt-6 divide-y divide-black/10">
            {analytics.topProducts.length === 0 ? (
              <p className="py-8 text-sm text-black/45">
                No product sales recorded yet.
              </p>
            ) : (
              analytics.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-black/30">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="mt-1 text-xs text-black/40">
                        {product.quantity} units
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-xs">
                    {money(product.revenue)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
