"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { MovieShort } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  movie: Pick<MovieShort, "imdbID" | "Title" | "Year" | "Poster" | "Type">;
}

export function FavoriteButton({ movie }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const currentlyFavorite = isFavorite(movie.imdbID);

  const handleToggleFavorite = () => {
    if (currentlyFavorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Type: movie.Type,
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleFavorite}
      aria-label={
        currentlyFavorite ? "Удалить из избранного" : "Добавить в избранное"
      }
    >
      <Heart
        className={`h-5 w-5 ${
          currentlyFavorite
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground"
        }`}
      />
    </Button>
  );
}
