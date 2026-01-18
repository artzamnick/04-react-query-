import axios from "axios";
import type { Movie } from "../types/movie";

export interface SearchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export async function fetchMovies(query: string, page: number): Promise<SearchMoviesResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

  if (!token) {
    throw new Error("VITE_TMDB_TOKEN is missing. Check your .env and restart dev server.");
  }

  const { data } = await tmdbApi.get<SearchMoviesResponse>("/search/movie", {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  
  return data;
}
