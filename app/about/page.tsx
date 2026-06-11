// app/about/page.tsx
// About / How it works page — shown to logged-out users via navbar
// Static page, no data fetching needed

import Link from "next/link";
import { Bot, BarChart2, History, SlidersHorizontal, Database, MessageSquare, Keyboard, Brain, Trophy, Sparkles} from "lucide-react";

export const metadata = {
  title:       "How it works",
  description: "Learn how RoundOne simulates real interviews, scores your answers, and helps you improve.",
};

const WHAT_CARDS = [
  {
    icon: <Bot size={18} />,
    title: "AI-powered mock interviews",
    desc: "Gemini asks questions tailored to your role and experience level, adapting based on what you say.",
    color: "bg-primary-light text-primary-medium",
  },
  {
    icon: <BarChart2 size={18} />,
    title: "Scored, structured feedback",
    desc: "Every answer gets a score and written feedback. See your strengths, gaps, and an overall verdict.",
    color: "bg-secondary-light text-secondary-medium",
  },
  {
    icon: <History size={18} />,
    title: "Session history",
    desc: "Track your progress over time. See every past session, score trend, and full Q&A review.",
    color: "bg-tertiary-light text-tertiary-medium",
  },
  {
    icon: <SlidersHorizontal size={18} />,
    title: "Fully configurable",
    desc: "Pick role, experience level, interview type, and question count. Technical, HR, or mixed.",
    color: "bg-primary-light text-primary-medium",
  },
];

const WHO_PILLS = [
  "Final year students", "Fresh graduates", "Career switchers",
  "Developers returning from breaks", "Anyone prepping for a tech interview",
];

const STEPS = [
  {
    num: "01",
    icon: <SlidersHorizontal size={15} />,
    title: "You configure your interview",
    tag: { label: "You", color: "bg-secondary-light text-secondary-dark" },
    desc: "Choose your target role, experience level, interview type (technical, HR, or mixed), and how many questions you want. RoundOne supports any role — not just a fixed list.",
    pills: ["Any role", "3 experience levels", "5 / 10 / 15 questions"],
    numColor: "bg-primary-light text-primary-medium",
    iconColor: "text-primary-medium",
  },
  {
    num: "02",
    icon: <Database size={15} />,
    title: "Session is created in the database",
    tag: { label: "System", color: "bg-[#f0fdf4] text-[#16A34A]" },
    desc: "A session record is created in Supabase, linked to your account. All questions and answers are stored here — so your results survive a page reload and you can revisit any session from your dashboard.",
    pills: [],
    numColor: "bg-secondary-light text-secondary-medium",
    iconColor: "text-secondary-medium",
  },
  {
    num: "03",
    icon: <MessageSquare size={15} />,
    title: "Gemini asks the first question",
    tag: { label: "AI", color: "bg-primary-light text-primary-dark" },
    desc: "The Gemini API receives your session parameters and generates an opening question calibrated to your role and level. It behaves like a real interviewer.",
    pills: [],
    numColor: "bg-tertiary-light text-tertiary-medium",
    iconColor: "text-tertiary-medium",
  },
  {
    num: "04",
    icon: <Keyboard size={15} />,
    title: "You answer, the AI follows up",
    tag: { label: "You", color: "bg-secondary-light text-secondary-dark" },
    desc: "You type your answer. Two invisible metrics are quietly tracked: how long until your first keystroke (confidence signal) and how long you took to complete the answer (fluency signal). These are passed to Gemini but never shown to you. Gemini reads your full answer and generates the next question that follows naturally from what you said.",
    pills: ["Conversational, not static", "Time-to-first-key tracked", "Answer duration tracked"],
    numColor: "bg-[#f0fdf4] text-[#16A34A]",
    iconColor: "text-[#16A34A]",
  },
  {
    num: "05",
    icon: <Brain size={15} />,
    title: "Gemini evaluates all answers together",
    tag: { label: "AI", color: "bg-primary-light text-primary-dark" },
    desc: "Once the final answer is submitted, all Q&A pairs plus timing data are sent to Gemini in a single evaluation prompt. It returns structured JSON with an overall score, per-answer scores and feedback, three strengths, three weaknesses, and a one-line verdict.",
    pills: ["Overall score 0–100", "Per-answer score + feedback", "3 strengths", "3 weaknesses", "One-line verdict"],
    numColor: "bg-primary-light text-primary-medium",
    iconColor: "text-primary-medium",
  },
  {
    num: "06",
    icon: <Trophy size={15} />,
    title: "Results saved, dashboard updated",
    tag: { label: "System", color: "bg-[#f0fdf4] text-[#16A34A]" },
    desc: "The evaluation is saved back to Supabase. Your results page loads with the full breakdown. The session appears in your dashboard with score, role, and date — and over time you can see your score trend across sessions.",
    pills: [],
    numColor: "bg-secondary-light text-secondary-medium",
    iconColor: "text-secondary-medium",
  },
];

