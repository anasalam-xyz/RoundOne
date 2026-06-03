// components/dashboard/Topbar.tsx
// Thin top bar — page title left, new interview button + user pill right
// "use client" needed for usePathname()

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Maps each dashboard route to a readable title shown in the topbar
const PAGE_TITLES: Record<string, string> = {
  "/dashboard":          "Overview",
  "/dashboard/history":  "Session History",
  "/dashboard/settings": "Settings",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="h-14 bg-white border-b border-[#ede8fb] px-8
                       flex items-center justify-between flex-shrink-0">

      {/* Page title */}
      <h1 className="font-display text-lg font-semibold text-[#1a1a2e]">
        {title}
      </h1>

      <div className="flex items-center gap-3">

        {/* CTA — always visible, links to setup flow */}
        <Link
          href="/interview/setup"
          className="bg-primary-medium hover:bg-primary-dark text-white text-xs font-semibold
                     px-4 py-2 rounded-lg transition-all duration-200
                     hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25"
        >
          + New Interview
        </Link>

        {/* User pill — replace hardcoded name with session.user.name from NextAuth */}
        <div className="flex items-center gap-2 bg-[#f7f5ff] border border-[#ede8fb]
                        rounded-xl px-3 py-1.5 cursor-pointer
                        hover:border-primary-medium transition-colors duration-200">
          <div className="w-6 h-6 rounded-full bg-tertiary-light border border-tertiary-medium
                          flex items-center justify-center">
            <span className="text-[8px] font-bold text-tertiary-dark">AN</span>
          </div>
          <span className="text-xs font-medium text-[#1a1a2e]">Anas</span>
        </div>

      </div>
    </header>
  );
}
