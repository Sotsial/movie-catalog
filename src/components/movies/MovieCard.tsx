"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovieShort } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";

interface MovieCardProps {
  movie: MovieShort;
}

export function MovieCard({ movie }: MovieCardProps) {
  const placeholderImage = "/placeholder.png";

  const truncatePlot = (
    text?: string,
    maxLength: number = 70
  ): string | undefined => {
    if (!text) return undefined;
    if (text.length <= maxLength) return text;
    return text.substring(0, text.lastIndexOf(" ", maxLength)) + "...";
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <CardHeader className="p-0">
        <AspectRatio ratio={2 / 3}>
          <Link
            href={`/movie/${movie.imdbID}`}
            className="block w-full h-full relative"
          >
            <Image
              src={movie.Poster === "N/A" ? placeholderImage : movie.Poster}
              alt={`Постер фильма ${movie.Title}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
              unoptimized={
                movie.Poster !== "N/A" &&
                movie.Poster?.includes("m.media-amazon.com")
              }
              sizes="(min-width: 1280px) calc(20vw - 18px), (min-width: 1024px) calc(25vw - 18px), (min-width: 768px) calc(33.33vw - 14px), (min-width: 640px) calc(50vw - 12px), calc(50vw - 12px)"
            />
          </Link>
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-3 flex-grow flex flex-col">
        <Link href={`/movie/${movie.imdbID}`} className="block mb-1">
          <CardTitle className="text-base hover:text-primary transition-colors leading-tight line-clamp-2">
            {movie.Title}
          </CardTitle>
        </Link>
        <p className="text-xs text-muted-foreground mb-1.5">
          {movie.Year} ({movie.Type})
        </p>

        {movie.Plot && (
          <p className="text-xs text-muted-foreground mb-1.5 leading-snug flex-grow line-clamp-3">
            {truncatePlot(movie.Plot)}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div>
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <div className="flex items-center text-xs">
                <span className="font-semibold">{movie.imdbRating}</span>
                <span className="text-muted-foreground">/10 IMDb</span>
              </div>
            )}
          </div>
          <div>
            <FavoriteButton movie={movie} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
