"use client";

import { useState } from "react";
import type { SuggestionWithVotes } from "@/lib/votes";
import MovieDetailsModal from "@/components/ui/MovieDetailsModal";

interface FaceOffProps {
  suggestions: SuggestionWithVotes[];
  onWinner: (winner: SuggestionWithVotes) => void;
}

export default function FaceOff({ suggestions, onWinner }: FaceOffProps) {
  const [round, setRound] = useState<SuggestionWithVotes[]>(suggestions);
  const [nextRound, setNextRound] = useState<SuggestionWithVotes[]>([]);
  const [pairIndex, setPairIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [details, setDetails] = useState<SuggestionWithVotes | null>(null);

  const totalRounds = Math.ceil(Math.log2(suggestions.length));

  const contenderA = round[pairIndex * 2];
  const contenderB = round[pairIndex * 2 + 1];
  const isBye = contenderA && !contenderB;

  function choose(winner: SuggestionWithVotes) {
    setDetails(null);
    const updatedNextRound = [...nextRound, winner];

    if (pairIndex + 1 < Math.ceil(round.length / 2)) {
      setNextRound(updatedNextRound);
      setPairIndex(pairIndex + 1);
      return;
    }

    if (updatedNextRound.length === 1) {
      onWinner(updatedNextRound[0]);
      return;
    }

    setRound(updatedNextRound);
    setNextRound([]);
    setPairIndex(0);
    setRoundNumber((r) => r + 1);
  }

  if (isBye) {
    choose(contenderA);
    return null;
  }

  if (!contenderA || !contenderB) {
    return <p className="text-muted">Not enough movies to decide between.</p>;
  }

  return (
    <div className="text-center">
      <p className="text-xs tracking-widest text-gold uppercase">
        Round {roundNumber} of {totalRounds}
      </p>
      <h1 className="text-4xl font-display text-foreground mt-2">Decide Now</h1>
      <p className="text-muted mt-1">Pick your favorite from each pair</p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-10">
        {[contenderA, contenderB].map((contender, i) => (
        <div key={contender.id} className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="w-[200px] sm:w-[260px]">
              <div
                role="button"
                tabIndex={0}
                aria-label={`View details for ${contender.movie.title}`}
                onClick={() => setDetails(contender)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setDetails(contender)}
                className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface border border-surface-border cursor-pointer hover:border-gold/40 transition-colors"
              >
                {contender.movie.posterUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={contender.movie.posterUrl} alt={contender.movie.title} className="w-full h-full object-cover" />
                )}
              </div>
              <h2
                onClick={() => setDetails(contender)}
                className="text-2xl font-display text-foreground mt-3 cursor-pointer hover:text-gold transition-colors"
              >{contender.movie.title}</h2>
              <p className="text-sm text-muted mt-1">
                {contender.movie.year} · {contender.movie.genre || "Unknown genre"}
              </p>
              <button
                onClick={() => choose(contender)}
                className="w-full mt-4 bg-gold hover:bg-gold-hover text-background font-medium rounded-lg py-3 transition-colors"
              >
                Choose This
              </button>
            </div>
            {i === 0 && (
          <span className="text-3xl font-display text-gold rotate-90 md:rotate-0">VS</span>
  )}
          </div>
        ))}
      </div>

      {details && (
        <MovieDetailsModal
          movie={{ ...details.movie, reason: details.reason }}
          open
          onClose={() => setDetails(null)}
          actions={
            <button
              onClick={() => choose(details)}
              className="w-full bg-gold hover:bg-gold-hover text-background font-medium rounded-lg py-3 transition-colors"
            >
              Choose This
            </button>
          }
        />
      )}

      <button disabled className="mt-10 text-sm text-muted cursor-not-allowed">
        ✨ Split Decision? Let AI Decide — coming soon
      </button>
    </div>
  );
}