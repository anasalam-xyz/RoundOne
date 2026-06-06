// app/dashboard/settings/page.tsx
// Loads user profile server-side, passes to client component for interactivity

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Fetch profile name from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, created_at")
    .eq("id", user.id)
    .single();

  return (
    <SettingsClient
      userId={user.id}
      email={user.email ?? ""}
      name={profile?.name ?? ""}
      memberSince={profile?.created_at ?? user.created_at}
    />
  );
}
