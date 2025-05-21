import MovieDisplayArea from "@/components/movies/MovieDisplayArea";
import { getMovieDetailsById } from "@/lib/omdbService";
import { getPopularMovieIMDbIDsFromTMDB } from "@/lib/tmdbService";
import { MovieDetails, MovieShort } from "@/lib/types";

export const revalidate = 43200; // 12 часов

async function getInitialPopularMovies(
  count: number = 8
): Promise<MovieShort[]> {
  const popularIMDbIDs = await getPopularMovieIMDbIDsFromTMDB(count);

  if (!popularIMDbIDs || popularIMDbIDs.length === 0) {
    console.warn("No IMDb IDs returned from TMDB");
    return [];
  }

  const moviePromises = popularIMDbIDs.map((id) => getMovieDetailsById(id));

  const results = await Promise.allSettled(moviePromises);

  const initialMovies: MovieShort[] = results
    .filter(
      (result) =>
        result.status === "fulfilled" && result.value.Response === "True"
    )
    .map((result) => {
      const movieDetail = (result as PromiseFulfilledResult<MovieDetails>)
        .value;
      return {
        imdbID: movieDetail.imdbID,
        Title: movieDetail.Title,
        Year: movieDetail.Year,
        Poster:
          movieDetail.Poster !== "N/A"
            ? movieDetail.Poster
            : "/placeholder.png",
        Type: movieDetail.Type,
        Plot: movieDetail.Plot !== "N/A" ? movieDetail.Plot : undefined,
        imdbRating:
          movieDetail.imdbRating !== "N/A" ? movieDetail.imdbRating : undefined,
      };
    });

  return initialMovies;
}

export default async function HomePage() {
  const initialMovies = await getInitialPopularMovies(8);

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-3xl font-bold text-center">Поиск фильмов</h1>
      <MovieDisplayArea initialPopularMovies={initialMovies} />
    </div>
  );
}
