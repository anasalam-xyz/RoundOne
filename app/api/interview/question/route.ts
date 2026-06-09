// app/api/interview/question/route.ts
// Generates the next interview question based on conversation history
// Called from /interview/[id] after each answer is submitted

import { createClient } from "@/lib/supabase/server";
import { geminiQuestion } from "@/lib/ai/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, role, level, type, questionNumber, totalQuestions, history } =
      await request.json();

    // After verifying auth, before generating the question
// Save the previous answer if this isn't the first question
    if (history.length > 0) {
      const lastAnswer = history[history.length - 1];
      const lastOrderNum = history.length;

      await supabase
        .from("questions")
        .update({
          answer_text:       lastAnswer.answer,
          time_to_first_key: lastAnswer.timeToFirstKey,
          answer_duration:   lastAnswer.answerDuration,
        })
      .eq("session_id", sessionId)
      .eq("order_num",  lastOrderNum);
    }
    // Build the prompt
    const recentHistory = history.slice(-2);

    const historyText = history.length === 0
    ? "This is the first question."
    : recentHistory.map((h: { question: string; answer: string }) =>
        `Q: ${h.question}\nA: ${h.answer}`
      ).join("\n\n");
    const prompt = `
      You are interviewing a ${level} ${role} candidate. ${type} interview, question ${questionNumber} of ${totalQuestions}.

      Recent context:
      ${historyText}

      Ask the next interview question. One question only, no preamble, no numbering. Follow naturally from context. ${type === "technical" ? `Focus on ${role}-either a specific concept or real scenarios.` : type === "hr" ? "Focus on behavioural and situational questions." : "Alternate between technical and HR questions."}
    `.trim();
    const result = await geminiQuestion.generateContent(prompt);
    const question = result.response.text().trim();

    // check if question already exists for this order_num
    const { data: existing } = await supabase
      .from("questions")
      .select("id")
      .eq("session_id", sessionId)
      .eq("order_num", questionNumber)
      .single();

    // only insert if it doesn't already exist
    if (!existing) {
      await supabase
        .from("questions")
        .insert({
          session_id:    sessionId,
          question_text: question,
          order_num:     questionNumber,
        });
    }

    if (error) {
      console.error("Question insert error:", error);
    }

    return NextResponse.json({ question });

  } catch (err) {
    console.error("Question generation error:", err);
    return NextResponse.json(
      { message: "Failed to generate question" },
      { status: 500 }
    );
  }
}