const SCORE_ROWS = [
  { label: "Overall score",      pct: 78, color: "#7C52D9", val: "78" },
  { label: "Q1 — React hooks",   pct: 85, color: "#4E86E4", val: "85" },
  { label: "Q2 — State mgmt",    pct: 72, color: "#4E86E4", val: "72" },
  { label: "Q3 — System design", pct: 60, color: "#E4669A", val: "60" },
];

const TECH_CARDS = [
  {
    icon: <Sparkles size={17} />,
    name: "Gemini API",
    desc: "Question generation and answer evaluation. Conversational context is passed with every request.",
    mono: "gemini-2.5-flash",
    color: "bg-primary-light text-primary-medium",
  },
  {
    icon: <Database size={17} />,
    name: "Supabase",
    desc: "PostgreSQL database + auth with cookie-based JWT sessions. Row Level Security on all tables.",
    mono: "@supabase/ssr",
    color: "bg-secondary-light text-secondary-medium",
  },
  {
    icon: <Bot size={17} />,
    name: "Next.js 15",
    desc: "App Router, Server Components, and API route handlers. Deployed on Vercel.",
    mono: "App Router",
    color: "bg-[#f0fdf4] text-[#16A34A]",
  },
  {
    icon: <SlidersHorizontal size={17} />,
    name: "Tailwind CSS v4",
    desc: "Custom design system with purple/blue/pink palette. Playfair Display + DM Sans typography.",
    mono: "@theme block",
    color: "bg-tertiary-light text-tertiary-medium",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 pb-20">

        {/* ── Hero ────────────────────────────────────── */}
        <div className="pt-16 pb-12 text-center">
          {/*<span className="inline-flex items-center gap-1.5 bg-primary-light border border-primary-medium/20
                           text-primary-medium text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
           Author: Anas Alam 
          </span>*/}
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1a1a2e]
                         leading-tight mb-4">
            Practice interviews.<br />
            <span className="text-primary-medium">Get real feedback.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5a5a7a] leading-relaxed max-w-lg mx-auto">
            RoundOne simulates a real interview experience and tells you exactly how you did,
            question by question.
          </p>
        </div>

        {/* ── What is RoundOne ────────────────────────── */}
        <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-4">
          What is RoundOne?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
          {WHAT_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-[#ede8fb] p-5
                         hover:border-primary-medium hover:shadow-lg hover:shadow-primary-medium/8
                         transition-all duration-200"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                {card.icon}
              </div>
              <h3 className="text-sm font-semibold text-[#1a1a2e] mb-1.5">{card.title}</h3>
              <p className="text-xs text-[#5a5a7a] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Who is it for ───────────────────────────── */}
        <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-4">
          Who is it for?
        </p>
        <div className="flex flex-wrap gap-2 mb-14">
          {WHO_PILLS.map((pill) => (
            <span
              key={pill}
              className="flex items-center gap-2 bg-white border border-[#ede8fb]
                         text-xs font-medium text-[#5a5a7a] px-4 py-2 rounded-full
                         hover:border-primary-medium hover:text-primary-medium
                         transition-colors duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-medium flex-shrink-0" />
              {pill}
            </span>
          ))}
        </div>

        {/* ── How it works steps ──────────────────────── */}
        <p id="process" className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
          The process
        </p>
        <h2 className="font-display text-3xl font-semibold text-[#1a1a2e] mb-2">
          What happens when you start
        </h2>
        <p className="text-sm text-[#5a5a7a] leading-relaxed mb-8">
          From setup to results — here's exactly what RoundOne does under the hood.
        </p>

        <div className="relative mb-14">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-10 bottom-10 w-px bg-[#ede8fb]" />

          <div className="space-y-5">
            {STEPS.map((step) => (
              <div key={step.num} className="flex gap-4 relative">

                {/* Step number circle */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                 flex-shrink-0 font-mono text-xs font-semibold z-10
                                 ${step.numColor}`}>
                  {step.num}
                </div>

                {/* Step body */}
                <div className="flex-1 bg-white rounded-2xl border border-[#ede8fb] p-5
                                hover:border-primary-medium hover:shadow-md hover:shadow-primary-medium/8
                                transition-all duration-200">

                  {/* Title + tag */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-[#1a1a2e] leading-snug flex items-center gap-2">
                      <span className={step.iconColor}>{step.icon}</span>
                      {step.title}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full
                                      flex-shrink-0 ${step.tag.color}`}>
                      {step.tag.label}
                    </span>
                  </div>

                  <p className="text-xs text-[#5a5a7a] leading-relaxed">{step.desc}</p>

                  {/* Detail pills */}
                  {step.pills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {step.pills.map((pill) => (
                        <span
                          key={pill}
                          className="text-[10px] text-[#9090b0] bg-[#f7f5ff] border border-[#ede8fb]
                                     px-2.5 py-1 rounded-lg"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Score anatomy ───────────────────────────── */}
        <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-6">
          What a score looks like
        </p>
        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6 mb-14">
          <p className="text-xs font-semibold text-[#9090b0] mb-5">Sample evaluation breakdown</p>
          <div className="space-y-3">
            {SCORE_ROWS.map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-xs text-[#5a5a7a] w-36 flex-shrink-0">{row.label}</span>
                <div className="flex-1 h-1.5 bg-[#f0ecfd] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.pct}%`, background: row.color }}
                  />
                </div>
                <span
                  className="text-xs font-bold font-mono w-7 text-right flex-shrink-0"
                  style={{ color: row.color }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#f0ecfd]">
            <p className="text-xs text-[#9090b0] italic leading-relaxed">
              "Strong fundamentals and clean explanations. Needs to work on system design depth
              and trade-off reasoning."
            </p>
          </div>
        </div>

        {/* ── Tech stack ──────────────────────────────── */}
        <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
          Under the hood
        </p>
        <h2 className="font-display text-3xl font-semibold text-[#1a1a2e] mb-2">
          What powers it
        </h2>
        <p className="text-sm text-[#5a5a7a] leading-relaxed mb-6">
          Built entirely on free-tier services — a deliberate constraint to keep it deployable
          and reproducible.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
          {TECH_CARDS.map((card) => (
            <div
              key={card.name}
              className="bg-white rounded-2xl border border-[#ede8fb] p-5 flex gap-3
                         hover:border-primary-medium hover:shadow-lg hover:shadow-primary-medium/8
                         transition-all duration-200"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                               flex-shrink-0 ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1a1a2e] mb-1">{card.name}</h3>
                <p className="text-xs text-[#5a5a7a] leading-relaxed mb-2">{card.desc}</p>
                <span className="text-[10px] font-mono text-primary-medium">{card.mono}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── GitHub CTA ──────────────────────────────── */}
        <div className="bg-primary-dark rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-white mb-2">
            See how it's built
          </h2>
          <p className="text-sm text-white/55 leading-relaxed mb-6 max-w-sm mx-auto">
            The full source code is open — explore the API routes, Gemini prompts,
            database schema, and more.
          </p>
          <a
            href="https://github.com/anasalam-xyz/RoundOne"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary-dark
                       text-sm font-semibold px-6 py-2.5 rounded-xl
                       hover:bg-primary-light transition-all duration-200
                       hover:-translate-y-px"
          >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            View on GitHub
          </a>
        </div>

      </div>
    </div>
  );
}
