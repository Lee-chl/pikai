"use client";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pages = [1, 2, 3, 4];

  return (
    <div>
      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? "active" : ""}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
