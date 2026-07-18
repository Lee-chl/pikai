"use client";
import styles from "./StarRating.module.css";
import { useState } from "react";
import { RatingItemType } from "../../types/ratingType";
import { useRouter, useSearchParams } from "next/navigation";
import { Constants } from "../../common/constants";
import StarRatingItem from "./StarRating-item";

interface StarRatingProps {
  rating?: RatingItemType;
  compRatingNum: number;
  detailColorId?: number;
}

export default function StarRating({
  rating,
  detailColorId,
  compRatingNum,
}: StarRatingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState<number>(rating?.star_rating || 0);
  const [isComp, setIsComp] = useState<boolean>(rating?.is_comp || false);

  const handleRatingChange = async () => {
    if (score < 0) return alert("별을 1개 이상 선택 해주세요");
    const userId = searchParams.get("userId");
    try {
      let response;
      if (rating) {
        const requestBody: {
          star_rating: number;
          is_comp?: boolean;
        } = {
          star_rating: score,
        };
        if (isComp !== rating.is_comp) {
          if (compRatingNum >= 10) {
            alert(`비교 상품은 10개까지만 추가 가능합니다`);
            return setIsComp(false);
          }
          if (rating) requestBody.is_comp = isComp;
        }
        response = await fetch(`${Constants.back_url}/rating/${rating.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        if (!detailColorId) {
          alert(
            "오전 9시에서 오후 6시 사이에 담당자가 해당 상품 컬러를 추가하겠습니다.",
          );
          router.push(`/rating?userId=${userId}&page=1`);
        }

        if (compRatingNum >= 10) {
          alert(`비교 상품은 10개까지만 추가 가능합니다`);
          return setIsComp(false);
        }
        const requestBody = {
          star_rating: score,
          is_comp: isComp,
          user_id: userId,
          detail_color_id: detailColorId,
        };
        response = await fetch(`${Constants.back_url}/rating`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      alert("저장이 성공적으로 완료되었습니다.");
      router.push(`/rating?userId=${userId}&page=1`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <p className={styles.questionTitle}>이 상품의 컬러는 만족스러우셨나요?</p>
      <StarRatingItem
        score={score}
        setScore={setScore}
        setIsComp={setIsComp}
        isComp={isComp}
      />
      <div className={styles.actionArea}>
        <button className={styles.okButton} onClick={handleRatingChange}>
          저장
        </button>
      </div>
    </div>
  );
}
