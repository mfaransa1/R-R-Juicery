"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Boxes,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  Leaf,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/admin",
    icon: BarChart3,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Ingredients",
    href: "/admin/ingredients",
    icon: Leaf,
  },
  {
    label: "Sourcing",
    href: "/admin/sourcing",
    icon: Boxes,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Journal",
    href: "/admin/journal",
    icon: FileText,
  },
  {
  label: "Settings",
  href: "/admin/settings",
  icon: Settings,
},
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#111]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-black/10 bg-[#111] text-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-7 py-7">
            <Link href="/admin" className="block">
              <p className="font-serif text-3xl tracking-[-0.04em]">
                R&R
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/35">
                Operations
              </p>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <p className="px-3 pb-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
              Workspace
            </p>

            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 px-3 py-3 text-xs font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.35}
                      className="text-white/30 transition group-hover:text-white/60"
                    />

                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-3 text-xs text-white/40 transition hover:text-white"
            >
              <Store size={17} strokeWidth={1.35} />
              View website
            </Link>

            <Link
              href="/account"
              className="mt-1 flex items-center gap-3 px-3 py-3 text-xs text-white/40 transition hover:text-white"
            >
              <Settings size={17} strokeWidth={1.35} />
              Account
            </Link>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#111] text-white lg:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
            <div>
              <p className="font-serif text-3xl">R&R</p>

              <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/30">
                Operations
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center border border-white/10"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.3} />
            </button>
          </div>

          <nav className="px-5 py-8">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 border-b border-white/10 py-5 text-sm"
                >
                  <Icon size={18} strokeWidth={1.3} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-black/10 bg-[#f5f1e8]/95 px-5 backdrop-blur sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center border border-black/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={19} strokeWidth={1.4} />
          </button>

          <div className="hidden lg:block">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
              R&R / OPERATIONS
            </p>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-black/35 sm:block">
              Demo workspace
            </span>

            <button
              type="button"
              className="flex items-center gap-2 text-xs"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-black text-[10px] font-semibold text-white">
                RR
              </span>

              <ChevronDown
                size={14}
                strokeWidth={1.4}
                className="text-black/40"
              />
            </button>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}