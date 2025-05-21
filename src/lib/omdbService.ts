import { MovieDetails, SearchResults } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

interface SearchParams {
  s: string; // Title
  page?: string;
  type?: "movie" | "series" | "episode";
  y?: string;
}

function toQueryParams(params: SearchParams): URLSearchParams {
  const query: Record<string, string> = {};

  if (params.s) query.s = params.s;
  if (params.page) query.page = params.page;
  if (params.type) query.type = params.type;
  if (params.y) query.y = params.y;

  return new URLSearchParams(query);
}

// Общий поиск филмов
export const searchMovies = async (
  params: SearchParams
): Promise<SearchResults | { Error: string; Response: "False" }> => {
  const queryParams = toQueryParams(params);
  try {
    const response = await fetch(`${BASE_URL}&${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return {
      Error:
        error instanceof Error
          ? error.message
          : "Unknown error fetching movies",
      Response: "False",
    };
  }
};

// Поиск фильма по ImdbId
export const getMovieDetailsById = async (
  id: string
): Promise<MovieDetails | { Error: string; Response: "False" }> => {
  if (!API_KEY) {
    console.error("OMDB API Key is not defined.");
    return { Error: "OMDB API Key is not configured", Response: "False" };
  }
  try {
    const response = await fetch(`${BASE_URL}&i=${id}&plot=short`);
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Failed to fetch movie details for ID ${id} from OMDb:`,
      error
    );
    return {
      Error:
        error instanceof Error
          ? error.message
          : `Unknown error fetching OMDb movie ID ${id}`,
      Response: "False",
    };
  }
};
