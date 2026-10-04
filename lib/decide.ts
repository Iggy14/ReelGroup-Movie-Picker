import { createClient } from "@/lib/supabase/server";
import type { SuggestionWithVotes } from "@/lib/votes";

export interface DecideSession {
  id: string;
  groupId: string;
  candidateIds: string[];
  status: "active" | "resolved";
  winnerSuggestionId: string | null;
}

export interface DecidePick {
  userId: string;
  suggestionId: string;
}

export async function getSuggestionsByIds(ids: string[]): Promise<SuggestionWithVotes[]> {
  if (ids.length === 0) return [];

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
    .in("id", ids);

  if (error || !data) return [];

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
      votes: row.votes.map((v: { user_id: string; value: "up" | "down" }) => ({
        userId: v.user_id,
        value: v.value,
      })),
    };
  });
}

export async function startOrGetDecideSession(
  groupId: string,
  candidateIds: string[]
): Promise<DecideSession | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("start_or_get_decide_session", {
    p_group_id: groupId,
    p_candidate_ids: candidateIds,
  });

  if (error || !data) {
    console.error("Failed to start decide session:", error);
    return null;
  }

  return {
    id: data.id,
    groupId: data.group_id,
    candidateIds: data.candidate_ids,
    status: data.status,
    winnerSuggestionId: data.winner_suggestion_id,
  };
}

export async function getSessionPicks(sessionId: string): Promise<DecidePick[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("decide_picks")
    .select("user_id, suggestion_id")
    .eq("session_id", sessionId);

  return (data ?? []).map((row) => ({
    userId: row.user_id,
    suggestionId: row.suggestion_id,
  }));
}