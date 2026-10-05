"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export interface MovieDetails {
  title: string;
  year: number | null;
  genre: string | null;
  posterUrl: string | null;
  rating: number | null;
  overview: string | null;
  suggestedByName?: string;
  reason?: string | null;
}

interface MovieDetailsModalProps {
  movie: MovieDetails;
  open: boolean;
  onClose: () => void;
  /** Extra content under the details, e.g. vote buttons. */
  actions?: ReactNode;
}

// Uses the native <dialog>: focus trapping, Escape-to-close and the
// blurred ::backdrop come from the browser.
export default function MovieDetailsModal({ movie, open, onClose, actions }: MovieDetailsModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const genres = movie.genre ? movie.genre.split(",").map((g) => g.trim()).filter(Boolean) : [];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] bg-transparent p-0 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-md"
    >
      <div className="relative flex flex-col sm:flex-row gap-5 sm:gap-8 max-h-[90vh] overflow-y-auto rounded-xl border border-surface-border bg-surface p-5 sm:p-8 shadow-2xl shadow-black/60">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-muted hover:text-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative aspect-[2/3] w-40 sm:w-60 flex-shrink-0 self-center sm:self-start rounded-lg overflow-hidden bg-background border border-surface-border">
          {movie.posterUrl ? (
            <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" sizes="240px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">No poster</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl sm:text-3xl text-foreground pr-6">{movie.title}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted">
            {movie.year ? <span>{movie.year}</span> : null}
            {movie.rating != null && <span className="text-gold">★ {movie.rating.toFixed(1)}</span>}
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {genres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full border border-gold/40 text-xs text-gold">
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className={`mt-4 leading-relaxed ${movie.overview ? "text-foreground/80" : "text-muted italic"}`}>
            {movie.overview || "No description available."}
          </p>

          {movie.reason && (
            <p className="text-foreground/60 italic mt-4">&ldquo;{movie.reason}&rdquo;</p>
          )}
          {movie.suggestedByName && (
            <p className="text-xs text-gold/80 mt-3">Suggested by {movie.suggestedByName}</p>
          )}

          {actions && <div className="mt-6">{actions}</div>}
        </div>
      </div>
    </dialog>
  );
}
