// app/api/interview/evaluate/route.ts
// Called after the last answer is submitted
// Sends all Q&A to Gemini, gets back structured scores and feedback
// Saves everything to DB and marks session as completed

import { createClient } from "@/lib/supabase/server";
import { gemini } from "@/lib/ai/gemini";
import { NextRequest, NextResponse } from "next/server";

interface QAPair {
  question:       string;
  answer:         string;
  timeToFirstKey: number;
  answerDuration: number;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, role, level, type, history }: {
      sessionId: string;
      role:      string;
      level:     string;
      type:      string;
      history:   QAPair[];
    } = await request.json();

    // Build evaluation prompt
    const qaText = history.map((h, i) =>
      `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}\nTime to start: ${Math.round(h.timeToFirstKey / 1000)}s | Answer duration: ${Math.round(h.answerDuration / 1000)}s`
    ).join("\n\n");

    const prompt = `
You are an expert interviewer evaluating a ${level} ${role} candidate in a ${type} interview.

Here are all the questions and answers:

${qaText}

Evaluate the candidate thoroughly and respond with ONLY a valid JSON object in exactly this structure, no markdown, no explanation, just the raw JSON:

{
  "overallScore": <number 0-100>,
  "verdict": "<one sentence summary of the candidate's
