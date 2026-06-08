// Catches unhandled runtime errors in any page render
// Must be "use client" , Next.js passes error and reset as props

"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // retries rendering the page that errored
}) {
  // Log to console for debugging , swap for a real logger (Sentry etc.) before production
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body flex flex-col items-center
                    justify-center px-6 text-center gap-6">

      <Image src="/undraw_server-failure_syqp.svg" 
        width={0} 
        height={0} 
        alt="not-found" 
        className="h-32 w-auto" 
      />
      <div className="w-56 h-48 rounded-2xl border-2 border-dashed border-[#f0c8d8]
                      bg-white flex flex-col items-center justify-center gap-3 mb-2">
        <svg width="36" height="36" fill="none" stroke="#f0c8d8" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <span className="text-xs text-[#f0c8d8] italic">undraw illustration here</span>
      </div>

      {/* Copy */}
      <div>
        <p className="text-xs font-semibold text-tertiary-medium uppercase tracking-widest mb-2">
          Something went wrong
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1a1a2e] mb-3">
          Unexpected error
        </h1>
        <p className="text-sm text-[#9090b0] leading-relaxed max-w-xs">
          Something went wrong on our end. You can try again or head back to the dashboard.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="bg-primary-medium hover:bg-primary-dark text-white text-sm font-semibold
                     px-6 py-2.5 rounded-xl transition-all duration-200
                     hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-primary-medium bg-primary-light
                     px-6 py-2.5 rounded-xl hover:bg-primary-medium hover:text-white
                     transition-all duration-200"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
