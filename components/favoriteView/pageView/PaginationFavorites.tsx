"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationFavoritesProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationFavorites = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationFavoritesProps) => {
  
  // Logika generate halaman (Disamakan dengan MangaPagination)
  const generatePageNumbers = () => {
    const current = currentPage;
    const pageNumbers: (number | string)[] = [];

    // Selalu tampilkan halaman 1
    pageNumbers.push(1);

    // Hitung range sekitar halaman aktif
    const startPage = Math.max(2, current - 1);
    const endPage = Math.min(totalPages - 1, current + 1);

    // Tambahkan ellipsis setelah halaman 1 jika perlu
    if (startPage > 2) {
      pageNumbers.push("ellipsis1");
    }

    // Tambahkan halaman di sekitar current page
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Tambahkan ellipsis sebelum halaman terakhir jika perlu
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis2");
    }

    // Selalu tampilkan halaman terakhir jika lebih dari 1 halaman
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-4 relative z-10">
      <Pagination>
        <PaginationContent>
          {/* Tombol Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
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

          {/* Nomor Halaman */}
          {generatePageNumbers().map((pageNum, index) => (
            <PaginationItem key={index}>
              {typeof pageNum === "string" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
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

          {/* Tombol Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Info Halaman */}
      <p className="text-xs text-slate-500">
        Halaman {currentPage} dari {totalPages}
      </p>
    </div>
  );
};

export default PaginationFavorites;