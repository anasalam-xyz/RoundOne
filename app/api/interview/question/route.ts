// app/api/interview/question/route.ts
// Generates the next interview question based on conversation history
// Called from /interview/[id] after each answer is submitted

import { createClient } from "@/lib/supabase/server";
import { gemini } from "@/lib/ai/gemini";
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
    const historyText = history.length === 0
      ? "This is the first question."
      : history.map((h: { question: string; answer: string }, i: number) =>
          `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`
        ).join("\n\n");

    const prompt = `
You are a professional interviewer conducting a ${type} interview for a ${level} ${role} position.
This is question ${questionNumber} of ${totalQuestions}.

Previous conversation:
${historyText}

Generate the next interview question. Rules:
- Ask exactly ONE question
- Keep it concise and clear
- Make it conversational and follow naturally from previous answers if any
- For technical interviews: focus on ${role}-specific concepts, problem solving, real-world scenarios
- For HR interviews: focus on behavioural, situational, and culture fit questions
- For mixed: alternate between technical and HR
- Do NOT number the question
- Do NOT add any preamble or explanation, just the question itself
    `.trim();

    const result = await gemini.generateContent(prompt);
    const question = result.response.text().trim();

    // Save question to DB
    const { error } = await supabase
      .from("questions")
      .insert({
        session_id:    sessionId,
        question_text: question,
        order_num:     questionNumber,
      });

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
