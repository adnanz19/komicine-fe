import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../ui/pagination";

interface MangaPaginationProps {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}

const MangaPagination = ({
  pagination,
  currentPage,
  onPageChange,
}: MangaPaginationProps) => {
  console.log("MangaPagination props:", {
    currentPage,
    totalPages: pagination.last_visible_page,
    hasNextPage: pagination.has_next_page,
  });
  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const totalPages = pagination.last_visible_page;
    const current = currentPage;
    const pageNumbers: (number | string)[] = [];

    // Always show first page
    pageNumbers.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, current - 1);
    const endPage = Math.min(totalPages - 1, current + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push("ellipsis1");
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis2");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (pagination.last_visible_page <= 1) {
    return null;
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={
                currentPage <= 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/* Page Numbers */}
          {generatePageNumbers().map((pageNum, index) => (
            <PaginationItem key={index}>
              {typeof pageNum === "string" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    onPageChange(pageNum);
                  }}
                  isActive={pageNum === currentPage}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                console.log("Next clicked:", {
                  currentPage,
                  lastPage: pagination.last_visible_page,
                });
                if (currentPage < pagination.last_visible_page) {
                  console.log("Calling onPageChange with:", currentPage + 1);
                  onPageChange(currentPage + 1);
                }
              }}
              className={
                currentPage >= pagination.last_visible_page
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default MangaPagination;
