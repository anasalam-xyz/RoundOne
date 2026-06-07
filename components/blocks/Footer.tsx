// components/Footer.tsx

import Link from "next/link";

const links = {
  Product: [
    { label: "How it works", href: "/about/#process" },
    { label: "Features",     href: "/#features" },
    { label: "Dashboard",    href: "/dashboard" },
  ],
  Company: [
    { label: "Contact Us",   href: "mailto:anasalam.xyz@gmail.com" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary-dark rounded-b rounded-4xl font-body">
      <div className="max-w-6xl mx-auto px-12 py-14 flex flex-col md:flex-row gap-16 justify-between">

        <div>
          <p className="text-xl font-bold text-white mb-3">
            Round<span className="text-tertiary-medium">One</span>
          </p>
          <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
            AI-powered mock interviews for developers. Practice smarter, get hired faster.
          </p>
          <Link
            href="/auth?mode=signup"
            className="inline-block bg-primary-medium hover:bg-primary-medium/80 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-px"
          >
            Start for free →
          </Link>
        </div>
      <div className="grid grid-cols-2 md:w-[50%]">
        {Object.entries(links).map(([section, items]) => (
          <div key={section}>
            <h5 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              {section}
            </h5>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/50 hover:text-tertiary-medium transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-12 pb-8 pt-6 border-t border-white/10 flex justify-between items-center">
        <p className="text-xs text-white/30">© 2026 RoundOne. All rights reserved.</p>
        <p className="text-xs text-white/30">Built with Next.js + Gemini AI</p>
      </div>
    </footer>
  );
}
