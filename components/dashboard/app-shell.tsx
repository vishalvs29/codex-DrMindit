"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { BrainCircuit, Bell, Menu } from "lucide-react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-aurora-grid text-white">
      <aside className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-ink/80 px-3 py-2 backdrop-blur-2xl lg:bottom-auto lg:right-auto lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-t-0 lg:p-5">
        <div className="mb-8 hidden items-center gap-3 lg:flex">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyanGlow/20 text-cyanGlow">
            <BrainCircuit className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold">DrMindit</p>
            <p className="text-xs text-slate-500">Personal care OS</p>
          </div>
        </div>
        <nav className="grid grid-cols-7 gap-1 lg:block lg:space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] text-slate-500 transition lg:flex-row lg:gap-3 lg:px-4 lg:py-3 lg:text-sm",
                  active && "bg-blue-500/20 text-cyanGlow shadow-glow",
                  !active && "hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-h-screen pb-24 lg:ml-72 lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/60 backdrop-blur-2xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Menu className="h-5 w-5 text-slate-500 lg:hidden" />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyanGlow">Sanctuary</p>
                <h1 className="text-base font-semibold sm:text-lg">Your private mental wellness space</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-slate-300">
                <Bell className="h-5 w-5" />
              </button>
              <UserButton />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
