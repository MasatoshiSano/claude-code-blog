"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchBarProps } from "@/types";
import Button from "./Button";

const SearchBar = ({
  onSearch,
  placeholder = "検索...",
  className,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex items-center", className)}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="input pr-20"
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="absolute right-1"
      >
        検索
      </Button>
    </form>
  );
};

export default SearchBar;
