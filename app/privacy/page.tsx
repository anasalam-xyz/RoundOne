import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Privacy Policy",
  description: "How RoundOne collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold text-primary-medium uppercase tracking-widest mb-2">Legal</p>
        <h1 className="font-display text-4xl font-semibold text-[#1a1a2e] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#9090b0] mb-12">Last updated: June 2025</p>

        <div className="space-y-10 text-sm text-[#5a5a7a] leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-3">What we collect</h2>
            <p>When you create an account, we collect your name and email address. When you use RoundOne, we store your interview sessions including questions, answers, scores, and AI-generated feedback. We also collect anonymous timing data (time to first keystroke, answer duration) to improve scoring accuracy.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-3">How we use it</h2>
            <p>Your data is used solely to provide the RoundOne service — storing your interview history, generating your dashboard, and displaying your results. We do not sell your data, share it with third parties, or use it for advertising.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-3">Third-party services</h2>
            <p>RoundOne uses the following third-party services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-[#1a1a2e]">Supabase</strong> — database and authentication</li>
              <li><strong className="text-[#1a1a2e]">Google Gemini API</strong> — AI question generation and answer evaluation</li>
              <li><strong className="text-[#1a1a2e]">Vercel</strong> — hosting and deployment</li>
            </ul>
            <p className="mt-2">Your interview answers are sent to the Gemini API for evaluation. Please review Google's privacy policy for details on how they handle this data.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-3">Data retention</h2>
            <p>Your data is retained as long as your account exists. You can delete your account at any time from the Settings page, which permanently removes all your data from our database.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-3">Cookies</h2>
            <p>RoundOne uses cookies solely for authentication — to keep you logged in between sessions. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-3">Contact</h2>
            <p>Questions about this policy? Reach out via GitHub: <a href="https://github.com/anasalam-xyz" className="text-primary-medium hover:text-primary-dark transition-colors">github.com/anasalam-xyz</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
