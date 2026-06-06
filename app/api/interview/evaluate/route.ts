// app/api/interview/evaluate/route.ts
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
You are an expert interviewer evaluating a ${level} ${role} candidate in a ${type} interview.

Here are all the questions and answers:

${qaText}

Evaluate the candidate and respond with ONLY a valid JSON object in exactly this structure, no markdown, no explanation, just raw JSON:

{
  "overallScore": <number 0-100>,
  "verdict": "<one sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "answers": [
    {
      "orderNum": <question number>,
      "score": <number 0-100>,
      "feedback": "<2-3 sentence specific feedback>"
    }
  ]
}

Scoring guidelines:
- Consider answer quality, depth, and relevance
- Factor in response confidence (time to first key) — longer hesitation slightly lowers score
- Factor in fluency (words per second from answer duration)
- Be honest but constructive
- Overall score should reflect weighted average
    `.trim();

    const result  = await gemini.generateContent(prompt);
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
