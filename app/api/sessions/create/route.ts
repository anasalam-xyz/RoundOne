// app/api/sessions/create/route.ts
// Creates a new interview session in the DB and returns the session ID
// Called from /interview/setup when user clicks "Start Interview"

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get setup choices from request body
    const { role, level, type, questionCount, mode } = await request.json();

    // Basic validation
    if (!role || !level || !type || !questionCount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create session row in DB
    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        role,
        level,
        type,
        question_count: questionCount,
        mode: mode ?? "text",
        completed: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Session create error:", error);
      return NextResponse.json(
        { message: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: session.id });

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
