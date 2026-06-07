// app/dashboard/layout.tsx
// Shell for all /dashboard/* pages — sidebar + topbar + scrollable content area
// Navbar and Footer from the landing page are NOT used here

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const name     = profile?.name ?? user.email ?? "";
  const initials = name
    .split(/[\s@]/)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    // h-screen + overflow-hidden = the page never scrolls as a whole
    // only the <main> content area scrolls independently
    <div className="flex flex-col-reverse md:flex-row h-screen bg-[#f7f5ff] font-body overflow-hidden">
      <Sidebar initials={initials} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar initials={initials} name={name.split(" ")[0] || "You"}/>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
