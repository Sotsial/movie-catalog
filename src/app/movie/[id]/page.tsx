import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovieDetailsById } from "@/lib/omdbService";
import { MovieDetails } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Metadata } from "next";
import { FavoriteButton } from "@/components/movies/FavoriteButton";
import { DetailItem } from "@/components/movies/DetailItem";

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await paramsPromise;
  const id = params.id;
  const movie = await getMovieDetailsById(id);

  if (movie.Response === "False" || !movie.Title) {
    return {
      title: "Фильм не найден",
    };
  }

  return {
    title: `${movie.Title} (${movie.Year}) | MovieCatalog`,
    description: movie.Plot || `Детальная информация о фильме ${movie.Title}.`,
    openGraph: {
      title: `${movie.Title} (${movie.Year})`,
      description: movie.Plot || "",
      images: movie.Poster !== "N/A" ? [movie.Poster] : [],
      type: "video.movie",
    },
  };
}

export default async function MoviePage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  const movieId = params.id;
  const movie: MovieDetails | { Error: string; Response: "False" } =
    await getMovieDetailsById(movieId);

  if (movie.Response === "False") {
    notFound();
  }

  const movieData = movie as MovieDetails;
  const placeholderImage = "/placeholder.png";

  const detailsList = [
    { label: "Режиссёр", value: movieData.Director },
    { label: "Сценарист", value: movieData.Writer },
    { label: "Актёры", value: movieData.Actors },
    { label: "Язык", value: movieData.Language },
    { label: "Страна", value: movieData.Country },
    { label: "Награды", value: movieData.Awards },
    { label: "Студия", value: movieData.Production },
    { label: "Сборы", value: movieData.BoxOffice },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Image
            src={
              movieData.Poster === "N/A" ? placeholderImage : movieData.Poster
            }
            alt={`Постер фильма ${movieData.Title}`}
            width={500}
            height={750}
            className="rounded-lg shadow-lg w-full object-cover"
            priority
            unoptimized={
              movieData.Poster !== "N/A" &&
              movieData.Poster?.includes("m.media-amazon.com")
            }
          />
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {movieData.Title}
          </h1>
          <div className="text-muted-foreground mb-4">
            <span>{movieData.Year}</span>
            <span className="mx-2">•</span>
            <span>{movieData.Rated}</span>
            <span className="mx-2">•</span>
            <span>{movieData.Runtime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {movieData.Genre?.split(", ").map((genre) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            {movieData.imdbRating && movieData.imdbRating !== "N/A" && (
              <div className="flex items-center">
                <Star
                  className="h-5 w-5 text-yellow-400 mr-1"
                  fill="currentColor"
                />
                <span className="text-xl font-semibold">
                  {movieData.imdbRating}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  /10 ({movieData.imdbVotes} голосов)
                </span>
              </div>
            )}
            <FavoriteButton
              movie={{
                imdbID: movieData.imdbID,
                Title: movieData.Title,
                Year: movieData.Year,
                Poster: movieData.Poster,
                Type: movieData.Type,
              }}
            />
          </div>

          <h2 className="text-2xl font-semibold mb-2">Сюжет</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {movieData.Plot}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
            {detailsList.map((detail) => (
              <DetailItem
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>

          {movieData.Ratings && movieData.Ratings.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Другие рейтинги:</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {movieData.Ratings.map((rating) => (
                  <li key={rating.Source}>
                    {rating.Source}: {rating.Value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
