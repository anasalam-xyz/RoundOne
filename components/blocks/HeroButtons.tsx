"use client";

import { MoveRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroButtons() {
  return(
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-fit">
      <Link href="/auth?mode=signup" className="inline-flex items-center group bg-primary-medium hover:bg-primary-dark text-white px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-medium/25">
        Start practicing free 
        <MoveRight size="16" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"/>
      </Link>
      <Link href="/about/#process" className="ml-4 md:ml-0 group inline-flex items-center hover:underline text-primary-medium text-sm font-medium flex items-center gap-1.5 group transition-all duration-200">
        See how it works
        <ArrowRight size="16" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"/>
      </Link>
    </div>
  );
}
