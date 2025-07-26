"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PaginationProps } from "@/types";
import Button from "./Button";

interface ClientPaginationProps extends Omit<PaginationProps, "onPageChange"> {
  category?: string;
  tag?: string;
}

const PaginationClient = ({
  currentPage,
  totalPages,
  category,
  tag,
  className,
}: ClientPaginationProps) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);

    router.push(`/?${params.toString()}`);
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        前へ
      </Button>

      {generatePageNumbers().map((page, index) => (
        <div key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-neutral-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "primary" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page as number)}
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        次へ
      </Button>
    </nav>
  );
};

export default PaginationClient;
