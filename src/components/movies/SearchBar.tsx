"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  debounceDelay?: number;
}

export function SearchBar({ onSearch, debounceDelay = 500 }: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedSearchQuery = useDebounce(inputValue, debounceDelay);

  useEffect(() => {
    onSearch(debouncedSearchQuery.trim());
  }, [debouncedSearchQuery, onSearch]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Поиск (от 3-х символов)..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10"
        aria-label="Поиск фильмов"
      />
    </div>
  );
}
