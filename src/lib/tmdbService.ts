const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface TMDBMovieListItem {
  id: number;
  title: string;
}

interface TMDBPopularMoviesResponse {
  page: number;
  results: TMDBMovieListItem[];
  total_pages: number;
  total_results: number;
}

interface TMDBExternalIdsResponse {
  imdb_id?: string | null;
}

export const getPopularMovieIMDbIDsFromTMDB = async (
  limit: number = 8
): Promise<string[]> => {
  if (!TMDB_API_KEY) {
    console.error("TMDB API Key is not defined.");
    return [];
  }
  try {
    // Фетч списка популярных
    const popularMoviesResponse = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    if (!popularMoviesResponse.ok) {
      throw new Error(
        `TMDB API error (popular movies): ${popularMoviesResponse.statusText}`
      );
    }
    const popularMoviesData: TMDBPopularMoviesResponse =
      await popularMoviesResponse.json();
    const imdbIds: string[] = [];
    // Не у всех есть imbdId поэтому запрос с запасом
    const moviesToConsider = popularMoviesData.results.slice(0, limit * 2);

    for (const tmdbMovie of moviesToConsider) {
      if (imdbIds.length >= limit) {
        break;
      }

      try {
        const externalIdsResponse = await fetch(
          `${TMDB_BASE_URL}/movie/${tmdbMovie.id}/external_ids?api_key=${TMDB_API_KEY}`
        );
        if (externalIdsResponse.ok) {
          const externalIdsData: TMDBExternalIdsResponse =
            await externalIdsResponse.json();
          if (
            externalIdsData.imdb_id &&
            externalIdsData.imdb_id.startsWith("tt")
          ) {
            imdbIds.push(externalIdsData.imdb_id);
          }
        } else {
          console.warn(
            `Error fetch TMDB movie  ${tmdbMovie.id}: ${externalIdsResponse.statusText}`
          );
        }
      } catch (error) {
        console.warn(`Error fetch TMDB movie  ${tmdbMovie.id}: ${error}`);
      }
    }

    return imdbIds.slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch", error);
    return [];
  }
};
