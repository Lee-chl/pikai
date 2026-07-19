"use client";

import { ProductSortType } from "@/types/productSortTyps";

interface SortMenuProps {
  selectedSort: ProductSortType;
  onSortChange: (sort: ProductSortType) => void;
}

export default function SortMenu({
  selectedSort,
  onSortChange,
}: SortMenuProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <button
        type="button"
        onClick={() => onSortChange("latest")}
        disabled={selectedSort === "latest"}
      >
        최신등록순
      </button>

      <button
        type="button"
        onClick={() => onSortChange("priceAsc")}
        disabled={selectedSort === "priceAsc"}
      >
        낮은가격순
      </button>

      <button
        type="button"
        onClick={() => onSortChange("priceDesc")}
        disabled={selectedSort === "priceDesc"}
      >
        높은가격순
      </button>

      <button
        type="button"
        onClick={() => onSortChange("sales")}
        disabled={selectedSort === "sales"}
      >
        판매순
      </button>
    </div>
  );
}
