const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const TMDB_GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

export interface TmdbSearchResult {
  tmdbId: number;
  title: string;
  year: number | null;
  posterUrl: string | null;
  overview: string;
  rating: number;
  genre: string;
}

interface TmdbApiMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

export async function searchMovies(query: string): Promise<TmdbSearchResult[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error("TMDB_API_KEY is not set");

  const url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    query
  )}&include_adult=false&language=en-US&page=1`;

  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);

  const data: { results: TmdbApiMovie[] } = await response.json();

  return data.results.map((movie) => ({
    tmdbId: movie.id,
    title: movie.title,
    year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
    overview: movie.overview,
    rating: movie.vote_average,
    genre: movie.genre_ids.map((id) => TMDB_GENRES[id]).filter(Boolean).slice(0, 2).join(", "),
  }));
}