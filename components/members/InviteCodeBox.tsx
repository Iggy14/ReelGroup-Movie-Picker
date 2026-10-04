"use client";

import { useState } from "react";
import { Users, Check, Copy } from "lucide-react";

interface InviteCodeBoxProps {
  inviteCode: string;
}

export default function InviteCodeBox({ inviteCode }: InviteCodeBoxProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border border-gold/30 rounded-lg p-4 bg-gold/5">
      <div className="flex gap-3 items-start">
        <Users className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-foreground">Invite someone new</p>
          <p className="text-xs text-muted mt-0.5">
            Share this code and they&apos;ll join your watchlist instantly.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <code className="flex-1 bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground tracking-wider">
          {inviteCode}
        </code>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-gold hover:bg-gold-hover text-background text-sm font-medium rounded-lg px-4 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}