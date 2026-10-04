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
}

const sizeClasses = { sm: "w-[160px]", md: "w-[220px]", lg: "w-[340px]" };

export default function PosterCard({
  title, year, genre, posterUrl, rating, overview, suggestedByName,
  size = "md", badge, footer, avatars,
}: PosterCardProps) {
  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 group`}>
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface border border-surface-border transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/40 group-hover:border-gold/40">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 40vw, 220px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">No poster</div>
        )}

        {badge && <div className="absolute top-2 left-2">{badge}</div>}

        {footer && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/95 to-transparent">
            {footer}
          </div>
        )}
      </div>

      <div className="mt-2">
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
      </div>
    </div>
  );
}