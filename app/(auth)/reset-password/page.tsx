"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

const MIN_PASSWORD_LENGTH = 6;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  // null = still checking the recovery session from the emailed link
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // The browser client exchanges the ?code in the URL for a session on init;
    // getSession() resolves once that has finished.
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Already signed in via the recovery link; the (main) layout routes
    // users without a group to /groups/new.
    router.push("/tonight");
    router.refresh();
  }

  return (
    <AuthShell>
      <h1 className="text-3xl font-display text-foreground mb-1">Set a new password</h1>
      <p className="text-muted text-sm mb-6">Choose a new password for your account.</p>

      {hasSession === null && <p className="text-muted text-sm">Verifying link...</p>}

      {hasSession === false && (
        <div className="space-y-4">
          <p className="text-red-400 text-sm">
            This reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="text-sm text-gold hover:underline">
            Request a new link
          </Link>
        </div>
      )}

      {hasSession && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-wide text-muted mb-1.5">
              NEW PASSWORD
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
          </div>

          <div>
            <label className="block text-xs tracking-wide text-muted mb-1.5">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-hover text-background font-medium rounded-lg py-3 transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
