// Shows for any unmatched route or when notFound() is called from a page

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body flex flex-col items-center
                    justify-center px-6 text-center gap-6">

      <Image src="/undraw_page-not-found_6wni.svg" 
        width={0} 
        height={0} 
        alt="not-found" 
        className="h-32 w-auto" 
      />
      
      <div>
        <p className="text-xs font-semibold text-primary-medium uppercase tracking-widest mb-2">
          404
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1a1a2e] mb-3">
          Page not found
        </h1>
        <p className="text-sm text-[#9090b0] leading-relaxed max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="bg-primary-medium hover:bg-primary-dark text-white text-sm font-semibold
                     px-6 py-2.5 rounded-xl transition-all duration-200
                     hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25"
        >
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-primary-medium bg-primary-light
                     px-6 py-2.5 rounded-xl hover:bg-primary-medium hover:text-white
                     transition-all duration-200"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
