// Handles making a result public and copying the share link
// Client component — needs onClick and Supabase client

"use client";

import { useState } from "react";
import { Share2, Check, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  sessionId: string;
  isPublic:  boolean;
}

export default function ShareButton({ sessionId, isPublic: initialIsPublic }: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [loading,  setLoading]  = useState(false);
  const [copied,   setCopied]   = useState(false);

  async function handleShare() {
    setLoading(true);
    const supabase = createClient();

    // If not already public, make it public first
    if (!isPublic) {
      const { error } = await supabase
        .from("sessions")
        .update({ is_public: true })
        .eq("id", sessionId);

      if (error) {
        console.error("Failed to make session public:", error);
        setLoading(false);
        return;
      }

      setIsPublic(true);
    }

    // Copy link to clipboard
    await navigator.clipboard.writeText(
      `${window.location.origin}/results/${sessionId}`
    );

    setCopied(true);
    setLoading(false);

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRevoke() {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("sessions")
      .update({ is_public: false })
      .eq("id", sessionId);

    if (!error) setIsPublic(false);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">

      <button
        onClick={handleShare}
        disabled={loading}
        className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl
                    border transition-all duration-200 disabled:opacity-60
                    ${copied
                      ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]"
                      : "bg-white border-[#ede8fb] text-[#5a5a7a] hover:border-primary-medium hover:text-primary-medium"
                    }`}
      >
        {copied
          ? <><Check size={13} /> Link copied!</>
          : loading
          ? <><Share2 size={13} /> Sharing...</>
          : <><Share2 size={13} /> {isPublic ? "Copy link" : "Share result"}</>
        }
      </button>

      {isPublic && !copied && (
        <button
          onClick={handleRevoke}
          disabled={loading}
          title="Make private again"
          className="flex items-center gap-1.5 text-[11px] font-medium text-[#9090b0]
                     hover:text-[#DC2626] transition-colors duration-200 disabled:opacity-60"
        >
          <Lock size={12} />
          Revoke
        </button>
      )}

    </div>
  );
}
