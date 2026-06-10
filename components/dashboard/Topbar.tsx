"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":          "Overview",
  "/dashboard/history":  "Session History",
  "/dashboard/settings": "Settings",
};

export default function Topbar({ initials, name }: { initials: string; name: string }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const title     = PAGE_TITLES[pathname] ?? "Dashboard";

  const [open, setOpen]   = useState(false);
  const dropdownRef       = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="h-14 bg-white border-b border-[#ede8fb] px-8
                       flex items-center justify-between flex-shrink-0">
      <h1 className="font-display text-lg font-semibold text-[#1a1a2e]">{title}</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/interview/setup"
          className="bg-primary-medium hover:bg-primary-dark text-white text-xs font-semibold
                     px-4 py-2 rounded-lg transition-all duration-200
                     hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25"
        >
          + <span className="hidden md:inline-flex">New Interview</span>
        </Link>

        {/* User pill with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpen((o) => !o)}
            className={`flex items-center gap-2 bg-[#f7f5ff] border rounded-xl px-3 py-1.5
                        cursor-pointer transition-colors duration-200
                        ${open ? "border-primary-medium" : "border-[#ede8fb] hover:border-primary-medium"}`}
          >
            <div className="w-6 h-6 rounded-full bg-tertiary-light border border-tertiary-medium
                            flex items-center justify-center">
              <span className="text-[8px] font-bold text-tertiary-dark">{initials}</span>
            </div>
            <span className="hidden md:block text-xs font-medium text-[#1a1a2e]">{name}</span>
            {/* Chevron */}
            <svg
              width="12" height="12" fill="none" stroke="#9090b0" strokeWidth="2"
              viewBox="0 0 24 24"
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#ede8fb]
                            rounded-2xl shadow-xl shadow-primary-medium/10 overflow-hidden z-50
                            animate-[fadeIn_0.15s_ease]">
              <div className="px-4 py-3 border-b border-[#f0ecfd]">
                <p className="text-xs font-semibold text-[#1a1a2e]">{name}</p>
                <p className="text-[10px] text-[#9090b0] mt-0.5">Free plan</p>
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5a5a7a]
                           hover:bg-[#f7f5ff] hover:text-primary-medium transition-colors duration-150"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Settings
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#DC2626]
                           hover:bg-[#FEF2F2] transition-colors duration-150"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
