"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewGroupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getDisplayName() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return (
      (user.user_metadata?.display_name as string | undefined) ??
      user.email ??
      "Member"
    );
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const displayName = await getDisplayName();

    if (!displayName) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error: rpcError } = await supabase.rpc("create_group_with_owner", {
      group_name: groupName,
      owner_display_name: displayName,
    });

    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    router.push("/tonight");
    router.refresh();
  }

  async function handleJoinGroup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const displayName = await getDisplayName();

    if (!displayName) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error: rpcError } = await supabase.rpc("join_group_by_invite_code", {
      code: inviteCode.trim().toUpperCase(),
      joiner_display_name: displayName,
    });

    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    router.push("/tonight");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <form onSubmit={handleCreateGroup}>
          <h1 className="text-3xl font-display text-foreground mb-1">
            Create Your Group
          </h1>
          <p className="text-muted text-sm mb-6">
            Give your group a name — you can invite friends after.
          </p>

          <input
            type="text"
            placeholder="e.g. Friday Night Crew"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className="w-full bg-surface border border-surface-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gold hover:bg-gold-hover text-background font-medium rounded-lg py-3 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-surface-border" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-surface-border" />
        </div>

        <form onSubmit={handleJoinGroup}>
          <p className="text-sm text-foreground mb-1">Have an invite code?</p>
          <p className="text-xs text-muted mb-3">
            Join a friend&apos;s watchlist instead of starting your own.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="REEL-XXXX-XXXX"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="flex-1 bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={loading || !inviteCode}
              className="border border-surface-border hover:border-gold text-foreground text-sm font-medium rounded-lg px-4 transition-colors disabled:opacity-50"
            >
              Join
            </button>
          </div>
        </form>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </main>
  );
}