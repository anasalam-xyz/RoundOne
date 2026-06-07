// components/Navbar.tsx
// Shown on all logged-out pages (landing, auth)
// For logged-in users, the dashboard has its own sidebar — this navbar isn't used there
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "About",        href: "/about" },
    { label: "How it works", href: "/about/#process" },
    { label: "Features",     href: "#features" },
  ];

  return (
    <nav className="bg-white border-b border-[#ede8fb] px-12 h-16 flex items-center justify-between font-body">

      <Link href="." className="text-xl font-bold flex gap-0.5">
        <span className="text-secondary-medium">Round</span>
        <span className="text-tertiary-medium">One</span>
      </Link>

      <ul className="hidden md:flex gap-7 list-none m-0 p-0">
        {navLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[#5a5a7a] hover:text-primary-medium transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex gap-2.5">
        <Link
          href="/auth?mode=login"
          className="border border-primary-medium text-primary-medium px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-medium hover:text-white transition-all duration-200 hover:-translate-y-px"
        >
          Log in
        </Link>
        <Link
          href="/auth?mode=signup"
          className="bg-primary-medium text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25"
        >
          Sign up
        </Link>
      </div>
      
      {/* Hamburger Toggle Button (Visible only on Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 md:hidden focus:outline-none relative z-50 cursor-pointer"
        aria-label="Toggle Menu"
      >
        {/* Top Line */}
        <span
          className={`block h-0.5 w-6 bg-[#1a1a2e] rounded-full transform transition-all duration-400 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        {/* Middle Line */}
        <span
          className={`block h-0.5 w-6 bg-[#1a1a2e] rounded-full transition-all duration-400 ease-in-out ${
            isOpen ? 'opacity-0 -translate-x-2' : 'opacity-100'
          }`}
        />
        {/* Bottom Line */}
        <span
          className={`block h-0.5 w-6 bg-[#1a1a2e] rounded-full transform transition-all duration-400 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>
      <div
        className={`absolute top-16 right-8 w-fit bg-white border-b border-[#ede8fb] p-6 shadow-xl transition-all duration-300 ease-in-out transform md:hidden ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-3">
          <a
            href="/auth?mode=login"
            className="w-full text-center border border-[#7C52D9] text-[#7C52D9] py-2.5 rounded-lg text-sm font-medium hover:bg-[#7C52D9] hover:text-white transition-all"
          >
            Log in
          </a>
          <a
            href="/auth?mode=signup"
            className="w-full text-center bg-[#7C52D9] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#3B1F8C] transition-all shadow-md shadow-[#7C52D9]/15"
          >
            Sign up
          </a>
        </div>
        <ul className="mx-8 flex flex-col gap-4 list-none m-0 p-0 mt-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setIsOpen(false)} // Closes menu when clicking a link
                className="block text-md font-medium text-[#5a5a7a] hover:text-[#7C52D9] py-1 transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
