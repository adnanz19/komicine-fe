"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoviePaginationProps } from "@/types/movie";

const MoviePagination: React.FC<MoviePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle page change dengan update URL
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
      return;
    }

    console.log(" MoviePagination: Page change", {
      from: currentPage,
      to: newPage,
      totalPages,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }

    const newUrl = params.toString()
      ? `/movies?${params.toString()}`
      : "/movies";
    router.push(newUrl);

    // Call parent handler
    onPageChange?.(newPage);
  };

  // Generate page numbers dengan ellipsis logic
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Berapa halaman sebelum/sesudah current page

    console.log("MoviePagination: Generate pages", {
      currentPage,
      totalPages,
      delta,
    });

    if (totalPages <= 7) {
      // Jika total pages <= 7, tampilkan semua
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic untuk pagination dengan ellipsis
      if (currentPage <= 3) {
        // Di awal: [1, 2, 3, 4, ..., last]
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Di akhir: [1, ..., last-3, last-2, last-1, last]
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Di tengah: [1, ..., current-1, current, current+1, ..., last]
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    console.log(" MoviePagination: Generated pages", pages);
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-8">

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-muted-foreground"
              >
                <MoreHorizontal className="w-4 h-4" />
              </div>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className={`min-w-10 ${
                isActive
                  ? "bg-purple-600 hover:bg-purple-700 border-purple-600"
                  : "hover:bg-purple-600/10 hover:border-purple-500"
              }`}
            >
              {pageNum}
            </Button>
          );
        })}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
};

export default MoviePagination;
