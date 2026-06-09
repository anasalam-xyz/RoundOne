// Fetches session config — used by interview page to get role, level, type, count

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: session, error } = await supabase
    .from("sessions")
    .select("role, level, type, question_count, mode")
    .eq("id", id)
    .eq("user_id", user.id) // RLS double-check
    .single();

  if (error || !session) {
    return NextResponse.json({ message: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({
    role:          session.role,
    level:         session.level,
    type:          session.type,
    questionCount: session.question_count,
    mode:          session.mode,
  });
}
