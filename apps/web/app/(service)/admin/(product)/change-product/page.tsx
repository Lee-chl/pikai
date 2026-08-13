import { Constants } from "@/common/constants";
import { cookies } from "next/headers";
import { type ProductAdminType } from "@/types/productItemType";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let products: ProductAdminType[] = [];

  if (token) {
    try {
      const response = await fetch(`${Constants.back_url}/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      products = await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  const imageUrl = `${Constants.image_url}/`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>상품 관리</h1>
        <p>등록된 상품을 관리할 수 있습니다.</p>
      </div>

      <div className={styles.productList}>
        {products.map((product: ProductAdminType) => (
          <div className={styles.productCard} key={product.id}>
            <div className={styles.productImage}>
              <Image
                src={`${imageUrl}${product.color_main_image}`}
                alt={product.name}
                width={110}
                height={110}
                loading="eager"
              />
            </div>

            <div className={styles.productInfo}>
              <h2>{product.name}</h2>

              <div className={styles.detail}>
                <span>{product.brand?.name}</span>
                <span>{product.category?.name}</span>
              </div>

              <p className={styles.price}>{product.price.toLocaleString()}원</p>
            </div>

            <div className={styles.actions}>
              <Link
                href={`/admin/change-product/${product.id}/option`}
                className={styles.optionButton}
              >
                상품 옵션 관리
              </Link>

              <Link
                href={`/admin/change-product/${product.id}`}
                className={styles.editButton}
              >
                상품 수정
              </Link>

              <button className={styles.deleteButton}>상품 삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
