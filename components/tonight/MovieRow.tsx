import PosterCard from "@/components/ui/PosterCard";

interface MovieRowItem {
  id: string;
  title: string;
  year: number | null;
  genre: string | null;
  posterUrl: string | null;
  rating: number | null;
  suggestedByName?: string;
}

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: MovieRowItem[];
  emptyText: string;
}

export default function MovieRow({ title, subtitle, movies, emptyText }: MovieRowProps) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-display text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}

      {movies.length === 0 ? (
        <p className="text-muted mt-4">{emptyText}</p>
      ) : (
        <div className="flex gap-6 flex-wrap mt-4">
          {movies.map((movie) => (
            <PosterCard
              key={movie.id}
              title={movie.title}
              year={movie.year ?? 0}
              genre={movie.genre ?? ""}
              posterUrl={movie.posterUrl ?? ""}
              rating={movie.rating ?? undefined}
              suggestedByName={movie.suggestedByName}
            />
          ))}
        </div>
      )}
    </section>
  );
}