"use client";

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

export default function SignupPage() {
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <AuthShell>
        <h1 className="text-3xl font-display text-foreground mb-2">
          Check your email
        </h1>
        <p className="text-muted">
          We sent a confirmation link to{" "}
          <span className="text-foreground">{email}</span>. Click it to
          activate your account, then sign in.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-3xl font-display text-foreground mb-1">Create account</h1>
      <p className="text-muted text-sm mb-6">Start deciding what to watch, together.</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs tracking-wide text-muted mb-1.5">
            DISPLAY NAME
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
            />
          </div>
        </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold hover:bg-gold-hover text-background font-medium rounded-lg py-3 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}