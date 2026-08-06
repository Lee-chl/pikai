import CategoryProductClient from "./categoryProductClient";

interface CategoryProductPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function CategoryProductPage({
  params,

  searchParams,
}: CategoryProductPageProps) {
  // 현재 카테고리 id

  const { id } = await params;

  // 검색어(q)가 없으면 빈 문자열 사용

  const { q = "" } = await searchParams;

  return <CategoryProductClient id={id} q={q} />;
}
