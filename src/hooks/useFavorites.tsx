"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useContext,
} from "react";
import { MovieShort } from "@/lib/types";

const FAVORITES_STORAGE_KEY = "movieCatalogFavorites";

interface FavoritesContextType {
  favorites: MovieShort[];
  addFavorite: (movie: MovieShort) => void;
  removeFavorite: (imdbID: string) => void;
  isFavorite: (imdbID: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<MovieShort[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Ошибка при загрузке избранного из localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error(
          "Ошибка при сохранении избранного в localStorage:",
          error
        );
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((movie: MovieShort) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.imdbID === movie.imdbID)) {
        return prevFavorites;
      }
      return [...prevFavorites, movie];
    });
  }, []);

  const removeFavorite = useCallback((imdbID: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.imdbID !== imdbID)
    );
  }, []);

  const isFavorite = useCallback(
    (imdbID: string): boolean => {
      return favorites.some((movie) => movie.imdbID === imdbID);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
