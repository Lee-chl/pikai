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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: "28px",
      }}
    >
      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? "active" : ""}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            margin: "0 14px",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: currentPage === page ? 700 : 400,
            color: currentPage === page ? "#111" : "#888",
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
