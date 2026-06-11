import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  
  const code       = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type       = searchParams.get("type");
  const error      = searchParams.get("error");

  // Handle errors
  if (error) {
    const errorDescription = searchParams.get("error_description") ?? "Something went wrong";
    return NextResponse.redirect(
      `${origin}/auth?error=${encodeURIComponent(errorDescription)}`
    );
  }

  const supabase = await createClient();

  // OAuth flow (Google, GitHub) — exchanges code for session
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  // Email confirmation flow — exchanges token hash for session
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any });
    
    if (error) {
      return NextResponse.redirect(
        `${origin}/auth?error=${encodeURIComponent(error.message)}`
      );
    }

    return NextResponse.redirect(`${origin}/auth?verified=true`);  
  }
  // Fallback
  return NextResponse.redirect(`${origin}/auth`);
}
