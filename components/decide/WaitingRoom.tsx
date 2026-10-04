"use client";

import { Check } from "lucide-react";
import type { GroupMember } from "@/lib/group";
import type { DecidePick } from "@/lib/decide";

interface WaitingRoomProps {
  members: GroupMember[];
  picks: DecidePick[];
  currentUserId: string;
}

export default function WaitingRoom({ members, picks, currentUserId }: WaitingRoomProps) {
  const pickedUserIds = new Set(picks.map((p) => p.userId));

  return (
    <div className="text-center max-w-sm mx-auto">
      <h1 className="text-3xl font-display text-foreground">Waiting for everyone...</h1>
      <p className="text-muted mt-2">{picks.length}/{members.length} members have picked</p>

      <div className="mt-8 space-y-2">
        {members.map((member) => {
          const hasPicked = pickedUserIds.has(member.user_id);
          const isYou = member.user_id === currentUserId;

          return (
            <div key={member.id} className="flex items-center justify-between p-3 border border-surface-border rounded-lg bg-surface">
              <span className="text-foreground">
                {member.display_name}
                {isYou && <span className="text-gold text-xs ml-2">(You)</span>}
              </span>
              {hasPicked ? <Check className="w-4 h-4 text-gold" /> : <span className="text-xs text-muted">Picking...</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}