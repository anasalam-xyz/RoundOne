// Client component, handles the filter toggle interactivity
// Receives all data as props from the server component parent

"use client";

import { useState } from "react";
import Link from "next/link";

type FilterType = "all" | "technical" | "hr" | "mixed";

interface Session {
  id:             string;
  role:           string;
  level:          string;
  type:           string;
  score:          number | null;
  question_count: number;
  created_at:     string;
}

interface Props {
  sessions:  Session[];
  total:     number;
  avgScore:  number;
  bestScore: number;
}

// Formats a date string into a relative label like "Today", "Yesterday", "3 days ago"
function relativeDate(dateStr: string) {
  const date  = new Date(dateStr);
  const now   = new Date();
  const diffMs   = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function scoreColor(score: number) {
  if (score >= 75) return { text: "text-[#16A34A]", bg: "bg-[#F0FDF4]" };
  if (score >= 50) return { text: "text-[#D97706]", bg: "bg-[#FFFBEB]" };
  return { text: "text-[#DC2626]", bg: "bg-[#FEF2F2]" };
}

// Type pill colors- consistent with the rest of the app
function typeStyle(type: string) {
  switch (type.toLowerCase()) {
    case "technical": return { bg: "bg-primary-light",   text: "text-primary-dark" };
    case "hr":        return { bg: "bg-tertiary-light",  text: "text-tertiary-dark" };
    case "mixed":     return { bg: "bg-secondary-light", text: "text-secondary-dark" };
    default:          return { bg: "bg-[#f7f5ff]",       text: "text-[#9090b0]" };
  }
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All",       value: "all" },
  { label: "Technical", value: "technical" },
  { label: "HR",        value: "hr" },
  { label: "Mixed",     value: "mixed" },
];

export default function HistoryClient({ sessions, total, avgScore, bestScore }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all"
    ? sessions
    : sessions.filter((s) => s.type.toLowerCase() === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Interviews", value: total,     color: "#7C52D9", pct: Math.min(total * 4, 100) },
          { label: "All-time Average", value: avgScore,  color: "#4E86E4", pct: avgScore },
          { label: "Best Score",       value: bestScore, color: "#E4669A", pct: bestScore },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#ede8fb] px-5 py-4
                       hover:border-primary-medium hover:shadow-lg hover:shadow-primary-medium/8
                       transition-all duration-200"
          >
            <p
              className="font-display text-4xl font-semibold leading-none mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-[10px] text-[#9090b0] mb-3">{stat.label}</p>
            <div className="h-1 bg-[#f0ecfd] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${stat.pct}%`, background: stat.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all duration-200
              ${filter === f.value
                ? "bg-primary-light border-primary-medium text-primary-dark"
                : "bg-white border-[#ede8fb] text-[#9090b0] hover:border-primary-medium hover:text-primary-medium"
              }`}
          >
            {f.label}
            {f.value !== "all" && (
              <span className="ml-1.5 opacity-60">
                ({sessions.filter((s) => s.type.toLowerCase() === f.value).length})
              </span>
            )}
          </button>
        ))}
        <span className="text-[10px] text-[#9090b0] ml-auto">
          {filtered.length} session{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede8fb] py-16 text-center">
          <p className="text-sm text-[#9090b0]">No sessions found.</p>
          <Link
            href="/interview/setup"
            className="inline-block mt-4 text-xs font-semibold text-primary-medium
                       bg-primary-light px-4 py-2 rounded-xl hover:bg-primary-medium
                       hover:text-white transition-all duration-200"
          >
            Start an interview →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((session) => {
            const sc  = scoreColor(session.score ?? 0);
            const ts  = typeStyle(session.type);
            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-[#ede8fb] px-5 py-4
                           grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_auto_auto_auto]
                           items-center gap-3 sm:gap-5
                           hover:border-primary-medium hover:shadow-lg hover:shadow-primary-medium/8
                           hover:-translate-y-px transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-0.5">
                    {session.role}
                  </p>
                  <p className="text-[11px] text-[#9090b0]">
                    {session.level} · {session.question_count}Q · {relativeDate(session.created_at)}
                  </p>
                </div>

                <span className={`hidden sm:inline text-[10px] font-semibold px-3 py-1
                                  rounded-full ${ts.bg} ${ts.text}`}>
                  {session.type}
                </span>

                <span className={`text-sm font-bold px-3 py-1.5 rounded-xl font-mono
                                  ${sc.bg} ${sc.text}`}>
                  {session.score ?? "—"}
                </span>

                <Link
                  href={`/results/${session.id}`}
                  className="text-[11px] font-semibold text-primary-medium bg-primary-light
                             px-3 py-1.5 rounded-lg hover:bg-primary-medium hover:text-white
                             transition-all duration-200 whitespace-nowrap"
                >
                  View →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
