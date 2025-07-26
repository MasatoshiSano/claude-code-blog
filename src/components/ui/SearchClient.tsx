"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface SearchClientProps {
  placeholder?: string;
  className?: string;
  initialQuery?: string;
}

const SearchClient = ({
  placeholder = "検索...",
  className,
  initialQuery = "",
}: SearchClientProps) => {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
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

export default SearchClient;
