"use client";

import { searchMovies } from "@/lib/omdbService";
import { MovieShort } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Spinner } from "../shared/Spinner";
import { MovieList } from "./MovieList";
import { SearchBar } from "./SearchBar";

interface MovieDisplayAreaProps {
  initialPopularMovies: MovieShort[];
}

const MIN_SEARCH_LENGTH = 3; // Минимальная длина запроса

export default function MovieDisplayArea({
  initialPopularMovies,
}: MovieDisplayAreaProps) {
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [isQueryTooShortError, setIsQueryTooShortError] =
    useState<boolean>(false);

  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useInfiniteQuery({
    queryKey: ["searchMovies", currentSearchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        s: currentSearchQuery,
        page: pageParam.toString(),
      });

      const response = await fetch(`/api/search?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.Response === "False") {
        if (data.Error === "Movie not found!") {
          return {
            Search: [],
            totalResults: "0",
            Response: "True",
            Error: data.Error,
          };
        }
        throw new Error(data.Error || "Unknown API error");
      }
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage.Search.length === 0 &&
        lastPage.totalResults === "0" &&
        lastPage.Error === "Movie not found!"
      ) {
        return undefined;
      }
      const totalResults = parseInt(lastPage.totalResults, 10);
      const loadedCount = allPages.reduce(
        (acc, page) => acc + page.Search.length,
        0
      );
      if (loadedCount < totalResults) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled:
      !!currentSearchQuery &&
      currentSearchQuery.trim().length >= MIN_SEARCH_LENGTH &&
      showSearchResults,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    setCurrentSearchQuery(trimmedQuery);

    if (trimmedQuery === "") {
      setShowSearchResults(false);
      setIsQueryTooShortError(false);
    } else if (
      trimmedQuery.length > 0 &&
      trimmedQuery.length < MIN_SEARCH_LENGTH
    ) {
      setShowSearchResults(true);
      setIsQueryTooShortError(true);
    } else {
      setShowSearchResults(true);
      setIsQueryTooShortError(false);
    }
  };

  let moviesForList: MovieShort[] = [];
  if (showSearchResults) {
    if (!isQueryTooShortError && searchData?.pages) {
      moviesForList = searchData.pages.flatMap((page) => page.Search);
    }
  } else {
    moviesForList = initialPopularMovies;
  }

  const displayPopular = !showSearchResults && initialPopularMovies.length > 0;
  const displaySearchResults =
    showSearchResults &&
    !isQueryTooShortError &&
    moviesForList.length > 0 &&
    !searchError;

  const isLoadingDisplay = showSearchResults && isLoadingSearch;
  const displayError = showSearchResults && !isLoadingSearch && searchError;
  const displayQueryTooShort =
    showSearchResults &&
    !isLoadingSearch &&
    isQueryTooShortError &&
    !searchError;
  const displayNotFound =
    showSearchResults &&
    !isLoadingSearch &&
    !searchError &&
    !isQueryTooShortError &&
    moviesForList.length === 0 &&
    !!currentSearchQuery;

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center">
        <SearchBar onSearch={handleSearch} />
      </div>

      {isLoadingDisplay && <Spinner />}

      {displayError && (
        <p className="text-red-500 text-center">
          Ошибка: {(searchError as Error).message}
        </p>
      )}

      {displayQueryTooShort && (
        <p className="text-center mt-4">
          Пожалуйста, введите минимум {MIN_SEARCH_LENGTH} символа для поиска.
        </p>
      )}

      {displayNotFound && (
        <p className="text-muted-foreground text-center mt-4">
          Ничего не найдено по вашему запросу.
        </p>
      )}

      {displayPopular && (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Популярные фильмы
          </h2>
          <MovieList movies={initialPopularMovies} />
        </>
      )}

      {displaySearchResults && (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Результаты поиска
          </h2>
          <MovieList
            movies={moviesForList}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      )}
    </div>
  );
}
