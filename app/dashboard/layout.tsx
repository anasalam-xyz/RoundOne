// app/dashboard/layout.tsx
// Shell for all /dashboard/* pages — sidebar + topbar + scrollable content area
// Navbar and Footer from the landing page are NOT used here

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // h-screen + overflow-hidden = the page never scrolls as a whole
    // only the <main> content area scrolls independently
    <div className="flex flex-col-reverse md:flex-row h-screen bg-[#f7f5ff] font-body overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
