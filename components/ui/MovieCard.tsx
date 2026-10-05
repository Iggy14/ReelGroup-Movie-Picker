"use client";

import { useState, type ReactNode } from "react";
import PosterCard from "@/components/ui/PosterCard";
import MovieDetailsModal from "@/components/ui/MovieDetailsModal";

export interface MovieCardItem {
  id: string;
  title: string;
  year: number | null;
  genre: string | null;
  posterUrl: string | null;
  rating: number | null;
  overview?: string | null;
  suggestedByName?: string;
  reason?: string | null;
}

interface MovieCardProps {
  movie: MovieCardItem;
  size?: "sm" | "md" | "lg";
  badge?: ReactNode;
  posterOnly?: boolean;
  priority?: boolean;
}

// Read-only movie card: click opens the shared details modal.
// Use this from server components; cards with controls (VoteCard) wire the modal themselves.
export default function MovieCard({ movie, size, badge, posterOnly, priority }: MovieCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PosterCard
        title={movie.title}
        year={movie.year ?? 0}
        genre={movie.genre ?? ""}
        posterUrl={movie.posterUrl ?? ""}
        rating={movie.rating ?? undefined}
        overview={movie.overview ?? undefined}
        suggestedByName={movie.suggestedByName}
        size={size}
        badge={badge}
        posterOnly={posterOnly}
        priority={priority}
        onSelect={() => setOpen(true)}
      />
      <MovieDetailsModal
        movie={{ ...movie, overview: movie.overview ?? null }}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
