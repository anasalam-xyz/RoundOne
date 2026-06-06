"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/blocks/Navbar";
import Footer from "@/components/blocks/Footer";

const APP_ROUTES = ["/dashboard", "/interview", "/auth", "/results"];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = APP_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <>
      {!isAppRoute && <Navbar />}
      {children}
      {!isAppRoute && <Footer />}
    </>
  );
}
