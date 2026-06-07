// app/dashboard/page.tsx
// Overview — real data from Supabase
// Server component — fetches directly, no API route needed

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function scoreColor(score: number) {
  if (score >= 75) return { text: "text-[#16A34A]", bg: "bg-[#F0FDF4]" };
  if (score >= 50) return { text: "text-[#D97706]", bg: "bg-[#FFFBEB]" };
  return { text: "text-[#DC2626]", bg: "bg-[#FEF2F2]" };
}

function scoreVerdict(score: number) {
  if (score >= 75) return "Strong performance";
  if (score >= 50) return "Room to improve";
  return "Needs work";
}

function relativeDate(dateStr: string) {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return `${diffDays} days ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Fetch last 7 completed sessions for trend + recent list
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, role, type, level, score, created_at")
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("created_at", { ascending: false })
    .limit(7);

  // Fetch last session's strengths and weaknesses for AI insights
  const { data: lastSessionFull } = await supabase
    .from("sessions")
    .select("strengths, weaknesses")
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const allSessions = sessions ?? [];
  const last        = allSessions[0] ?? null;
  const recentFour  = allSessions.slice(0, 4);

  const avgScore = allSessions.length > 0
    ? Math.round(allSessions.reduce((sum, s) => sum + (s.score ?? 0), 0) / allSessions.length)
    : 0;

  const bestScore = allSessions.length > 0
    ? Math.max(...allSessions.map((s) => s.score ?? 0))
    : 0;

  const trendSessions = [...allSessions].reverse();
  const strengths     = lastSessionFull?.strengths  ?? [];
  const weaknesses    = lastSessionFull?.weaknesses ?? [];

  // ── Empty state ────────────────────────────────────
  if (allSessions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center
                      min-h-[60vh] text-center gap-4">
        <Image src="/undraw_refreshing-beverage_w8al.svg" 
          height={0} 
          width={0} 
          alt="No Interveiws" 
          className="h-auto w-32"
        />
        <h2 className="font-display text-2xl font-semibold text-[#1a1a2e]">
          No interviews yet
        </h2>
        <p className="text-sm text-[#9090b0] max-w-xs">
          Complete your first interview to see your scores, trends, and AI insights here.
        </p>
        <Link
          href="/interview/setup"
          className="bg-primary-medium hover:bg-primary-dark text-white text-sm
                     font-semibold px-6 py-3 rounded-xl transition-all duration-200
                     hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25 mt-2"
        >
          Start your first interview →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ── Hero row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {last && (
          <div className="bg-white rounded-2xl border border-[#ede8fb] p-7
                          flex items-center gap-5
                          hover:border-primary-medium hover:shadow-xl hover:shadow-primary-medium/10
                          transition-all duration-200 cursor-default">
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
                Last Session
              </p>
              <p className="font-display text-6xl font-semibold text-[#1a1a2e] leading-none mb-2">
                {last.score ?? "—"}
              </p>
              <p className="text-xs text-[#5a5a7a]">{last.role} · {last.type}</p>
              {last.score !== null && (
                <span className={`inline-block mt-3 text-[10px] font-semibold px-3 py-1
                                  rounded-full ${scoreColor(last.score).bg} ${scoreColor(last.score).text}`}>
                  {scoreVerdict(last.score)}
                </span>
              )}
            </div>
            {last.score !== null && (
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F0ECFD" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="#7C52D9" strokeWidth="10"
                    strokeDasharray="239"
                    strokeDashoffset={239 - (239 * last.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center
                                 text-base font-bold text-primary-medium font-mono">
                  {last.score}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#ede8fb] p-7
                        hover:border-secondary-medium hover:shadow-xl hover:shadow-secondary-medium/10
                        transition-all duration-200 cursor-default">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
            7-day Average
          </p>
          <p className="font-display text-6xl font-semibold text-[#1a1a2e] leading-none mb-3">
            {avgScore}
          </p>
          <div className="h-1.5 bg-[#F0ECFD] rounded-full overflow-hidden mb-1">
            <div className="h-full bg-secondary-medium rounded-full" style={{ width: `${avgScore}%` }} />
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-[9px] text-[#c0c0d8]">0</span>
            <span className="text-[9px] text-[#c0c0d8]">100</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Sessions", value: allSessions.length },
              { label: "Best",     value: bestScore },
              { label: "Streak",   value: `${allSessions.length}d` },
            ].map((s) => (
              <div key={s.label} className="bg-[#f7f5ff] rounded-xl p-2.5 text-center">
                <p className="text-sm font-bold text-secondary-medium">{s.value}</p>
                <p className="text-[9px] text-[#9090b0] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6
                        hover:border-primary-medium hover:shadow-xl hover:shadow-primary-medium/10
                        transition-all duration-200 cursor-default">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-4">
            Score Trend
          </p>
          <div className="flex items-end gap-1.5 h-28">
            {trendSessions.map((s, i) => {
            const isLatest  = i === trendSessions.length - 1;
            const heightPx  = Math.round(((s.score ?? 0) / 100) * 112); // 112px = h-28

            return (
              <div key={s.id} className="flex flex-col items-center gap-1 flex-1 max-w-8">
                <div
                  className={`w-full rounded-t-md hover:opacity-75
                      ${isLatest ? "bg-tertiary-dark" : "bg-tertiary-medium"}`}
                  style={{ height: `${heightPx}px` }}
                  title={`${s.score}`}
                />
                <span className="text-[8px] text-[#c0c0d8]">
                  {new Date(s.created_at).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
                </span>
              </div>
            );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6
                        hover:border-secondary-medium hover:shadow-xl hover:shadow-secondary-medium/10
                        transition-all duration-200">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-4">
            Recent Sessions
          </p>
          <div>
            {recentFour.map((session) => {
              const sc = scoreColor(session.score ?? 0);
              return (
                <Link
                  key={session.id}
                  href={`/results/${session.id}`}
                  className="flex items-center justify-between py-2.5 border-b
                             border-[#f0ecfd] last:border-0 group"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#1a1a2e]
                                  group-hover:text-primary-medium transition-colors">
                      {session.role}
                    </p>
                    <p className="text-[10px] text-[#9090b0] mt-0.5">
                      {session.type} · {relativeDate(session.created_at)}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${sc.bg} ${sc.text}`}>
                    {session.score ?? "—"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6
                        hover:border-tertiary-medium hover:shadow-xl hover:shadow-tertiary-medium/10
                        transition-all duration-200 cursor-default">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-4">
            AI Insights
          </p>
          {strengths.length === 0 && weaknesses.length === 0 ? (
            <p className="text-xs text-[#c0c0d8] text-center py-8">
              Complete an interview to see insights
            </p>
          ) : (
            <>
              <p className="text-[9px] font-bold text-[#16A34A] uppercase tracking-wider mb-2">Strengths</p>
              <div className="space-y-1.5 mb-4">
                {strengths.slice(0, 3).map((s: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] flex-shrink-0" />
                    <span className="text-xs text-[#5a5a7a]">{s}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-[#f0ecfd] mb-4" />
              <p className="text-[9px] font-bold text-[#DC2626] uppercase tracking-wider mb-2">To Improve</p>
              <div className="space-y-1.5">
                {weaknesses.slice(0, 3).map((w: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />
                    <span className="text-xs text-[#5a5a7a]">{w}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
