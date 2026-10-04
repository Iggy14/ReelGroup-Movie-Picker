"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SuggestionWithVotes } from "@/lib/votes";
import type { GroupMember } from "@/lib/group";
import type { DecideSession, DecidePick } from "@/lib/decide";
import FaceOff from "@/components/decide/FaceOff";
import WaitingRoom from "@/components/decide/WaitingRoom";

interface DecideNowClientProps {
  session: DecideSession;
  suggestions: SuggestionWithVotes[];
  members: GroupMember[];
  currentUserId: string;
  initialPicks: DecidePick[];
}

export default function DecideNowClient({
  session,
  suggestions,
  members,
  currentUserId,
  initialPicks,
}: DecideNowClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const alreadyPicked = initialPicks.some((p) => p.userId === currentUserId);
  const [hasPicked, setHasPicked] = useState(alreadyPicked);

  useEffect(() => {
    if (session.status === "resolved" && session.winnerSuggestionId) {
      router.push("/tonight");
    }
  }, [session.status, session.winnerSuggestionId, router]);

  async function handleWinner(winner: SuggestionWithVotes) {
    await supabase.from("decide_picks").upsert(
      { session_id: session.id, user_id: currentUserId, suggestion_id: winner.id },
      { onConflict: "session_id,user_id" }
    );
    setHasPicked(true);
  }

  if (hasPicked) {
    return <WaitingRoom members={members} picks={initialPicks} currentUserId={currentUserId} />;
  }

  return <FaceOff suggestions={suggestions} onWinner={handleWinner} />;
}