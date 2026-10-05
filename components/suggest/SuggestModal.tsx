"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { TmdbSearchResult } from "@/lib/tmdb";
import MovieSearchInput from "@/components/suggest/MovieSearchInput";

interface SuggestModalProps {
  groupId: string;
  onClose: () => void;
}

export default function SuggestModal({ groupId, onClose }: SuggestModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [selectedMovie, setSelectedMovie] = useState<TmdbSearchResult | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAddToWatchlist() {
    if (!selectedMovie) return;

    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { data: movie, error: movieError } = await supabase
      .from("movies")
      .upsert(
        {
          tmdb_id: selectedMovie.tmdbId,
          title: selectedMovie.title,
          year: selectedMovie.year,
          poster_url: selectedMovie.posterUrl,
          overview: selectedMovie.overview,
          rating: selectedMovie.rating,
          genre: selectedMovie.genre,
        },
        { onConflict: "tmdb_id" }
      )
      .select()
      .single();

    if (movieError || !movie) {
      setError(movieError?.message ?? "Could not save movie.");
      setLoading(false);
      return;
    }

    const { error: suggestionError } = await supabase.from("suggestions").insert({
      group_id: groupId,
      movie_id: movie.id,
      suggested_by: user.id,
      reason: reason || null,
      status: "voting",
    });

    setLoading(false);

    if (suggestionError) {
      if (suggestionError.code === "23505") {
        setError("This movie has already been suggested to your group.");
      } else {
        setError(suggestionError.message);
      }
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 animate-fade-in">
    <div className="w-full max-w-md max-h-full overflow-y-auto bg-surface border border-surface-border rounded-xl p-6 animate-modal-in">
    <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-2xl font-display text-foreground">Suggest a Film</h2>
            <p className="text-sm text-muted">Recommend something to the group</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground w-8 h-8 flex items-center justify-center rounded-lg border border-surface-border"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5">
          <MovieSearchInput onSelect={setSelectedMovie} />
        </div>

        {selectedMovie && (
          <div className="mt-4 flex items-center gap-3 p-3 border border-surface-border rounded-lg">
            <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-background">
              {selectedMovie.posterUrl && (
                <Image
                  src={selectedMovie.posterUrl}
                  alt={selectedMovie.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              )}
            </div>
            <div>
              <p className="text-foreground">{selectedMovie.title}</p>
              <p className="text-sm text-muted">
                {selectedMovie.year ?? "Unknown year"} · ★ {selectedMovie.rating.toFixed(1)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-xs tracking-wide text-muted mb-1.5">
            WHY ARE YOU SUGGESTING THIS?
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Optional - give the group a reason to be excited"
            className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <button
          onClick={handleAddToWatchlist}
          disabled={!selectedMovie || loading}
          className="w-full mt-5 bg-gold hover:bg-gold-hover text-background font-medium rounded-lg py-3 transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add to Watchlist"}
        </button>

        <button
          disabled
          className="w-full mt-3 border border-surface-border rounded-lg py-3 text-sm text-muted cursor-not-allowed"
        >
          ✨ Surprise Us (AI Pick) — coming soon
        </button>
      </div>
    </div>
  );
}