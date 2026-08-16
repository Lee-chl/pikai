"use client";
import styles from "./Pagination.module.css";
interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPage,
  onPageChange,
}: PaginationProps) {
  const range: (number | string)[] = [];

  // 전체 페이지가 5개 이하이면 모든 페이지 번호를 보여줍니다.
  if (totalPage <= 5) {
    for (let i = 1; i <= totalPage; i++) {
      range.push(i);
    }
  } else {
    // 첫 페이지는 항상 보여줍니다.
    range.push(1);

    let start = currentPage - 1;
    let end = currentPage + 1;

    // 현재 페이지가 앞쪽에 있을 경우
    if (start <= 2) {
      start = 2;
      end = 4;
    }

    // 현재 페이지가 뒤쪽에 있을 경우
    if (end >= totalPage - 1) {
      start = totalPage - 3;
      end = totalPage - 1;
    }

    // 중간 페이지가 생략되는 경우 ...
    if (start > 2) {
      range.push("...");
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPage - 1) {
      range.push("...");
    }

    // 마지막 페이지는 항상 보여줍니다.
    range.push(totalPage);
  }

  return (
    <div className={styles.pagination}>
      {range.map((page, index) => {
        // ... 은 버튼이 아니라 글자로 표시합니다.
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          );
        }
        const isActive = currentPage === page;

        return (
          <button
            key={`page-${page}`}
            type="button"
            onClick={() => onPageChange(Number(page))}
            className={`${styles.pageButton} ${isActive ? styles.active : ""}`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
