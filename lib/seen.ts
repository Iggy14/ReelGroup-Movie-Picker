import { createClient } from "@/lib/supabase/server";

export interface SeenMovie {
  id: string;
  movie: {
    id: string;
    title: string;
    year: number | null;
    genre: string | null;
    posterUrl: string | null;
    rating: number | null;
  };
}

export async function getGroupSeen(groupId: string): Promise<SeenMovie[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suggestions")
    .select(
      `
      id,
      movie:movies (
        id,
        title,
        year,
        genre,
        poster_url,
        rating
      )
    `
    )
    .eq("group_id", groupId)
    .eq("status", "watched")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch seen movies:", error);
    return [];
  }

  return data.map((row) => {
    const movie = Array.isArray(row.movie) ? row.movie[0] : row.movie;
    return {
      id: row.id,
      movie: {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        posterUrl: movie.poster_url,
        rating: movie.rating,
      },
    };
  });
}