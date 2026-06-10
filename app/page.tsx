// Landing page. shown only to logged-out users
// Logged-in users are redirected to /dashboard from proxy.ts

import Image from "next/image";
import { ArrowRight, ArrowRightToLine, MoveRight, Settings2, BotMessageSquare, ChartColumn, BookHeart, PenLine, Timer, FileClock, UsersRound, Share2, TrendingUp} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-[#f7f5ff] min-h-screen font-body">
      <section className="max-w-6xl mx-auto px-10 md:px-12 pt-20 pb-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block bg-primary-light text-primary-medium text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            AI-Powered Interview Practice
          </span>

          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-[#1a1a2e] mb-4">
            Ace your next{" "}
            <em className="text-primary-medium not-italic">interview</em>{" "}
            with AI feedback
          </h1>

          <p className="text-[#5a5a7a] text-base leading-relaxed mb-8 max-w-md">
            Practice with a conversational AI interviewer. Get scored, get
            detailed feedback, and track your improvement over time.
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-fit">
            <Link href="/auth?mode=signup" className="inline-flex items-center group bg-primary-medium hover:bg-primary-dark text-white px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-medium/25">
              Start practicing free 
              <MoveRight size="16" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"/>
            </Link>
            <Link href="/about/#process" className="ml-4 md:ml-0 group inline-flex items-center hover:underline text-primary-medium text-sm font-medium flex items-center gap-1.5 group transition-all duration-200">
              See how it works
              <ArrowRight size="16" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"/>
            </Link>
          </div>
        </div>

        <div className="flex justify-center group">
          <div className="bg-white rounded-2xl border border-[#ede8fb] p-7 w-full md:w-72 animate-[float_3s_ease-in-out_infinite]">
            <Image src="/hero_bird.svg"
              className="h-auto w-fit"
              height={0} 
              width={0} 
              alt="hero image for round-one"
            />
            <div className="space-y-2 mb-4">
              {[
                { color: "#7C52D9", text: "Strong system design answers" },
                { color: "#E4669A", text: "Improve async/await explanation" },
                { color: "#4E86E4", text: "Good communication style" },
              ].map((item, i) => (
                <div key={i} className="group-hover:ml-1 ease-in-out transition-all duration-300 flex items-center gap-2 text-xs text-[#5a5a7a] py-1.5 border-b border-[#f0ecfd] last:border-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  {item.text}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[["10", "Questions"], ["8 min", "Duration"]].map(([num, lbl]) => (
                <div key={lbl} className="bg-primary-light rounded-xl p-2.5 text-center">
                  <p className="text-lg font-bold text-primary-medium">{num}</p>
                  <p className="text-[11px] text-[#9090b0] mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-[#ede8fb] bg-white px-10 md:px-12 py-5 flex items-center gap-8">
      </div>

      <section className="max-w-6xl mx-auto px-12 py-16">
        <p className="text-xs font-semibold text-tertiary-medium tracking-widest uppercase mb-2">How it works</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-3">Four steps to interview-ready</h2>
        <p className="text-[#5a5a7a] text-sm leading-relaxed mb-10 max-w-lg">
          From setup to score in minutes. Our AI adapts questions based on your answers — just like a real interviewer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: "01", icon: <Settings2/>, title: "Set up", desc: "Choose role, experience level, type, and number of questions." },
            { num: "02", icon: <BotMessageSquare/>, title: "Answer conversationally", desc: "AI asks follow-up questions based on your previous answers.", active: true },
            { num: "03", icon: <ChartColumn/>, title: "Get evaluated", desc: "Gemini AI scores every answer and spots patterns in your responses." },
            { num: "04", icon: <BookHeart/>, title: "Track progress", desc: "Dashboard shows score trends and improvement over time." },
          ].map((step) => (
            <div
              key={step.num}
              className={`rounded-2xl border p-6 cursor-default transition-all duration-250 group
                ${step.active
                  ? "bg-primary-medium border-primary-medium"
                  : "bg-white border-[#ede8fb] hover:border-primary-medium hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-medium/10"
                }`}
            >
              <p className={`text-[11px] font-semibold mb-3 tracking-wider ${step.active ? "text-white/50" : "text-[#c0b8e8]"}`}>
                {step.num}
              </p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg
                ${step.active ? "bg-white/20 text-white" : "bg-primary-light group-hover:bg-[#ede8fb] transition-colors"}`}>
                {step.icon}
              </div>
              <h4 className={`text-sm font-semibold mb-1.5 ${step.active ? "text-white" : "text-[#1a1a2e]"}`}>
                {step.title}
              </h4>
              <p className={`text-xs leading-relaxed ${step.active ? "text-white/70" : "text-[#7a7a9a]"}`}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-[#ede8fb] mx-12" />

      <section id="features" className="max-w-6xl mx-auto px-10 md:px-12 py-16">
        <p className="text-xs font-semibold text-tertiary-medium tracking-widest uppercase mb-2">Features</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-3">Everything you need to prepare</h2>
        <p className="text-[#5a5a7a] text-sm leading-relaxed mb-10 max-w-lg">
          Built specifically for developers preparing for technical and HR rounds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <BotMessageSquare/>, title: "Conversational AI", desc: "Questions adapt in real-time based on what you say — not a static question bank.", tag: "Gemini API", bg: "bg-primary-light", text: "text-primary-dark", hover: "hover:border-primary-medium hover:shadow-primary-medium/10" },
            { icon: <PenLine/>, title: "Per-answer scoring", desc: "Each answer gets its own score and detailed feedback, not just a final number.", tag: "Detailed", bg: "bg-secondary-light", text: "text-secondary-dark", hover: "hover:border-secondary-medium hover:shadow-secondary-medium/10" },
            { icon: <FileClock/>, title: "Session history", desc: "All past interviews saved. Review full Q&A and feedback anytime.", tag: "Dashboard", bg: "bg-primary-light", text: "text-primary-dark", hover: "hover:border-primary-medium hover:shadow-primary-medium/10" },
            { icon: <UsersRound/>, title: "Any role, any level", desc: "Not just a fixed list — type in any role. Fresher, mid, or senior. Technical, HR, or mixed.", tag: "Flexible", bg: "bg-secondary-light", text: "text-secondary-dark", hover: "hover:border-secondary-medium hover:shadow-secondary-medium/10" },
            { icon: <Share2/>, title: "Shareable results", desc: "Make your result public and share the link on LinkedIn or with recruiters.", tag: "One click", bg: "bg-tertiary-light", text: "text-tertiary-dark", hover: "hover:border-tertiary-medium hover:shadow-tertiary-medium/10" },
            { icon: <TrendingUp/>, title: "Track your progress", desc: "Score trend chart and session history show how much you've improved over time.", tag: "Dashboard", bg: "bg-primary-light", text: "text-primary-dark", hover: "hover:border-primary-medium hover:shadow-primary-medium/10" },
          ].map((feat) => (
            <div
              key={feat.title}
              className={`bg-white rounded-2xl border border-[#ede8fb] p-7 transition-all duration-250 ${feat.hover} hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center text-xl mb-4`}>
                {feat.icon}
              </div>
              <h4 className="text-sm font-semibold text-[#1a1a2e] mb-2">{feat.title}</h4>
              <p className="text-xs text-[#7a7a9a] leading-relaxed mb-4">{feat.desc}</p>
              <span className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full ${feat.bg} ${feat.text}`}>
                {feat.tag}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
