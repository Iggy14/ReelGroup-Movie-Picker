"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import type { TmdbSearchResult } from "@/lib/tmdb";

interface MovieSearchInputProps {
  onSelect: (movie: TmdbSearchResult) => void;
}

export default function MovieSearchInput({ onSelect }: MovieSearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const skipNextSearch = useRef(false);

  // Debounced search - waits 400ms after typing stops before calling the API
  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }

    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search for a movie or show..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
        />
      </div>

      {loading && <p className="text-xs text-muted mt-2">Searching...</p>}

      {results.length > 0 && (
        <div className="mt-2 border border-surface-border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
          {results.map((movie) => (
            <button
              key={movie.tmdbId}
              type="button"
              onClick={() => {
                onSelect(movie);
                setResults([]);
                skipNextSearch.current = true;
                setQuery(movie.title);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-background transition-colors text-left border-b border-surface-border last:border-b-0"
            >
              <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-surface">
                {movie.posterUrl && (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                )}
              </div>
              <div>
                <p className="text-sm text-foreground">{movie.title}</p>
                <p className="text-xs text-muted">{movie.year ?? "Unknown year"}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}