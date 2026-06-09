// app/api/interview/evaluate/route.ts
import { createClient } from "@/lib/supabase/server";
import { geminiEval } from "@/lib/ai/gemini";
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

    const qaText = history.map((h, i) =>
      `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}\nTime to start: ${Math.round(h.timeToFirstKey / 1000)}s | Answer duration: ${Math.round(h.answerDuration / 1000)}s`
    ).join("\n\n");

    const prompt = `
      Evaluate this ${level} ${role} ${type} interview. Return ONLY raw JSON, no markdown.

      ${qaText}

      JSON structure:
      {"overallScore":<0-100>,"verdict":"<one sentence>","strengths":["x","x","x"],"weaknesses":["x","x","x"],"answers":[{"orderNum":<n>,"score":<0-100>,"feedback":"<2 sentences>"}]}

      Score on: answer quality, depth, relevance, confidence (time to first key), fluency (answer duration). Be honest and constructive.
    `.trim();

    const result  = await geminiEval.generateContent(prompt);
    const rawText = result.response.text().trim();

    let evaluation;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      evaluation = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", rawText);
      return NextResponse.json(
        { message: "Failed to parse evaluation" },
        { status: 500 }
      );
    }

    // Update each question with score and feedback
    for (const answer of evaluation.answers) {
      await supabase
        .from("questions")
        .update({
          answer_text:       history[answer.orderNum - 1].answer,
          score:             answer.score,
          feedback:          answer.feedback,
          time_to_first_key: history[answer.orderNum - 1].timeToFirstKey,
          answer_duration:   history[answer.orderNum - 1].answerDuration,
        })
        .eq("session_id", sessionId)
        .eq("order_num",  answer.orderNum);
    }

    // Update session with overall results
    const { error: sessionError } = await supabase
      .from("sessions")
      .update({
        score:      evaluation.overallScore,
        verdict:    evaluation.verdict,
        strengths:  evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        completed:  true,
      })
      .eq("id", sessionId);

    if (sessionError) {
      console.error("Session update error:", sessionError);
      return NextResponse.json(
        { message: "Failed to save evaluation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
