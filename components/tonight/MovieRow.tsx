import MovieCard, { type MovieCardItem } from "@/components/ui/MovieCard";

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: MovieCardItem[];
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
        <div className="flex gap-4 sm:gap-6 flex-wrap mt-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
