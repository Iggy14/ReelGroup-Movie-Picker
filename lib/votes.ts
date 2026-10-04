import { createClient } from "@/lib/supabase/server";

export interface SuggestionWithVotes {
  id: string;
  reason: string | null;
  isAiSuggested: boolean;
  status: string;
  suggestedBy: string;
  movie: {
    id: string;
    tmdbId: number;
    title: string;
    year: number | null;
    genre: string | null;
    posterUrl: string | null;
    rating: number | null;
    overview: string | null;
  };
  votes: { userId: string; value: "up" | "down" }[];
}

export function getTopSuggestion(
  suggestions: SuggestionWithVotes[]
): SuggestionWithVotes | null {
  if (suggestions.length === 0) return null;

  return [...suggestions].sort((a, b) => {
    const netA = a.votes.filter((v) => v.value === "up").length - a.votes.filter((v) => v.value === "down").length;
    const netB = b.votes.filter((v) => v.value === "up").length - b.votes.filter((v) => v.value === "down").length;
    if (netB !== netA) return netB - netA;
    return b.votes.length - a.votes.length;
  })[0];
}

export async function getGroupSuggestions(groupId: string): Promise<SuggestionWithVotes[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suggestions")
    .select(
      `
      id, reason, is_ai_suggested, status, suggested_by,
      movie:movies ( id, tmdb_id, title, year, genre, poster_url, rating, overview ),
      votes ( user_id, value )
    `
    )
    .eq("group_id", groupId)
    .eq("status", "voting")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch suggestions:", error);
    return [];
  }

  return data.map((row) => {
    const movie = Array.isArray(row.movie) ? row.movie[0] : row.movie;
    return {
      id: row.id,
      reason: row.reason,
      isAiSuggested: row.is_ai_suggested,
      status: row.status,
      suggestedBy: row.suggested_by,
      movie: {
        id: movie.id,
        tmdbId: movie.tmdb_id,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        posterUrl: movie.poster_url,
        rating: movie.rating,
        overview: movie.overview,
      },
      votes: row.votes.map((v) => ({ userId: v.user_id, value: v.value })),
    };
  });
}

export async function getTonightsPickOverride(
  groupId: string
): Promise<SuggestionWithVotes | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suggestions")
    .select(
      `
      id, reason, is_ai_suggested, status, suggested_by,
      movie:movies ( id, tmdb_id, title, year, genre, poster_url, rating, overview ),
      votes ( user_id, value )
    `
    )
    .eq("group_id", groupId)
    .eq("status", "tonights_pick")
    .maybeSingle();

  if (error || !data) return null;

  const movie = Array.isArray(data.movie) ? data.movie[0] : data.movie;

  return {
    id: data.id,
    reason: data.reason,
    isAiSuggested: data.is_ai_suggested,
    status: data.status,
    suggestedBy: data.suggested_by,
    movie: {
      id: movie.id,
      tmdbId: movie.tmdb_id,
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      posterUrl: movie.poster_url,
      rating: movie.rating,
      overview: movie.overview,
    },
    votes: data.votes.map((v: { user_id: string; value: "up" | "down" }) => ({
      userId: v.user_id,
      value: v.value,
    })),
  };
}