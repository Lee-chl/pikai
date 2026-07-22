"use client";

import { ProductSortType } from "@/types/productSortTyps";

interface SortMenuProps {
  selectedSort: ProductSortType;
  onSortChange: (sort: ProductSortType) => void;
}

const sortOptions: {
  label: string;
  value: ProductSortType;
}[] = [
  {
    label: "판매순",
    value: "sales",
  },
  {
    label: "최신등록순",
    value: "latest",
  },
  {
    label: "낮은가격순",
    value: "priceAsc",
  },
  {
    label: "높은가격순",
    value: "priceDesc",
  },
];

export default function SortMenu({
  selectedSort,
  onSortChange,
}: SortMenuProps) {
  return (
    <nav
      aria-label="상품 정렬"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: "24px",
        marginBottom: "30px",
        paddingTop: "18px",
        paddingBottom: "18px",
        borderTop: "1px solid #eeeeee",
        borderBottom: "1px solid #eeeeee",
      }}
    >
      {sortOptions.map((option, index) => {
        const isSelected = selectedSort === option.value;

        return (
          <div
            key={option.value}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={() => {
                //   onSortChange(option.value === "sales" ? "latest" : option.value)
                // }
                // aria-pressed={isSelected}
                // 판매순 기능이 아직 없으므로 최신등록순으로 요청
                if (option.value === "sales") {
                  onSortChange("latest");
                  return;
                }

                onSortChange(option.value);
              }}
              aria-pressed={
                option.value === "sales" ? false : selectedSort === option.value
              }
              style={{
                padding: "6px 22px",
                border: "none",
                backgroundColor: "transparent",
                color: isSelected ? "#111111" : "#777777",
                fontSize: "17px",
                fontWeight: isSelected ? 700 : 400,
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>

            {index < sortOptions.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  width: "1px",
                  height: "18px",
                  backgroundColor: "#dddddd",
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
