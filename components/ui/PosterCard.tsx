import Image from "next/image";
import type { ReactNode } from "react";

interface PosterCardProps {
  title: string;
  year: number;
  genre: string;
  posterUrl: string;
  rating?: number;
  overview?: string;
  suggestedByName?: string;
  size?: "sm" | "md" | "lg";
  badge?: ReactNode;
  footer?: ReactNode;
  avatars?: ReactNode;
  /** Makes the card clickable (poster + text); the footer keeps its own controls. */
  onSelect?: () => void;
  /** Poster only, for layouts that show the text details beside the card. */
  posterOnly?: boolean;
  /** Preload the poster — set on the above-the-fold (LCP) image only. */
  priority?: boolean;
}

// md fills half the row on phones (parent grids use gap-4 below sm); lg is capped to the viewport.
const sizeClasses = {
  sm: "w-[160px]",
  md: "w-[calc(50%-0.5rem)] sm:w-[220px]",
  lg: "w-full max-w-[340px] md:w-[340px]",
};

export default function PosterCard({
  title, year, genre, posterUrl, rating, overview, suggestedByName,
  size = "md", badge, footer, avatars, onSelect, posterOnly, priority,
}: PosterCardProps) {
  const selectable = onSelect
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick: onSelect,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onSelect();
          }
        },
        "aria-label": `View details for ${title}`,
      }
    : {};

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 group`}>
      <div
        {...selectable}
        className={`relative aspect-[2/3] rounded-lg overflow-hidden bg-surface border border-surface-border transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/40 group-hover:border-gold/40 ${onSelect ? "cursor-pointer" : ""}`}
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 40vw, 220px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">No poster</div>
        )}

        {badge && <div className="absolute top-2 left-2">{badge}</div>}

        {footer && (
          <div
            className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/95 to-transparent cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {footer}
          </div>
        )}
      </div>

      {!posterOnly && <div className={`mt-2 ${onSelect ? "cursor-pointer" : ""}`} onClick={onSelect}>
        <h3 className="font-display text-foreground leading-tight truncate transition-colors duration-200 group-hover:text-gold">
          {title}
        </h3>
        <p className="text-sm text-muted">{year} &middot; {genre}</p>
        <div className="flex items-center justify-between mt-1">
          {rating !== undefined && <span className="text-sm text-gold">★ {rating.toFixed(1)}</span>}
          {avatars}
        </div>
        {overview && <p className="text-xs text-muted mt-1.5 line-clamp-2">{overview}</p>}
        {suggestedByName && (
          <p className="text-xs text-gold/80 mt-1">Suggested by {suggestedByName}</p>
        )}
      </div>}
    </div>
  );
}