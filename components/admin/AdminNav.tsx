"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Boxes,
  BookOpenText,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  Droplets,
  Factory,
  History,
  Home,
  Leaf,
  LogOut,
  Menu,
  PackageCheck,
  QrCode,
  Route,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
  UsersRound,
  Wheat,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const baseItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: ChartNoAxesCombined,
  },

  // Products & ingredients
  {
    label: "Products",
    href: "/admin/products",
    icon: Droplets,
  },
  {
    label: "Ingredients",
    href: "/admin/ingredients",
    icon: Leaf,
  },

  // Operations
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    label: "Suppliers",
    href: "/admin/suppliers",
    icon: Factory,
  },
  {
    label: "Sourcing",
    href: "/admin/sourcing",
    icon: Wheat,
  },
  {
    label: "Batches",
    href: "/admin/batches",
    icon: PackageCheck,
  },
  {
    label: "Production",
    href: "/admin/production",
    icon: Factory,
  },
  {
    label: "Traceability",
    href: "/admin/batches/traceability",
    icon: QrCode,
  },
  {
    label: "Delivery",
    href: "/admin/delivery-zones",
    icon: Truck,
  },

  // Customers
  {
    label: "Customers",
    href: "/admin/customers",
    icon: UserRound,
  },
  {
    label: "Loyalty",
    href: "/admin/loyalty",
    icon: Sparkles,
  },

  // Content
  {
    label: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Journal",
    href: "/admin/journal",
    icon: BookOpenText,
  },

  // Infrastructure
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Audit Log",
    href: "/admin/audit",
    icon: History,
  },
  {
    label: "Security",
    href: "/admin/security",
    icon: ShieldCheck,
  },
];

export default function AdminNav({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: "staff" | "admin";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  const items =
    role === "admin"
      ? [
          ...baseItems,
          {
            label: "Team",
            href: "/admin/team",
            icon: UsersRound,
          },
        ]
      : baseItems;

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const navigation = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="border-b border-black/10 px-6 py-7">
        <Link href="/" className="block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/40">
            THE ROOK & REED
          </p>

          <p className="mt-2 font-serif text-2xl leading-none text-[#111111]">
            Control Room
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">
          Manage
        </p>

        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-sm px-3 py-3 text-sm transition-colors ${
                  active
                    ? "bg-[#111111] !text-white"
                    : "text-black/60 hover:bg-black/[0.04] hover:text-black"
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={1.35}
                  className={active ? "text-white" : "text-current"}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Area */}
      <div className="border-t border-black/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm px-3 py-3 text-sm text-black/55 transition-colors hover:bg-black/[0.04] hover:text-black"
        >
          <Home size={16} strokeWidth={1.35} />
          <span>View website</span>
        </Link>

        <div className="mt-2 border-t border-black/10 pt-3">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-[#111111]">
              {name}
            </p>

            <p className="mt-1 truncate text-xs text-black/40">
              {email}
            </p>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
              {role}
            </p>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="mt-2 flex w-full items-center gap-3 rounded-sm px-3 py-3 text-sm text-black/55 transition-colors hover:bg-black/[0.04] hover:text-black"
          >
            <LogOut size={16} strokeWidth={1.35} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-black/10 bg-[#f5f1e8] lg:block">
        {navigation}
      </aside>

      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-black/10 bg-[#f5f1e8] px-5 lg:hidden">
        <Link
          href="/admin"
          className="font-serif text-xl text-[#111111]"
        >
          R&R{" "}
          <span className="text-black/35">
            Control Room
          </span>
        </Link>

        <button
          type="button"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-sm p-2 text-[#111111] transition-colors hover:bg-black/[0.04]"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[#f5f1e8] pt-16 lg:hidden">
          {navigation}
        </div>
      )}
    </>
  );
}
