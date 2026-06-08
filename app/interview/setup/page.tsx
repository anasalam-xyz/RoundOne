// User picks role, experience level, interview type, question count, and answer mode
// All state is local,, on submit, creates a session in DB and redirects to /interview/[id]
// "use client" because the whole page is interactive selection UI

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code2, Server, BarChart2, Cloud, Smartphone, Brain,
  Keyboard, Mic, ArrowRight, ChevronLeft,
} from "lucide-react";

type Level      = "fresher" | "mid" | "senior";
type InterviewType = "technical" | "hr" | "mixed";
type QuestionCount = 5 | 10 | 15;
type AnswerMode = "text" | "voice";


// suggested roles as quick-fill chips
const ROLE_SUGGESTIONS = [
  "Frontend Dev", "Backend Dev", "Data Analyst",
  "DevOps", "Mobile Dev", "ML Engineer"
];

const LEVELS: { id: Level; label: string; desc: string }[] = [
  { id: "fresher", label: "Fresher",   desc: "0–1 years, fundamentals focus" },
  { id: "mid",     label: "Mid Level", desc: "1–3 years, practical depth" },
  { id: "senior",  label: "Senior",    desc: "3+ years, architecture & systems" },
];

const TYPES: { id: InterviewType; label: string; desc: string }[] = [
  { id: "technical", label: "Technical", desc: "Concepts, problem solving, domain knowledge" },
  { id: "hr",        label: "HR",        desc: "Behavioural, situational, culture fit" },
  { id: "mixed",     label: "Mixed",     desc: "Blend of technical and HR questions" },
];

const QUESTION_COUNTS: { value: QuestionCount; duration: string }[] = [
  { value: 5,  duration: "~10 min" },
  { value: 10, duration: "~20 min" },
  { value: 15, duration: "~30 min" },
];

