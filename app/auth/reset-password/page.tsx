"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  const inputClass = `
    w-full border border-[#ede8fb] rounded-xl px-4 py-3 text-sm
    text-[#1a1a2e] bg-[#fafaf9] placeholder:text-[#c0c0d8]
    focus:outline-none focus:border-primary-medium focus:bg-white
    transition-colors duration-200
  `;

  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs font-semibold text-primary-medium uppercase tracking-widest mb-2">
            Reset password
          </p>
          <h1 className="font-display text-3xl font-semibold text-[#1a1a2e] mb-2">
            Set a new password
          </h1>
          <p className="text-sm text-[#9090b0]">
            Must be at least 8 characters.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-[#9090b0] hover:text-primary-medium transition-colors duration-200"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                text-[#9090b0] hover:text-primary-medium transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA]
                          rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-medium hover:bg-primary-dark disabled:opacity-60
                       text-white text-sm font-semibold py-3.5 rounded-xl
                       transition-all duration-200 hover:-translate-y-px
                       hover:shadow-lg hover:shadow-primary-medium/25"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
