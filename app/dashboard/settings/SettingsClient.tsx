// Handles all settings interactivity profile update, password change, sign out, delete account

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  userId:      string;
  email:       string;
  name:        string;
  memberSince: string;
}

// Generates initials from a name string
function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}

// Formats a date string to "Month Year","2025-06-01" → "June 2025"
function formatMemberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year:  "numeric",
  });
}

export default function SettingsClient({ userId, email, name, memberSince }: Props) {
  const router   = useRouter();
  const supabase = createClient();

  const [displayName,    setDisplayName]    = useState(name);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg,     setProfileMsg]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword,  setCurrentPassword]  = useState("");
  const [newPassword,      setNewPassword]      = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");
  const [passwordLoading,  setPasswordLoading]  = useState(false);
  const [passwordMsg,      setPasswordMsg]      = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleProfileSave() {
    if (!displayName.trim()) return;
    setProfileLoading(true);
    setProfileMsg(null);

    const { error } = await supabase
      .from("profiles")
      .update({ name: displayName.trim() })
      .eq("id", userId);

    if (error) {
      setProfileMsg({ type: "error", text: "Failed to update profile. Please try again." });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    }

    setProfileLoading(false);
  }

  async function handlePasswordChange() {
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords don't match." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    setPasswordLoading(true);

    // Supabase requires re-signing in to verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setPasswordMsg({ type: "error", text: "Current password is incorrect." });
      setPasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMsg({ type: "error", text: "Failed to update password. Please try again." });
    } else {
      setPasswordMsg({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setPasswordLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);

    // Delete via API route ,client can't call admin functions directly
    const res = await fetch("/api/account/delete", { method: "DELETE" });

    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      setDeleteLoading(false);
      setDeleteConfirm(false);
      alert("Failed to delete account. Please try again.");
    }
  }

  // Shared input class
  const inputClass = `
    w-full border border-[#ede8fb] rounded-xl px-4 py-3 text-sm
    text-[#1a1a2e] bg-[#fafaf9] placeholder:text-[#c0c0d8]
    focus:outline-none focus:border-primary-medium focus:bg-white
    transition-colors duration-200 disabled:bg-[#f7f5ff]
    disabled:text-[#9090b0] disabled:cursor-not-allowed
  `;

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <div className="bg-white rounded-2xl border border-[#ede8fb] p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-4">Profile</h2>
          <p className="text-xs text-[#9090b0]">Update your display name and account info</p>
        </div>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#f0ecfd]">
          <div className="w-14 h-14 rounded-full bg-tertiary-light border-2 border-tertiary-medium
                          flex items-center justify-center flex-shrink-0
                          text-lg font-bold text-tertiary-medium">
            {getInitials(displayName || name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a2e]">{displayName || name || "—"}</p>
            <p className="text-xs text-[#9090b0] mt-0.5">
              Member since {formatMemberSince(memberSince)}
            </p>
          </div>
        </div>

        {profileMsg && (
          <div className={`text-xs px-4 py-2.5 rounded-xl mb-4 border
            ${profileMsg.type === "success"
              ? "text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]"
              : "text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]"
            }`}>
            {profileMsg.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className={inputClass}
            />
            <p className="text-[10px] text-[#9090b0] mt-1.5">
              Email cannot be changed here.
            </p>
          </div>
        </div>

        <button
          onClick={handleProfileSave}
          disabled={profileLoading || !displayName.trim()}
          className="mt-6 bg-tertiary-medium hover:bg-tertiary-dark disabled:opacity-60
                     text-white text-sm font-semibold px-6 py-2.5 rounded-xl
                     transition-all duration-200 hover:-translate-y-px
                     hover:shadow-lg hover:shadow-tertiary-medium/25
                     disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {profileLoading ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#ede8fb] p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="font-display text-xl font-semibold text-[#1a1a2e] mb-1">Change Password</h2>
          <p className="text-xs text-[#9090b0]">Use a strong password you don't use elsewhere</p>
        </div>

        {passwordMsg && (
          <div className={`text-xs px-4 py-2.5 rounded-xl mb-4 border
            ${passwordMsg.type === "success"
              ? "text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]"
              : "text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]"
            }`}>
            {passwordMsg.text}
          </div>
        )}

        <div className="space-y-4">
          {[
            { label: "Current Password",  value: currentPassword,  setter: setCurrentPassword, showPassword: showCurrentPassword, setShowPassword: setShowCurrentPassword},
            { label: "New Password",      value: newPassword,      setter: setNewPassword, showPassword: showNewPassword, setShowPassword: setShowNewPassword},
            { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword, showPassword: showConfirmPassword, setShowPassword: setShowConfirmPassword},
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-[10px] font-semibold text-[#9090b0] uppercase tracking-widest mb-2">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={field.showPassword ? "text" : "password"}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => field.setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-[#9090b0] hover:text-primary-medium transition-colors duration-200"
                >
                  {field.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
          className="mt-6 bg-tertiary-medium hover:bg-tertiary-dark disabled:opacity-60
                     text-white text-sm font-semibold px-6 py-2.5 rounded-xl
                     transition-all duration-200 hover:-translate-y-px
                     hover:shadow-lg hover:shadow-primary-medium/25
                     disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {passwordLoading ? "Updating..." : "Update password"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#FECACA] p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="font-display text-xl font-semibold text-[#DC2626] mb-1">Danger Zone</h2>
          <p className="text-xs text-[#9090b0]">These actions are permanent and cannot be undone</p>
        </div>

        <div className="space-y-3">

          <div className="flex items-center justify-between py-3 border-b border-[#f0ecfd]">
            <div>
              <p className="text-sm font-semibold text-[#1a1a2e]">Sign out</p>
              <p className="text-xs text-[#9090b0]">Sign out of your account on this device</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs font-semibold text-[#DC2626] bg-[#FEF2F2]
                         border border-[#FECACA] px-4 py-2 rounded-xl
                         hover:bg-[#FEE2E2] transition-colors duration-200 flex-shrink-0"
            >
              Sign out
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-[#1a1a2e]">Delete account</p>
              <p className="text-xs text-[#9090b0] pr-2">Permanently delete your account and all sessions</p>
            </div>

            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-xs font-semibold text-white bg-[#DC2626]
                           px-4 py-2 rounded-xl hover:bg-[#991B1B]
                           transition-all duration-200 hover:-translate-y-px flex-shrink-0"
              >
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-[#DC2626] font-medium">Sure?</span>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="text-xs font-semibold text-white bg-[#DC2626]
                             px-3 py-1.5 rounded-lg hover:bg-[#991B1B]
                             transition-colors duration-200 disabled:opacity-60"
                >
                  {deleteLoading ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="text-xs font-semibold text-[#5a5a7a] bg-[#f7f5ff]
                             border border-[#ede8fb] px-3 py-1.5 rounded-lg
                             hover:border-primary-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