export default function SetupPage() {
  const router = useRouter();

  const [role,      setRole]      = useState<string>("");
  const [level,     setLevel]     = useState<Level | null>(null);
  const [type,      setType]      = useState<InterviewType | null>(null);
  const [count,     setCount]     = useState<QuestionCount>(10);
  const [mode,      setMode]      = useState<AnswerMode>("text");
  const [loading,   setLoading]   = useState(false);

  // All required fields filled
  const canStart = role.trim().length > 0 && level && type;

  async function handleStart() {
    if (!canStart) return;
    setLoading(true);

    const res = await fetch("/api/sessions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        level,
        type,
        questionCount: count,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      setLoading(false);
      return;
    }

    router.push(`/interview/${data.sessionId}`);
  }

  function cardClass(selected: boolean) {
    return `
      bg-white border rounded-2xl p-4 cursor-pointer
      transition-all duration-200 hover:-translate-y-0.5
      hover:border-primary-medium hover:shadow-lg hover:shadow-primary-medium/10
      ${selected
        ? "border-primary-medium bg-primary-light shadow-md shadow-primary-medium/10"
        : "border-[#ede8fb]"
      }
    `;
  }

  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">

        <div className="flex items-center justify-between mb-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-[#9090b0]
                       hover:text-primary-medium transition-colors duration-200"
          >
            <ChevronLeft size={14} />
            Dashboard
          </Link>

          <div className="flex items-center gap-1.5">
            {["Setup", "Interview", "Results"].map((s, i) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-300
                  ${i === 0 ? "w-8 bg-primary-medium" : "w-5 bg-[#ede8fb]"}`}
              />
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1a1a2e] mb-2">
            Set up your interview
          </h1>
          <p className="text-sm text-[#9090b0]">
            Choose your preferences and start practicing in seconds.
          </p>
        </div>

        <section className="mb-8">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-3">
            Role
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="e.g. Frontend Dev, Product Manager, QA Engineer..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-[#ede8fb] rounded-xl px-4 py-3 text-sm
                text-[#1a1a2e] bg-white placeholder:text-[#c0c0d8]
                focus:outline-none focus:border-primary-medium focus:bg-white
                transition-colors duration-200 mb-3"
            />

            <div className="flex flex-wrap gap-2">
              {ROLE_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRole(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200
                    ${role === s
                      ? "border-primary-medium bg-primary-light text-primary-dark"
                      : "border-[#ede8fb] bg-white text-[#9090b0] hover:border-primary-medium hover:text-primary-medium"
                     }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>          
          </div>
        </section>

        <section className="mb-8">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-3">
            Experience Level
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LEVELS.map((l) => (
              <div
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={cardClass(level === l.id)}
              >
                <h4 className={`text-sm font-semibold mb-1
                                ${level === l.id ? "text-primary-dark" : "text-[#1a1a2e]"}`}>
                  {l.label}
                </h4>
                <p className={`text-[11px] leading-relaxed
                               ${level === l.id ? "text-primary-medium" : "text-[#9090b0]"}`}>
                  {l.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-3">
            Interview Type
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TYPES.map((t) => (
              <div
                key={t.id}
                onClick={() => setType(t.id)}
                className={cardClass(type === t.id)}
              >
                <h4 className={`text-sm font-semibold mb-1
                                ${type === t.id ? "text-primary-dark" : "text-[#1a1a2e]"}`}>
                  {t.label}
                </h4>
                <p className={`text-[11px] leading-relaxed
                               ${type === t.id ? "text-primary-medium" : "text-[#9090b0]"}`}>
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-3">
            Number of Questions
          </p>
          <div className="grid grid-cols-3 gap-3">
            {QUESTION_COUNTS.map((q) => (
              <div
                key={q.value}
                onClick={() => setCount(q.value)}
                className={`bg-white border rounded-2xl py-4 text-center cursor-pointer
                            transition-all duration-200 hover:-translate-y-0.5
                            hover:border-primary-medium hover:shadow-lg hover:shadow-primary-medium/10
                            ${count === q.value
                              ? "border-primary-medium bg-primary-light shadow-md shadow-primary-medium/10"
                              : "border-[#ede8fb]"
                            }`}
              >
                <p className={`text-2xl font-bold font-mono
                               ${count === q.value ? "text-primary-dark" : "text-[#1a1a2e]"}`}>
                  {q.value}
                </p>
                <p className={`text-[11px] mt-1
                               ${count === q.value ? "text-primary-medium" : "text-[#9090b0]"}`}>
                  {q.duration}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-3">
            Answer Mode
          </p>
          <div className="grid grid-cols-2 gap-3">

            <div
              onClick={() => setMode("text")}
              className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer
                          transition-all duration-200 hover:-translate-y-0.5
                          hover:border-primary-medium hover:shadow-lg hover:shadow-primary-medium/10
                          ${mode === "text"
                            ? "border-primary-medium bg-primary-light"
                            : "border-[#ede8fb] bg-white"
                          }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                               ${mode === "text" ? "bg-white text-primary-medium" : "bg-[#f7f5ff] text-[#9090b0]"}`}>
                <Keyboard size={18} />
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${mode === "text" ? "text-primary-dark" : "text-[#1a1a2e]"}`}>
                  Text
                </h4>
                <p className={`text-[11px] ${mode === "text" ? "text-primary-medium" : "text-[#9090b0]"}`}>
                  Type your answers
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3 rounded-2xl border border-[#ede8fb]
                         bg-white p-4 opacity-50 cursor-not-allowed"
              title="Voice mode coming soon"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f7f5ff] flex items-center justify-center flex-shrink-0 text-[#9090b0]">
                <Mic size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1a1a2e] flex items-center gap-2">
                  Voice
                  <span className="text-[9px] font-semibold bg-[#ede8fb] text-[#9090b0]
                                   px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                </h4>
                <p className="text-[11px] text-[#9090b0]">Speak your answers</p>
              </div>
            </div>

          </div>
        </section>

        <div className="flex items-center justify-between">
          {!canStart ? (
            <p className="text-xs text-[#9090b0]">
              Select a role, level, and type to continue
            </p>
          ) : (
            <p className="text-xs text-primary-medium font-medium">
              Ready to go!
            </p>
          )}

          <button
            onClick={handleStart}
            disabled={!canStart || loading}
            className={`flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold
                        transition-all duration-200
                        ${canStart
                          ? "bg-primary-medium hover:bg-primary-dark text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-medium/25 cursor-pointer"
                          : "bg-[#ede8fb] text-[#c0c0d8] cursor-not-allowed"
                        }`}
          >
            {loading ? "Starting..." : "Start Interview"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
