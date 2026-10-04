"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PosterCard from "@/components/ui/PosterCard";
import Badge from "@/components/ui/Badge";
import type { SuggestionWithVotes } from "@/lib/votes";

interface VoteCardProps {
  suggestion: SuggestionWithVotes;
  currentUserId: string;
  memberCount: number;
  groupId: string;
  watchedUserIds: string[];
  suggestedByName?: string;
}

type OptimisticVote = "up" | "down" | "none" | null;

export default function VoteCard({
  suggestion,
  currentUserId,
  memberCount,
  groupId,
  watchedUserIds,
  suggestedByName,
}: VoteCardProps) {
  const [supabase] = useState(() => createClient());

  const [optimisticVote, setOptimisticVote] = useState<OptimisticVote>(null);
  const [optimisticIWatched, setOptimisticIWatched] = useState<boolean | null>(
    null
  );

  const serverVote = suggestion.votes.find((v) => v.userId === currentUserId)
    ?.value;
  const serverIWatched = watchedUserIds.includes(currentUserId);

  // Only clear our optimistic override once the actual server-refreshed
  // props confirm the change - NOT just because some realtime event fired.
  // Clearing any earlier races against router.refresh() still fetching
  // updated props, which briefly shows stale data and flickers.
  useEffect(() => {
    if (optimisticVote === null) return;
    const target = optimisticVote === "none" ? undefined : optimisticVote;
    if (serverVote === target) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptimisticVote(null);
    }
  }, [serverVote, optimisticVote]);

  useEffect(() => {
    if (optimisticIWatched === null) return;
    if (serverIWatched === optimisticIWatched) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptimisticIWatched(null);
    }
  }, [serverIWatched, optimisticIWatched]);

  const displayVote: "up" | "down" | undefined =
    optimisticVote === null
      ? serverVote
      : optimisticVote === "none"
        ? undefined
        : optimisticVote;

  const iWatched = optimisticIWatched ?? serverIWatched;

  let upCount = suggestion.votes.filter((v) => v.value === "up").length;
  let downCount = suggestion.votes.filter((v) => v.value === "down").length;

  if (optimisticVote !== null) {
    if (serverVote === "up") upCount -= 1;
    if (serverVote === "down") downCount -= 1;
    if (optimisticVote === "up") upCount += 1;
    if (optimisticVote === "down") downCount += 1;
  }

  const watchedCount =
    optimisticIWatched === null
      ? watchedUserIds.length
      : optimisticIWatched
        ? watchedUserIds.length + (serverIWatched ? 0 : 1)
        : watchedUserIds.length - (serverIWatched ? 1 : 0);

  const badgeText =
    upCount === downCount && upCount > 0
      ? `${upCount}-${downCount} Split`
      : `${upCount}/${memberCount} Want This`;

  async function handleVote(value: "up" | "down") {
    const removing = displayVote === value;
    setOptimisticVote(removing ? "none" : value);

    if (removing) {
      await supabase
        .from("votes")
        .delete()
        .eq("suggestion_id", suggestion.id)
        .eq("user_id", currentUserId);
    } else {
      await supabase.from("votes").upsert(
        {
          suggestion_id: suggestion.id,
          user_id: currentUserId,
          value,
        },
        { onConflict: "suggestion_id,user_id" }
      );
    }
  }

  async function handleToggleWatched() {
    const nextValue = !iWatched;
    setOptimisticIWatched(nextValue);

    if (!nextValue) {
      await supabase
        .from("watched_by")
        .delete()
        .eq("group_id", groupId)
        .eq("movie_id", suggestion.movie.id)
        .eq("user_id", currentUserId);
    } else {
      await supabase.from("watched_by").upsert(
        {
          group_id: groupId,
          movie_id: suggestion.movie.id,
          user_id: currentUserId,
        },
        { onConflict: "group_id,movie_id,user_id" }
      );
    }
  }

  return (
    <PosterCard
      title={suggestion.movie.title}
      year={suggestion.movie.year ?? 0}
      genre={suggestion.movie.genre ?? ""}
      posterUrl={suggestion.movie.posterUrl ?? ""}
      rating={suggestion.movie.rating ?? undefined}
      badge={<Badge>{badgeText}</Badge>}
      overview={suggestion.movie.overview ?? undefined}
      suggestedByName={suggestedByName}
      footer={
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleVote("up")}
              className={`flex items-center gap-1.5 text-sm transition-all duration-150 active:scale-90 ${
                displayVote === "up"
                  ? "text-gold"
                  : "text-foreground/70 hover:text-gold"
              }`}
            >
              <ThumbsUp
                className="w-4 h-4"
                fill={displayVote === "up" ? "currentColor" : "none"}
              />
              {upCount}
            </button>
            <button
              onClick={() => handleVote("down")}
              className={`flex items-center gap-1.5 text-sm transition-all duration-150 active:scale-90 ${
                displayVote === "down"
                  ? "text-gold"
                  : "text-foreground/70 hover:text-gold"
              }`}
            >
              <ThumbsDown
                className="w-4 h-4"
                fill={displayVote === "down" ? "currentColor" : "none"}
              />
              {downCount}
            </button>
          </div>

          <button
            onClick={handleToggleWatched}
            className={`w-full flex items-center justify-center gap-1.5 text-xs rounded py-1.5 transition-all duration-150 active:scale-95 ${
              iWatched
                ? "bg-gold/20 text-gold border border-gold/40"
                : "bg-background/60 text-foreground/70 border border-surface-border hover:border-gold/40"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            {iWatched ? "Watched" : "Mark as Watched"}
            {watchedCount > 0 && ` (${watchedCount}/${memberCount})`}
          </button>
        </div>
      }
    />
  );
}