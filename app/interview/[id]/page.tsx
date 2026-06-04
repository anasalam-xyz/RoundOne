// app/interview/[id]/page.tsx
// Live interview session — one question at a time, conversational AI flow
// Tracks time-to-first-keystroke and answer duration silently for scoring
// On last answer → analyzing screen → redirect to /results/[id]

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { SendHorizonal, StopCircle } from "lucide-react";

// ── Types ──────────────────────────────────────────────
interface QAPair {
  question: string;
  answer:   string;
  timeToFirstKey: number; // ms from question render to first keystroke
  answerDuration: number; // ms from first keystroke to submit
}

// ── Analyzing screen messages — cycle through these ────
const ANALYZING_MESSAGES = [
  "Reading through your answers...",
  "Evaluating communication clarity...",
  "Checking technical accuracy...",
  "Identifying strengths...",
  "Spotting areas to improve...",
  "Calculating your score...",
  "Building your feedback report...",
  "Almost there...",
];

export default function InterviewPage() {
  const { id }  = useParams();
  const router  = useRouter();

  // ── Session config — in real app, fetch from DB using `id` ────
  // TODO: replace with: const session = await fetchSession(id)
  const totalQuestions = 10;
  const role           = "Frontend Dev";
  const interviewType  = "Technical";

  // ── Core state ────────────────────────────────────────
  const [currentQ,     setCurrentQ]     = useState(1);
  const [question,     setQuestion]     = useState("");
  const [answer,       setAnswer]       = useState("");
  const [history,      setHistory]      = useState<QAPair[]>([]);
  const [aiLoading,    setAiLoading]    = useState(true);  // AI is typing
  const [submitting,   setSubmitting]   = useState(false); // answer being sent
  const [analyzing,    setAnalyzing]    = useState(false); // final analysis screen
  const [analyzeMsg,   setAnalyzeMsg]   = useState(ANALYZING_MESSAGES[0]);
  const [showPrevAnswer, setShowPrevAnswer] = useState(false);

  // ── Silent time tracking refs ──────────────────────────
  const questionRenderedAt = useRef<number>(0); // when question appeared
  const firstKeyAt         = useRef<number>(0); // first keystroke timestamp
  const hasTyped           = useRef(false);     // prevent double-recording

  // ── Textarea ref for auto-focus ────────────────────────
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Fetch the first question on mount ─────────────────
  useEffect(() => {
    fetchNextQuestion([]);
  }, []);

  // ── Cycle analyzing messages every 2s ─────────────────
  useEffect(() => {
    if (!analyzing) return;
    let i = 1;
    const interval = setInterval(() => {
      setAnalyzeMsg(ANALYZING_MESSAGES[i % ANALYZING_MESSAGES.length]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, [analyzing]);

  // ── Fetch next question from Gemini API ───────────────
  async function fetchNextQuestion(prevHistory: QAPair[]) {
    setAiLoading(true);
    setQuestion("");
    setShowPrevAnswer(false);

    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/interview/question", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     sessionId: id,
      //     role,
      //     type: interviewType,
      //     questionNumber: prevHistory.length + 1,
      //     totalQuestions,
      //     history: prevHistory,
      //   }),
      // });
      // const { question } = await res.json();

      // Mock question for UI development
      await new Promise((r) => setTimeout(r, 1800));
      const mockQuestion = prevHistory.length === 0
        ? `Tell me about yourself and why you're interested in a ${role} role.`
        : `Based on your previous answer, can you elaborate on how you've handled performance optimization in a real project?`;

      setQuestion(mockQuestion);
      setAiLoading(false);

      // Start timing from when question appears
      questionRenderedAt.current = Date.now();
      firstKeyAt.current         = 0;
      hasTyped.current           = false;

      // Auto-focus textarea
      setTimeout(() => textareaRef.current?.focus(), 100);

    } catch (err) {
      console.error("Failed to fetch question:", err);
      setAiLoading(false);
    }
  }

  // ── Track first keystroke silently ────────────────────
  function handleAnswerChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(e.target.value);

    if (!hasTyped.current && e.target.value.length > 0) {
      firstKeyAt.current = Date.now();
      hasTyped.current   = true;
    }
  }

  // ── Submit answer + fetch next question ───────────────
  async function handleSubmit() {
    if (!answer.trim() || submitting || aiLoading) return;
    setSubmitting(true);

    // Calculate silent timing metrics
    const timeToFirstKey = firstKeyAt.current
      ? firstKeyAt.current - questionRenderedAt.current
      : 0;
    const answerDuration = firstKeyAt.current
      ? Date.now() - firstKeyAt.current
      : 0;

    const newPair: QAPair = {
      question,
      answer: answer.trim(),
      timeToFirstKey,
      answerDuration,
    };

    const updatedHistory = [...history, newPair];
    setHistory(updatedHistory);
    setAnswer("");
    setSubmitting(false);
    setShowPrevAnswer(true);

    // Last question — go to analyzing screen
    if (currentQ >= totalQuestions) {
      setAnalyzing(true);
      await runFinalEvaluation(updatedHistory);
      return;
    }

    // Next question
    setCurrentQ((q) => q + 1);
    fetchNextQuestion(updatedHistory);
  }

  // ── Final evaluation API call ─────────────────────────
  async function runFinalEvaluation(finalHistory: QAPair[]) {
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/interview/evaluate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ sessionId: id, history: finalHistory }),
      // });

      // Mock delay — replace with actual Gemini evaluation time
      await new Promise((r) => setTimeout(r, 5000));
      router.push(`/results/${id}`);

    } catch (err) {
      console.error("Evaluation failed:", err);
    }
  }

  // ── Submit on Enter (not Shift+Enter) ─────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const progress = ((currentQ - 1) / totalQuestions) * 100;

  // ── Analyzing screen ───────────────────────────────────
  if (analyzing) {
    return (
      <div className="min-h-screen bg-[#f7f5ff] font-body flex flex-col">

        {/* Topbar */}
        <div className="bg-white border-b border-[#ede8fb] h-14 px-6 flex items-center gap-3 flex-shrink-0">
          <span className="text-base font-bold">
            <span className="text-secondary-medium">Round</span>
            <span className="text-tertiary-medium">One</span>
          </span>
          <span className="text-[10px] font-semibold bg-primary-light text-primary-medium px-3 py-1 rounded-full">
            {role} · {interviewType}
          </span>
        </div>

        {/* Centered analyzing content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">

          {/* Pulsing ring */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary-medium/20
                            animate-[ping_1.5s_ease-in-out_infinite]" />
            <div className="w-16 h-16 rounded-full bg-primary-light border border-primary-medium/20
                            flex items-center justify-center">
              <svg width="24" height="24" fill="none" stroke="#7C52D9" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1a1a2e] mb-2">
              Analyzing your answers
            </h2>
            <p className="text-sm text-[#9090b0] max-w-sm leading-relaxed">
              Gemini is reviewing all {totalQuestions} responses and building your personalized feedback report.
            </p>
          </div>

          {/* Cycling message pill */}
          <div
            key={analyzeMsg}
            className="text-xs font-semibold text-primary-medium bg-primary-light
                       px-5 py-2 rounded-full animate-[fadeIn_0.4s_ease]"
          >
            {analyzeMsg}
          </div>

          {/* Three color dots */}
          <div className="flex items-center gap-2">
            {["bg-primary-medium", "bg-tertiary-medium", "bg-secondary-medium"].map((c, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${c} animate-[bounce_1s_ease-in-out_infinite]`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ── Main interview screen ──────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body flex flex-col">

      {/* ── Topbar ────────────────────────────────────── */}
      <div className="bg-white border-b border-[#ede8fb] h-14 px-5 sm:px-8
                      flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold">
            <span className="text-secondary-medium">Round</span>
            <span className="text-tertiary-medium">One</span>
          </span>
          <span className="hidden sm:inline text-[10px] font-semibold bg-primary-light
                           text-primary-medium px-3 py-1 rounded-full">
            {role} · {interviewType}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9090b0]">
            Question <span className="font-bold text-[#1a1a2e]">{currentQ}</span> of {totalQuestions}
          </span>
          <button
            onClick={() => {
              if (confirm("End this session? Your progress will be lost.")) {
                router.push("/dashboard");
              }
            }}
            className="text-[11px] font-semibold text-[#DC2626] bg-[#FEF2F2]
                       border border-[#FECACA] px-3 py-1.5 rounded-lg
                       hover:bg-[#FEE2E2] transition-colors duration-200
                       flex items-center gap-1.5"
          >
            <StopCircle size={12} />
            End
          </button>
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────── */}
      <div className="bg-white border-b border-[#ede8fb] px-5 sm:px-8 pb-3 pt-1">
        <div className="h-1 bg-[#ede8fb] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-medium rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-5 sm:px-8 py-8 gap-6">

        {/* Previous answer — faded, shown briefly after submit */}
        {showPrevAnswer && history.length > 0 && (
          <div className="flex gap-3 items-start opacity-40">
            <div className="w-8 h-8 rounded-full bg-secondary-light border border-secondary-medium/30
                            flex items-center justify-center flex-shrink-0
                            text-[9px] font-bold text-secondary-dark">
              YOU
            </div>
            <div className="bg-secondary-light border border-secondary-medium/20
                            rounded-[18px_4px_18px_18px] px-4 py-3 max-w-lg">
              <p className="text-xs text-secondary-dark leading-relaxed line-clamp-2">
                {history[history.length - 1].answer}
              </p>
            </div>
          </div>
        )}

        {/* AI question bubble */}
        <div className="flex gap-3 items-start">

          {/* AI avatar */}
          <div className="w-9 h-9 rounded-full bg-primary-medium flex items-center justify-center
                          flex-shrink-0 text-xs font-bold text-white">
            AI
          </div>

          {/* Bubble */}
          <div className="bg-white border border-[#ede8fb] rounded-[4px_18px_18px_18px]
                          px-5 py-4 max-w-xl shadow-sm shadow-primary-medium/5">

            {aiLoading ? (
              /* Typing animation */
              <div className="flex items-center gap-1.5 py-1">
                {["bg-primary-medium", "bg-tertiary-medium", "bg-secondary-medium"].map((c, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${c} animate-bounce`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            ) : (
              <>
                <p className="text-[10px] font-semibold text-primary-medium uppercase
                               tracking-widest mb-2">
                  Question {currentQ}
                </p>
                <p className="text-sm sm:text-base text-[#1a1a2e] leading-relaxed">
                  {question}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Answer input — pushed to bottom ───────── */}
        <div className="mt-auto">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
            Your Answer
          </p>

          <div className={`bg-white rounded-2xl border transition-all duration-200
                           ${answer.length > 0
                             ? "border-primary-medium shadow-md shadow-primary-medium/8"
                             : "border-[#ede8fb]"
                           }`}>
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={handleAnswerChange}
              onKeyDown={handleKeyDown}
              disabled={aiLoading || submitting}
              placeholder={aiLoading ? "Waiting for question..." : "Type your answer here..."}
              rows={5}
              className="w-full px-5 pt-4 pb-2 text-sm text-[#1a1a2e] bg-transparent
                         border-none outline-none resize-none leading-relaxed
                         placeholder:text-[#c0c0d8] disabled:cursor-wait font-body"
            />

            <div className="flex items-center justify-between px-5 pb-4 pt-2
                            border-t border-[#f0ecfd]">
              <span className="text-[10px] text-[#c0c0d8]">
                {answer.length > 0
                  ? `${answer.trim().split(/\s+/).filter(Boolean).length} words`
                  : "↵ Enter to submit · Shift+Enter for new line"
                }
              </span>

              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || aiLoading || submitting}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold
                            transition-all duration-200
                            ${answer.trim() && !aiLoading && !submitting
                              ? "bg-primary-medium hover:bg-primary-dark text-white hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25"
                              : "bg-[#f0ecfd] text-[#c0b8e8] cursor-not-allowed"
                            }`}
              >
                {submitting ? "Sending..." : currentQ === totalQuestions ? "Finish" : "Submit"}
                <SendHorizonal size={13} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
