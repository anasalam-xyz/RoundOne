// Live interview session - supports both text and voice modes
// Voice mode: auto-speaks questions, mic button fills textarea via Web Speech API
// Text mode: original behavior unchanged

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { SendHorizonal, StopCircle, Mic, MicOff, Volume2, Sparkles } from "lucide-react";

interface QAPair {
  question:       string;
  answer:         string;
  timeToFirstKey: number;
  answerDuration: number;
}

interface SessionConfig {
  role:          string;
  level:         string;
  type:          string;
  questionCount: number;
  mode:          "text" | "voice";
  answeredCount: number;
}

type RecordingState = "idle" | "recording" | "processing";

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

  //Session config 
  const [sessionConfig,  setSessionConfig]  = useState<SessionConfig | null>(null);

  //Core interview stat
  const [currentQ,       setCurrentQ]       = useState(1);
  const [question,       setQuestion]       = useState("");
  const [answer,         setAnswer]         = useState("");
  const [history,        setHistory]        = useState<QAPair[]>([]);
  const [aiLoading,      setAiLoading]      = useState(true);
  const [submitting,     setSubmitting]     = useState(false);
  const [analyzing,      setAnalyzing]      = useState(false);
  const [analyzeMsg,     setAnalyzeMsg]     = useState(ANALYZING_MESSAGES[0]);
  const [showPrevAnswer, setShowPrevAnswer] = useState(false);

  //Voice state
  const [recordingState,   setRecordingState]   = useState<RecordingState>("idle");
  const [voiceSupported,   setVoiceSupported]   = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  const [questionError, setQuestionError] = useState(false);

  const recognitionRef = useRef<any>(null);

  //Silent time tracking
  const questionRenderedAt = useRef<number>(0);
  const firstKeyAt         = useRef<number>(0);
  const hasTyped           = useRef(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasFetchedRef = useRef(false);

  //Check voice support on mount
  useEffect(() => {
    const supported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    setVoiceSupported(supported);
  }, []);

  //Fetch session config
  useEffect(() => {
    async function fetchSession() {
      const res  = await fetch(`/api/sessions/${id}`);
      const data = await res.json();
      setSessionConfig(data);
    }
    fetchSession();
  }, [id]);

  //Start interview once config is loaded
  useEffect(() => {
    if (sessionConfig && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      if (sessionConfig.answeredCount > 0) {
      // resume interview:  fetch answered Q&As from DB and rebuild history
        resumeSession();
      } 
      else {
        fetchNextQuestion([]);
      }    
    }
  }, [sessionConfig]);

  //Cycle analyzing messages
  useEffect(() => {
    if (!analyzing) return;
    let i = 1;
    const interval = setInterval(() => {
      setAnalyzeMsg(ANALYZING_MESSAGES[i % ANALYZING_MESSAGES.length]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, [analyzing]);

  //Auto-speak question in voice mode
  useEffect(() => {
    if (!question || !sessionConfig || sessionConfig.mode !== "voice") return;
    speakQuestion(question);
  }, [question, sessionConfig]);

  //Text to speech
  function speakQuestion(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // stop any ongoing speech
    const utterance  = new SpeechSynthesisUtterance(text);
    utterance.rate   = 0.9;
    utterance.pitch  = 1;
    utterance.lang   = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  async function resumeSession() {
    if (!sessionConfig) return;

    const rebuiltHistory: QAPair[] = sessionConfig.answeredQuestions.map((q: any) => ({
      question:       q.question_text,
      answer:         q.answer_text,
      timeToFirstKey: q.time_to_first_key ?? 0,
      answerDuration: q.answer_duration ?? 0,
    }));

    setHistory(rebuiltHistory);
    setCurrentQ(rebuiltHistory.length + 1);
    fetchNextQuestion(rebuiltHistory);
  } 
  //Fetch next question
  async function fetchNextQuestion(prevHistory: QAPair[]) {
    setAiLoading(true);
    setQuestionError(false);
    setQuestion("");
    setShowPrevAnswer(false);
    setAnswer("");
    setInterimTranscript("");

    if (!sessionConfig) return;

    try {
      const res = await fetch("/api/interview/question", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId:      id,
          role:           sessionConfig.role,
          type:           sessionConfig.type,
          level:          sessionConfig.level,
          questionNumber: prevHistory.length + 1,
          totalQuestions: sessionConfig.questionCount,
          history:        prevHistory,
        }),
      });

      const data = await res.json();
      setQuestion(data.question);
      setAiLoading(false);

      questionRenderedAt.current = Date.now();
      firstKeyAt.current         = 0;
      hasTyped.current           = false;

      // Auto-focus textarea in text mode
      if (sessionConfig.mode === "text") {
        setTimeout(() => textareaRef.current?.focus(), 100);
      }

    } catch (err) {
      console.error("Failed to fetch question:", err);
      setAiLoading(false);
      setQuestionError(true);
    }
  }

  //Voice recording
  function startRecording() {
    if (!voiceSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognition.lang           = "en-US";

    recognition.onstart = () => setRecordingState("recording");

    recognition.onresult = (e: any) => {
      let interim = "";
      let final   = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        // Track first keystroke equivalent for voice
        if (!hasTyped.current) {
          firstKeyAt.current = Date.now();
          hasTyped.current   = true;
        }
        setAnswer((prev) => (prev + " " + final).trim());
        setInterimTranscript("");
      }
    };

    recognition.onend = () => {
      setRecordingState("idle");
      setInterimTranscript("");
    };

    recognition.onerror = (e: any) => {
      console.error("Speech recognition error:", e.error);
      setRecordingState("idle");
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordingState("processing");
    }
  }

  function toggleRecording() {
    if (recordingState === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  }

  //Track first keystroke (text mode)
  function handleAnswerChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(e.target.value);
    if (!hasTyped.current && e.target.value.length > 0) {
      firstKeyAt.current = Date.now();
      hasTyped.current   = true;
    }
  }

  //Submit answer
  async function handleSubmit() {
    if (!answer.trim() || submitting || aiLoading || !sessionConfig) return;

    // Stop any ongoing speech when submitting
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    setSubmitting(true);

    const timeToFirstKey = firstKeyAt.current
      ? firstKeyAt.current - questionRenderedAt.current : 0;
    const answerDuration = firstKeyAt.current
      ? Date.now() - firstKeyAt.current : 0;

    const newPair: QAPair = {
      question,
      answer: answer.trim(),
      timeToFirstKey,
      answerDuration,
    };

    const updatedHistory = [...history, newPair];
    setHistory(updatedHistory);
    setAnswer("");
    setInterimTranscript("");
    setSubmitting(false);
    setShowPrevAnswer(true);

    if (currentQ >= sessionConfig.questionCount) {
      setAnalyzing(true);
      await runFinalEvaluation(updatedHistory);
      return;
    }

    setCurrentQ((q) => q + 1);
    fetchNextQuestion(updatedHistory);
  }

  //Final evaluation
  async function runFinalEvaluation(finalHistory: QAPair[]) {
    if (!sessionConfig) return;
    try {
      await fetch("/api/interview/evaluate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: id,
          role:      sessionConfig.role,
          level:     sessionConfig.level,
          type:      sessionConfig.type,
          history:   finalHistory,
        }),
      });
      router.push(`/results/${id}`);
    } catch (err) {
      console.error("Evaluation failed:", err);
    }
  }

  //Enter to submit (text mode only)
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  //Loading state
  if (!sessionConfig) {
    return (
      <div className="min-h-screen bg-[#f7f5ff] flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-[#9090b0]">
          <div className="w-4 h-4 rounded-full border-2 border-primary-medium
                          border-t-transparent animate-spin" />
          Loading session...
        </div>
      </div>
    );
  }

  const progress    = ((currentQ - 1) / sessionConfig.questionCount) * 100;
  const isVoiceMode = sessionConfig.mode === "voice";

  //Analyzing screen
  if (analyzing) {
    return (
      <div className="min-h-screen bg-[#f7f5ff] font-body flex flex-col">
        <div className="bg-white border-b border-[#ede8fb] h-14 px-6 flex items-center gap-3 flex-shrink-0">
          <span className="text-base font-bold">
            <span className="text-secondary-medium">Round</span>
            <span className="text-tertiary-medium">One</span>
          </span>
          <span className="text-[10px] font-semibold bg-primary-light text-primary-medium px-3 py-1 rounded-full">
            {sessionConfig.role} · {sessionConfig.type}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary-medium/20
                            animate-[ping_1.5s_ease-in-out_infinite]" />
            <div className="w-16 h-16 rounded-full bg-primary-light border border-primary-medium/20
                            flex items-center justify-center">
                <Sparkles />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1a1a2e] mb-2">
              Analyzing your answers
            </h2>
            <p className="text-sm text-[#9090b0] max-w-sm leading-relaxed">
              Gemini is reviewing all {sessionConfig.questionCount} responses and building
              your personalized feedback report.
            </p>
          </div>

          <div
            key={analyzeMsg}
            className="text-xs font-semibold text-primary-medium bg-primary-light
                       px-5 py-2 rounded-full animate-[fadeIn_0.4s_ease]"
          >
            {analyzeMsg}
          </div>

          <div className="flex items-center gap-2">
            {["bg-primary-medium", "bg-tertiary-medium", "bg-secondary-medium"].map((c, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${c} animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  //Main interview screen
  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body flex flex-col">

      <div className="bg-white border-b border-[#ede8fb] h-14 px-5 sm:px-8
                      flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold">
            <span className="text-secondary-medium">Round</span>
            <span className="text-tertiary-medium">One</span>
          </span>
          <span className="hidden sm:inline text-[10px] font-semibold bg-primary-light
                           text-primary-medium px-3 py-1 rounded-full">
            {sessionConfig.role} · {sessionConfig.type}
          </span>
          {isVoiceMode && (
            <span className="text-[10px] font-semibold bg-tertiary-light text-tertiary-dark
                             px-3 py-1 rounded-full flex items-center gap-1">
              <Mic size={10} />
              Voice
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9090b0]">
            Question <span className="font-bold text-[#1a1a2e]">{currentQ}</span> of {sessionConfig.questionCount}
          </span>
          <button
            onClick={() => {
              if (confirm("End this session? Your progress will be lost.")) {
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();
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

      <div className="bg-white border-b border-[#ede8fb] px-5 sm:px-8 pb-3 pt-1">
        <div className="h-1 bg-[#ede8fb] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-medium rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-5 sm:px-8 py-8 gap-6">

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

        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full bg-primary-medium flex items-center justify-center
                          flex-shrink-0 text-xs font-bold text-white">
            AI
          </div>

          <div className="bg-white border border-[#ede8fb] rounded-[4px_18px_18px_18px]
                          px-5 py-4 max-w-xl shadow-sm shadow-primary-medium/5 flex-1">
            {aiLoading ? (
            // typing dots
              <div className="flex items-center gap-1.5 py-1">
                {["bg-primary-medium", "bg-tertiary-medium", "bg-secondary-medium"].map((c, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${c} animate-bounce`}
                      style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
                  </div>
            ) : questionError ? (
                // error + retry
              <div className="flex items-center gap-3">
                <p className="text-xs text-[#DC2626]">Failed to load question.</p>
                <button
                  onClick={() => fetchNextQuestion(history)}
                  className="text-xs font-semibold text-primary-medium bg-primary-light
                  px-3 py-1.5 rounded-lg hover:bg-primary-medium hover:text-white
                  transition-all duration-200"
                >
                  Retry
                </button>
              </div>
            ) : (
              // normal question display
              <>
                <p className="text-[10px] font-semibold text-primary-medium uppercase tracking-widest mb-2">
                  Question {currentQ}
                </p>
                <p className="text-sm sm:text-base text-[#1a1a2e] leading-relaxed">
                  {question}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
            Your Answer
          </p>

          <div className={`bg-white rounded-2xl border transition-all duration-200
                           ${answer.length > 0 || interimTranscript
                             ? "border-primary-medium shadow-md shadow-primary-medium/8"
                             : "border-[#ede8fb]"
                           }`}>
            <textarea
              ref={textareaRef}
              value={answer + (interimTranscript ? ` ${interimTranscript}` : "")}
              onChange={handleAnswerChange}
              onKeyDown={handleKeyDown}
              disabled={aiLoading || submitting || recordingState === "recording"}
              placeholder={
                aiLoading
                  ? "Waiting for question..."
                  : isVoiceMode
                  ? recordingState === "recording"
                    ? "Listening..."
                    : "Click the mic to speak your answer..."
                  : "Type your answer here..."
              }
              rows={5}
              className={`w-full px-5 pt-4 pb-2 text-sm bg-transparent border-none
                          outline-none resize-none leading-relaxed font-body
                          disabled:cursor-wait
                          ${interimTranscript ? "text-[#9090b0]" : "text-[#1a1a2e]"}
                          placeholder:text-[#c0c0d8]`}
            />

            <div className="flex items-center justify-between px-5 pb-4 pt-2
                            border-t border-[#f0ecfd]">

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#c0c0d8]">
                  {answer.trim().split(/\s+/).filter(Boolean).length > 0
                    ? `${answer.trim().split(/\s+/).filter(Boolean).length} words`
                    : isVoiceMode ? "" : "↵ Enter to submit · Shift+Enter for new line"
                  }
                </span>

                {isVoiceMode && !voiceSupported && (
                  <span className="text-[10px] text-[#DC2626]">
                    Voice requires Chrome
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isVoiceMode && voiceSupported && (
                  <button
                    onClick={toggleRecording}
                    disabled={aiLoading || submitting}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center
                                transition-all duration-200 disabled:opacity-40
                                ${recordingState === "recording"
                                  ? "bg-[#DC2626] text-white animate-pulse"
                                  : recordingState === "processing"
                                  ? "bg-[#FFFBEB] text-[#D97706]"
                                  : "bg-primary-light text-primary-medium hover:bg-primary-medium hover:text-white"
                                }`}
                    title={recordingState === "recording" ? "Stop recording" : "Start recording"}
                  >
                    {recordingState === "recording"
                      ? <MicOff size={15} />
                      : <Mic size={15} />
                    }
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || aiLoading || submitting || recordingState === "recording"}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold
                              transition-all duration-200
                              ${answer.trim() && !aiLoading && !submitting && recordingState !== "recording"
                                ? "bg-primary-medium hover:bg-primary-dark text-white hover:-translate-y-px hover:shadow-lg hover:shadow-primary-medium/25"
                                : "bg-[#f0ecfd] text-[#c0b8e8] cursor-not-allowed"
                              }`}
                >
                  {submitting ? "Sending..." : currentQ === sessionConfig.questionCount ? "Finish" : "Submit"}
                  <SendHorizonal size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
