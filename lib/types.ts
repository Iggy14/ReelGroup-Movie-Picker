// Shared TypeScript types across the app

export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  year: number;
  genre: string;
  posterUrl: string;
  overview: string;
  rating: number;
  runtimeMinutes?: number;
}

export interface Group {
  id: string;
  name: string;
  memberIds: string[];
}

export interface Vote {
  id: string;
  movieId: string;
  userId: string;
  value: "up" | "down";
}
