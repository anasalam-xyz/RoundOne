// app/dashboard/page.tsx
// Overview: last score card, average card, trend chart, recent sessions, AI insights
// All data is mocked -> replace with Supabase queries once DB is set up

// ── Mock data (replace with DB queries later): todo,,, 
const recentSessions = [
  { id: "1", role: "Frontend Dev",  type: "Technical", score: 82, date: "Today" },
  { id: "2", role: "Backend Dev",   type: "Mixed",     score: 74, date: "Yesterday" },
  { id: "3", role: "Frontend Dev",  type: "HR",        score: 68, date: "3 days ago" },
  { id: "4", role: "Data Analyst",  type: "Technical", score: 91, date: "5 days ago" },
];

const strengths  = ["Clear communication", "System design", "Problem breakdown"];
const weaknesses = ["Async/await depth",   "Time complexity", "Edge case handling"];

// Weekly trend -> replace with last 7 session scores from DB
const trendData   = [55, 68, 62, 74, 70, 82, 91];
const trendLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Returns bg + text color classes based on score
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

export default function DashboardPage() {
  const last    = recentSessions[0];
  const avgScore = Math.round(
    recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length
  );
  const bestScore = Math.max(...recentSessions.map((s) => s.score));

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white rounded-2xl border border-[#ede8fb] p-7 flex items-center gap-5
                        hover:border-primary-medium hover:shadow-xl hover:shadow-primary-medium/10
                        transition-all duration-200 cursor-default">
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
              Last Session
            </p>
            <p className="font-display text-6xl font-semibold text-[#1a1a2e] leading-none mb-2">
              {last.score}
            </p>
            <p className="text-xs text-[#5a5a7a]">{last.role} · {last.type}</p>
            <span className={`inline-block mt-3 text-[10px] font-semibold px-3 py-1 rounded-full
                              ${scoreColor(last.score).bg} ${scoreColor(last.score).text}`}>
              {scoreVerdict(last.score)}
            </span>
          </div>

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
        </div>

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
            <div
              className="h-full bg-secondary-medium rounded-full transition-all duration-500"
              style={{ width: `${avgScore}%` }}
            />
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-[9px] text-[#c0c0d8]">0</span>
            <span className="text-[9px] text-[#c0c0d8]">100</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Sessions", value: recentSessions.length },
              { label: "Best",     value: bestScore },
              { label: "Streak",   value: "3d" },
            ].map((s) => (
              <div key={s.label} className="bg-[#f7f5ff] rounded-xl p-2.5 text-center">
                <p className="text-sm font-bold text-secondary-medium">{s.value}</p>
                <p className="text-[9px] text-[#9090b0] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl border border-[#ede8fb] p-6
                        hover:border-primary-medium hover:shadow-xl hover:shadow-primary-medium/10
                        transition-all duration-200 cursor-default">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-4">
            Score Trend
          </p>
          <div className="flex items-end gap-1.5 h-28">
            {trendData.map((val, i) => {
              const isLatest = i === trendData.length - 1;
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-full rounded-t-md transition-opacity duration-200 hover:opacity-75
                                ${isLatest ? "bg-primary-medium" : "bg-primary-light"}`}
                    style={{ height: `${val}%` }}
                    title={`${val}`}
                  />
                  <span className="text-[8px] text-[#c0c0d8]">{trendLabels[i]}</span>
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
            {recentSessions.map((session) => {
              const sc = scoreColor(session.score);
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-2.5 border-b border-[#f0ecfd]
                             last:border-0 cursor-pointer group"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#1a1a2e]
                                  group-hover:text-primary-medium transition-colors duration-150">
                      {session.role}
                    </p>
                    <p className="text-[10px] text-[#9090b0] mt-0.5">
                      {session.type} · {session.date}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${sc.bg} ${sc.text}`}>
                    {session.score}
                  </span>
                </div>
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

          <p className="text-[9px] font-bold text-[#16A34A] uppercase tracking-wider mb-2">
            Strengths
          </p>
          <div className="space-y-1.5 mb-4">
            {strengths.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] flex-shrink-0" />
                <span className="text-xs text-[#5a5a7a]">{s}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-[#f0ecfd] mb-4" />

          <p className="text-[9px] font-bold text-[#DC2626] uppercase tracking-wider mb-2">
            To Improve
          </p>
          <div className="space-y-1.5">
            {weaknesses.map((w) => (
              <div key={w} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />
                <span className="text-xs text-[#5a5a7a]">{w}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
