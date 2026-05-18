import { useMemo, useState } from "react";
import { alphabetCharacters } from "../data/alphabetData";
import type { BaybayinCharacter, CharacterCategory } from "../types/alphabet";

interface UseAlphabetFilterReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CharacterCategory;
  setSelectedCategory: (category: CharacterCategory) => void;
  filteredCharacters: BaybayinCharacter[];
}

export const useAlphabetFilter = (): UseAlphabetFilterReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CharacterCategory>("all");

  const filteredCharacters = useMemo(() => {
    let filtered = alphabetCharacters;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((char) => char.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (char) =>
          char.latin.toLowerCase().includes(query) ||
          char.pronunciation.toLowerCase().includes(query) ||
          char.description.toLowerCase().includes(query) ||
          char.examples.some((example: string) =>
            example.toLowerCase().includes(query)
          )
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredCharacters,
  };
};
