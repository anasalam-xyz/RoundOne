// app/api/account/delete/route.ts
// Deletes the user's account and all associated data
// Uses the service role key — only callable server-side

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const supabase = await createClient();

    // Verify the user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Admin client uses service role key — can delete auth users
    // Never expose SUPABASE_SERVICE_ROLE_KEY to the browser
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Delete the auth user — cascades to profiles, sessions, questions via DB foreign keys
    const { error } = await adminClient.auth.admin.deleteUser(user.id);

    if (error) {
      console.error("Delete user error:", error);
      return NextResponse.json({ message: "Failed to delete account" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
