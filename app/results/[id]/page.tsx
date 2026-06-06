// app/results/[id]/page.tsx
// Shows full evaluation results after interview completes
// Fetches session + questions from DB using the session ID from the URL

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Share2, RotateCcw, LayoutDashboard } from "lucide-react";

// ── Helpers ────────────────────────────────────────────

// Returns Tailwind color classes based on score
function scoreColor(score: number) {
  if (score >= 75) return { text: "text-[#16A34A]", bg: "bg-[#F0FDF4]", bar: "#16A34A", ring: "#16A34A" };
  if (score >= 50) return { text: "text-[#D97706]", bg: "bg-[#FFFBEB]", bar: "#D97706", ring: "#D97706" };
  return { text: "text-[#DC2626]", bg: "bg-[#FEF2F2]", bar: "#DC2626", ring: "#DC2626" };
}

// Builds the SVG circle stroke-dashoffset for a given score (0-100)
// circumference = 2 * pi * r = 2 * 3.14159 * 42 = ~264
function ringOffset(score: number, circumference = 264) {
  return circumference - (circumference * score) / 100;
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Fetch session
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (sessionError || !session) notFound();

  // If session isn't completed yet — evaluation still running
  if (!session.completed) {
    redirect(`/interview/${id}`);
  }

  // Fetch all questions for this session ordered by question number
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("session_id", id)
    .order("order_num", { ascending: true });

  const avgScore = questions && questions.length > 0
    ? Math.round(questions.reduce((sum, q) => sum + (q.score ?? 0), 0) / questions.length)
    : 0;

  const bestScore = questions
    ? Math.max(...questions.map((q) => q.score ?? 0))
    : 0;

  const sc = scoreColor(session.score ?? 0);

  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">

        {/* ── Topbar ──────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-base font-bold">
              <span className="text-secondary-medium">Round</span>
              <span className="text-tertiary-medium">One</span>
            </Link>
            <span className="text-[10px] font-semibold bg-primary-light text-primary-medium
                             px-3 py-1 rounded-full hidden sm:inline">
              {session.role} · {session.type}
            </span>
          </div>
          <button
            className="flex items-center gap-2 text-xs font-semibold text-[#5a5a7a]
                       bg-white border border-[#ede8fb] px-4 py-2 rounded-xl
                       hover:border-primary-medium hover:text-primary-medium
                       transition-all duration-200"
          >
            <Share2 size={13} />
            Share result
          </button>
        </div>

        {/* ── Hero: score ring + verdict ───────────────── */}
        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6 sm:p-8
                        mb-5 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">

          {/* Score ring */}
          <div className="relative w-28 h-28 mx-auto sm:mx-0 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#F0ECFD" strokeWidth="9" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="#7C52D9" strokeWidth="9"
                strokeDasharray="264"
                strokeDashoffset={ringOffset(session.score ?? 0)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-semibold text-[#1a1a2e] leading-none">
                {session.score}
              </span>
              <span className="text-[9px] text-[#9090b0] mt-1">out of 100</span>
            </div>
          </div>

          {/* Verdict + meta */}
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#1a1a2e]
                           leading-snug mb-3">
              {session.verdict}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-semibold bg-primary-light text-primary-dark
                               px-3 py-1 rounded-full">
                {session.level}
              </span>
              <span className="text-[10px] font-semibold bg-secondary-light text-secondary-dark
                               px-3 py-1 rounded-full">
                {session.question_count} Questions
              </span>
              <span className="text-[10px] font-semibold bg-[#F0FDF4] text-[#16A34A]
                               px-3 py-1 rounded-full">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
          {[
            { label: "Overall Score", value: session.score ?? 0,  color: "#7C52D9" },
            { label: "Avg per Question", value: avgScore,         color: "#4E86E4" },
            { label: "Best Answer",    value: bestScore,          color: "#E4669A" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-[#ede8fb] p-4 sm:p-5 text-center"
            >
              <p
                className="font-display text-3xl font-semibold leading-none mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] text-[#9090b0] mb-3">{stat.label}</p>
              <div className="h-1 bg-[#f0ecfd] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${stat.value}%`, background: stat.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Strengths + Weaknesses ───────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          <div className="bg-white rounded-2xl border border-[#ede8fb] p-5">
            <p className="text-[9px] font-bold text-[#16A34A] uppercase tracking-widest mb-3">
              ✓ Strengths
            </p>
            <div className="space-y-2">
              {(session.strengths ?? []).map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] flex-shrink-0" />
                  <span className="text-xs text-[#5a5a7a]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#ede8fb] p-5">
            <p className="text-[9px] font-bold text-[#DC2626] uppercase tracking-widest mb-3">
              ✗ To Improve
            </p>
            <div className="space-y-2">
              {(session.weaknesses ?? []).map((w: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />
                  <span className="text-xs text-[#5a5a7a]">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Per-question breakdown ───────────────────── */}
        <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-4">
          Per-question breakdown
        </h2>

        <div className="space-y-3 mb-8">
          {(questions ?? []).map((q) => {
            const qsc = scoreColor(q.score ?? 0);
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-[#ede8fb] p-5
                           hover:border-primary-medium hover:shadow-lg hover:shadow-primary-medium/8
                           transition-all duration-200"
              >
                {/* Question header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p className="text-[9px] font-bold text-primary-medium uppercase
                                  tracking-widest mb-1.5">
                      Question {q.order_num}
                    </p>
                    <p className="text-sm font-semibold text-[#1a1a2e] leading-snug">
                      {q.question_text}
                    </p>
                  </div>
                  <span className={`text-base font-bold px-3 py-1.5 rounded-xl flex-shrink-0
                                    font-mono ${qsc.bg} ${qsc.text}`}>
                    {q.score ?? "—"}
                  </span>
                </div>

                {/* Score bar */}
                <div className="h-1 bg-[#f0ecfd] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${q.score ?? 0}%`, background: qsc.bar }}
                  />
                </div>

                {/* Answer */}
                {q.answer_text && (
                  <div className="bg-[#f7f5ff] rounded-xl px-4 py-3 mb-3">
                    <p className="text-[9px] font-bold text-[#9090b0] uppercase tracking-widest mb-1.5">
                      Your Answer
                    </p>
                    <p className="text-xs text-[#5a5a7a] leading-relaxed">
                      {q.answer_text}
                    </p>
                  </div>
                )}

                {/* Feedback */}
                {q.feedback && (
                  <div className="pt-3 border-t border-[#f0ecfd]">
                    <p className="text-[9px] font-bold text-[#9090b0] uppercase tracking-widest mb-1.5">
                      AI Feedback
                    </p>
                    <p className="text-xs text-[#5a5a7a] leading-relaxed">
                      {q.feedback}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── CTA row ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/interview/setup"
            className="flex items-center justify-center gap-2 bg-primary-medium
                       hover:bg-primary-dark text-white text-sm font-semibold
                       px-6 py-3 rounded-xl transition-all duration-200
                       hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25"
          >
            <RotateCcw size={15} />
            Try again
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white text-primary-medium
                       border border-[#ede8fb] hover:border-primary-medium
                       text-sm font-semibold px-6 py-3 rounded-xl
                       transition-all duration-200"
          >
            <LayoutDashboard size={15} />
            Back to dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
