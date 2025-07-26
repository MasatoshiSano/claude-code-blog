import { useState, useMemo } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      startIndex,
      endIndex,
      hasPrevious,
      hasNext,
      displayedItemsCount: endIndex - startIndex,
    };
  }, [currentPage, totalItems, itemsPerPage]);

  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, paginationInfo.totalPages));
    setCurrentPage(clampedPage);
  };

  const goToNextPage = () => {
    if (paginationInfo.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationInfo.hasPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(paginationInfo.totalPages);
  };

  const getPageNumbers = (maxVisible: number = 5) => {
    const { totalPages } = paginationInfo;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return {
    ...paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    getPageNumbers,
  };
};