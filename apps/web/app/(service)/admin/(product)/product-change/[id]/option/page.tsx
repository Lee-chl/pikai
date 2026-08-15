import { Constants } from "@/common/constants";
import { cookies } from "next/headers";
import ProductOption from "@/components/admin/product-option";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const productId = await params;
  const { page: pageParam } = await searchParams;

  const page = Number(pageParam ?? "1");
  const limit = 5;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let details;

  if (token) {
    try {
      const response = await fetch(
        `${Constants.back_url}/admin/${productId.id}/detail?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      details = await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.container}>
      <ProductOption details={details} productId={Number(productId.id)} />

      <div className={styles.pagination}>
        {Array.from({ length: details?.totalPage ?? 0 }, (_, i) => i + 1).map(
          (pageNumber) => (
            <Link
              key={pageNumber}
              href={`/admin/product-change/${productId.id}/option?page=${pageNumber}`}
              className={
                pageNumber === page ? styles.activePage : styles.pageButton
              }
            >
              {pageNumber}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
