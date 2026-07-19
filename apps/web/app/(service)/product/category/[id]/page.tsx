"use client";

import { use, useEffect, useState } from "react";

import ProductList from "../../components/ProductList";
import SortMenu from "../../components/SortMenu";
import Pagination from "../../components/Pagination";

import type { ProductItemType } from "@/types/productItemType";
import type { ProductSortType } from "@/types/productSortTyps";

interface CategoryProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryProductPage({
  params,
}: CategoryProductPageProps) {
  const { id } = use(params);

  const [products, setProducts] = useState<ProductItemType[]>([]);

  const [selectedSort, setSelectedSort] = useState<ProductSortType>("latest");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSortChange = (sort: ProductSortType) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const backUrl = process.env.NEXT_PUBLIC_BACK_URL;

        const response = await fetch(
          `${backUrl}/products?page=${currentPage}&limit=10&sort=${selectedSort}&categoryId=${id}`,
        );

        if (!response.ok) {
          throw new Error("카테고리 상품을 불러오지 못했습니다.");
        }

        const data = await response.json();

        // API가 배열을 반환하는 경우와
        // { items: [...] } 형태를 반환하는 경우 모두 처리
        setProducts(data.items ?? data);
      } catch (error) {
        console.error(error);
        setError("카테고리 상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id, currentPage, selectedSort]);

  if (loading) {
    return <p>상품을 불러오는 중입니다.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>카테고리 상품</h1>

      <SortMenu selectedSort={selectedSort} onSortChange={handleSortChange} />

      {products.length === 0 ? (
        <p>해당 카테고리의 상품이 없습니다.</p>
      ) : (
        <ProductList products={products} />
      )}

      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </main>
  );
}
