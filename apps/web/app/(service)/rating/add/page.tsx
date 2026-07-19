import { redirect } from "next/navigation";
import SearchBarRating from "@/components/rating/SearchBar_rating";
import styles from "./rating-add.module.css";
import StarRating from "@/components/rating/StarRating";
import { Constants } from "@/common/constants";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ userId: string; id?: number; productId?: number }>;
}) {
  const { userId, id, productId } = await searchParams;
  let comCount: number = 0;

  if (!userId) {
    redirect("user/login");
  }

  // 비교 상품 count 가져오기
  try {
    const response = await fetch(`${Constants.back_url}/rating/comp`);
    const comData = await response.json();
    comCount = comData?.length;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className={styles.pageWrapper}>
      <h4 style={{ marginBottom: "1.5rem" }}>나만의 온라인 화장대</h4>
      <div className={styles.helpTextContainer}>
        <p className={styles.helpText}>
          사이트에 등록되지 않은 상품을 입력하고 싶으실 때는 엔터를 쳐주세요
        </p>
        <p className={styles.helpText}>
          사이트에 등록되어 있는 상품은 클릭해서 선택해주세요
        </p>
      </div>
      <div className={styles.searchGroupContainer}>
        <div className={styles.searchItem}>
          <label className={styles.label}>브랜드 상품 이름</label>
          <SearchBarRating isProduct={true} />
        </div>
        <div className={styles.searchItem}>
          <label className={styles.label}>컬러 이름</label>
          <SearchBarRating
            isProduct={false}
            productId={productId ? Number(productId) : null}
          />
        </div>
      </div>
      <div className={styles.ratingWrapper}>
        {id ? (
          <StarRating compRatingNum={comCount} detailColorId={id} />
        ) : (
          <StarRating compRatingNum={comCount} />
        )}
      </div>
    </div>
  );
}
