"use client" //for ruoter

import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

function BackToDashboard() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.refresh();
        router.push("/dashboard");
      }}
      className="flex items-center justify-center gap-2 bg-white text-primary-medium
                 border border-[#ede8fb] hover:border-primary-medium
                 text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200"
    >
      <LayoutDashboard size={15} />
      Back to dashboard
    </button>
  );
}
