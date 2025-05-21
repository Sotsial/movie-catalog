"use client";

import { MovieList } from "@/components/movies/MovieList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Мои избранные фильмы</h1>
        {favorites.length > 0 && (
          <Button
            variant="outline"
            onClick={clearFavorites}
            className="w-full sm:w-auto"
          >
            {" "}
            {/* Добавил адаптивную ширину для кнопки */}
            Очистить избранное
          </Button>
        )}
      </div>

      {favorites.length > 0 ? (
        <MovieList movies={favorites} />
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground mb-4">
            У вас пока нет избранных фильмов.
          </p>
          <Button asChild>
            <Link href="/">Найти фильмы</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
