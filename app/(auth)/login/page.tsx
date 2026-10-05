"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [inviteCode, setInviteCode] = useState("");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Could not log in.");
      setLoading(false);
      return;
    }

    const { data: membership } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", data.user.id)
      .limit(1)
      .maybeSingle();

    setLoading(false);

    router.push(membership ? "/tonight" : "/groups/new");
    router.refresh();
  }

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInviteMessage("Group invites are coming soon.");
  }

  return (
    <AuthShell>
      <h1 className="text-3xl font-display text-foreground mb-1">Welcome back</h1>
      <p className="text-muted text-sm mb-6">Sign in to your group watchlist.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs tracking-wide text-muted mb-1.5">
            EMAIL
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wide text-muted mb-1.5">
            PASSWORD
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-10 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-right mt-1.5">
            <Link href="/forgot-password" className="text-xs text-gold hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold hover:bg-gold-hover text-background font-medium rounded-lg py-3 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <form
        onSubmit={handleInviteSubmit}
        className="mt-6 border border-surface-border rounded-lg p-4"
      >
        <div className="flex gap-2 items-start">
          <Users className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground">Have a group invite?</p>
            <p className="text-xs text-muted mt-0.5">
              Paste your invite code to join a friend&apos;s watchlist directly.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="REEL-XXXX-XXXX"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="flex-1 bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="bg-gold hover:bg-gold-hover text-background text-sm font-medium rounded-lg px-4 transition-colors"
          >
            Join
          </button>
        </div>
        {inviteMessage && <p className="text-xs text-muted mt-2">{inviteMessage}</p>}
      </form>
    </AuthShell>
  );
}