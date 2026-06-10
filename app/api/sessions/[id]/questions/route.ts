import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { data: questions } = await supabase
    .from("questions")
    .select("question_text, answer_text, time_to_first_key, answer_duration")
    .eq("session_id", id)
    .not("answer_text", "is", null)  // only answered questions
    .order("order_num", { ascending: true });

  return NextResponse.json({ questions: questions ?? [] });
}
