// Shows all past interview sessions with stats and filtering
// Server component for data fetching, client component for filter interactivity

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Fetch all completed sessions, newest first
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, role, level, type, score, question_count, created_at")
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("created_at", { ascending: false });

  const allSessions = sessions ?? [];

  // Compute stats
  const total    = allSessions.length;
  const avgScore = total > 0
    ? Math.round(allSessions.reduce((sum, s) => sum + (s.score ?? 0), 0) / total)
    : 0;
  const bestScore = total > 0
    ? Math.max(...allSessions.map((s) => s.score ?? 0))
    : 0;

  return (
    <HistoryClient
      sessions={allSessions}
      total={total}
      avgScore={avgScore}
      bestScore={bestScore}
    />
  );
}
