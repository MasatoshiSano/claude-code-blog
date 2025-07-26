import { useState, useMemo } from "react";
import { useDebounce } from "./useDebounce";

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
  filterFn?: (item: T, query: string) => boolean;
  sortFn?: (a: T, b: T) => number;
}

export const useSearch = <T>({
  data,
  searchFields,
  debounceMs = 300,
  filterFn,
  sortFn,
}: UseSearchOptions<T>) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, debounceMs);

  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return sortFn ? [...data].sort(sortFn) : data;
    }

    const lowercaseQuery = debouncedQuery.toLowerCase();

    let filtered = data.filter((item) => {
      if (filterFn) {
        return filterFn(item, debouncedQuery);
      }

      return searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowercaseQuery);
        }
        if (typeof value === "number") {
          return value.toString().includes(lowercaseQuery);
        }
        return false;
      });
    });

    if (sortFn) {
      filtered = filtered.sort(sortFn);
    }

    return filtered;
  }, [data, debouncedQuery, searchFields, filterFn, sortFn]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        `<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">${part}</mark>`
      ) : (
        part
      )
    ).join('');
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    filteredData,
    highlightText,
    hasResults: filteredData.length > 0,
    resultCount: filteredData.length,
    isSearching: query !== debouncedQuery,
  };
};