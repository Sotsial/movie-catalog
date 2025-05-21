"use client";

import { Button } from "@/components/ui/button";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { MovieShort } from "@/lib/types";
import { Spinner } from "../shared/Spinner";
import { MovieCard } from "./MovieCard";

interface MovieListProps {
  movies: MovieShort[];
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export function MovieList({
  movies,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: MovieListProps) {
  const lastElementRef = useInfiniteScroll({
    isLoading: !!isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage: fetchNextPage || (() => {}),
  });

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-4">
        {movies.map((movie, index) => {
          if (movies.length === index + 1 && hasNextPage && fetchNextPage) {
            return (
              <div
                ref={lastElementRef}
                key={`${movie.imdbID}-${index}-trigger`}
              >
                <MovieCard movie={movie} />
              </div>
            );
          }
          return <MovieCard movie={movie} key={`${movie.imdbID}-${index}`} />;
        })}
      </div>

      {isFetchingNextPage && (
        <div className="mt-6">
          <Spinner />
        </div>
      )}
      {hasNextPage && !isFetchingNextPage && fetchNextPage && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => fetchNextPage()} variant="outline">
            Загрузить еще
          </Button>
        </div>
      )}
    </>
  );
}
