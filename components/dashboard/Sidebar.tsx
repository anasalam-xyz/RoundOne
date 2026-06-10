// components/dashboard/Sidebar.tsx
// Mini icon sidebar 
// "use client" is required because usePathname() is a client-side hook

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      // Grid/overview icon
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"
           strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: (
      // Clock/history icon
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"
           strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 8v4l3 3" />
        <path d="M3.05 11a9 9 0 1 0 .5-3" />
        <path d="M3 4v4h4" />
      </svg>
    ),
  },
  {
    href: "/interview/setup",
    label: "New",
    icon: (
      // Plus circle icon
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"
           strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      // Gear icon
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"
           strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Sidebar({ initials }: { initials: string }) {
  const pathname = usePathname();

  return (
    <aside className="px-8 md:px-0 w-full md:w-[72px] md:h-screen bg-white border-r border-[#ede8fb]
                      flex flex-row md:flex-col items-center py-5 flex-shrink-0">

      {/* Logo mark */}
      <Link href="/dashboard" className="hidden md:block mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary-medium flex items-center justify-center
                        hover:shadow-sm shadow-primary-medium transition-shadow duration-400">
          <Image src="/round-one_logo.png" 
            width={0} 
            height={0} 
            className="w-9 h-9 rounded-xl"
            alt="rount-one_logo"
          />
        </div>
      </Link>

      {/* Nav links */}
      <nav className="flex flex-row md:flex-col items-center gap-1 flex-1 w-full px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 w-full py-2.5 rounded-xl
                          text-[9px] font-medium transition-all duration-200
                          ${isActive
                            ? "bg-primary-light text-primary-medium"
                            : "text-[#9090b0] hover:bg-[#f7f5ff] hover:text-primary-medium"
                          }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block w-9 h-9 rounded-full bg-tertiary-light border-2 border-tertiary-medium
                      flex items-center justify-center cursor-pointer
                      hover:border-primary-medium transition-colors duration-200">
        <span className="text-[9px] font-bold text-tertiary-dark">{initials}</span>
      </div>

    </aside>
  );
}
