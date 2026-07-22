"use client";

import { ProductItemType } from "@/types/productItemType";
import Pagination from "../../../components/products/Pagination";
import ProductList from "../../../components/products/ProductList";
import SortMenu from "../../../components/products/SortMenu";
import { useEffect, useState } from "react";
import { ProductSortType } from "@/types/productSortTyps";

interface ProductResponseType {
  items: ProductItemType[];
  total: number;
  page: number;
  limit: number;
}

export default function Page() {
  const [products, setProducts] = useState<ProductItemType[]>([]);

  const [selectedSort, setSelectedSort] = useState<ProductSortType>("latest");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const handleSortChange = (sort: ProductSortType) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/products?page=${currentPage}&limit=10&sort=${selectedSort}`,
      );

      if (!response.ok) {
        throw new Error("상품 목록을 가져오지 못했습니다.");
      }

      const data: ProductResponseType = await response.json();

      setProducts(data.items);
    } catch (error) {
      console.error(error);

      setError("상품 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_BACK_URL);
    fetchProducts();
  }, [selectedSort, currentPage]);

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 40px",
        boxSizing: "border-box",
      }}
    >
      <h3>전체상품 </h3>
      <SortMenu selectedSort={selectedSort} onSortChange={handleSortChange} />

      <ProductList products={products} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
