import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata = {
  title:       "Sign in",
  description: "Log in or create a free RoundOne account to start practicing.",
};

export default function AuthPage() {

  return (
    <div className="min-h-screen bg-white font-body flex flex-col md:grid md:grid-cols-2">

      <div className="flex flex-col justify-center px-8 py-8 md:px-14 lg:px-20">
        <div className="flex flex-row justify-between items-center mb-8">
          <Link href="/" className="text-lg font-bold flex w-fit">
            <span className="text-secondary-medium">Round</span>
            <span className="text-tertiary-medium">One</span>
          </Link>
          <Link href="/" className="text-gray-600 group inline-flex gap-2 items-center">
              <ChevronLeft size="16" className="group-hover:-translate-x-1 transition-translate duration-200"/>
              <p className="text-sm">Back to Home</p>
          </Link>
        </div>

        <h1 className="font-display text-3xl font-semibold text-[#1a1a2e] leading-tight mb-2">
          Practice makes<br />perfect.
        </h1>
        <p className="text-sm text-[#9090b0] leading-relaxed mb-8 max-w-xs">
          AI-powered mock interviews. Real feedback. Free forever.
        </p>
        <Suspense fallback={
          <div className="w-full max-w-sm space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-11 bg-[#f7f5ff] rounded-xl animate-pulse" />
            ))}
          </div>
        }>
          <AuthForm />
        </Suspense>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center bg-[#f7f5ff] px-20 gap-7">
        <Image src="undraw_playful-cat_3ta5.svg" 
          height={0} 
          width={0} 
          alt="auth_page_illustration"
          className="w-fit h-auto"
        />

        <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#ede8fb]
                        px-4 py-3 shadow-lg shadow-primary-medium/8 w-fit">
          <div>
            <p className="text-xs font-semibold text-[#1a1a2e]"></p>
            <p className="text-[10px] text-[#9090b0]">Your Credentials are safe with us.</p>
          </div>
        </div>
 
        <div className="text-center">
          <h3 className="font-display text-xl font-semibold text-[#1a1a2e] mb-2 leading-snug">
            Make interview prep<br />easy and effective
          </h3>
          <p className="text-xs text-[#9090b0] leading-relaxed max-w-xs">
            AI-powered feedback after every session
          </p>
        </div>
 
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ede8fb]" />
          <span className="w-5 h-1.5 rounded-full bg-primary-medium" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#ede8fb]" />
        </div>
      </div>
    </div>
  );
}
