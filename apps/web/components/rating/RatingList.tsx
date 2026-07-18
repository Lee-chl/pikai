"use client";
import { RatingItemType } from "../../types/ratingType";
import { useState } from "react";
import RatingItem from "./Rating-item";
import { Trash2 } from "lucide-react";
import styles from "./RatingList.module.css";
import { Constants } from "../../common/constants";
import { useRouter } from "next/navigation";

interface RatingItemProps {
  ratingItem: RatingItemType[];
  is_com: boolean;
}
export default function RatingList({ ratingItem, is_com }: RatingItemProps) {
  const router = useRouter();
  const [selectDelIds, setSelectDelIds] = useState<number[]>([]);

  // 별점 클릭 시 삭제할 별점 id 저장
  const handleDelSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectDelIds((prev) => [...prev, id]);
    } else {
      setSelectDelIds((prev) => prev.filter((rating) => rating !== id));
    }
  };

  const handleDelete = async () => {
    if (selectDelIds.length < 0) return alert("선택한 상품의 별점이 없습니다.");

    if (confirm(`선택한 ${selectDelIds.length}개의 별점을 지우시겠습니까??`)) {
      try {
        const response = await fetch(
          `${Constants.back_url}/rating?ids=${selectDelIds.join(",")}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          alert("별점 삭제 중 오류가 발생했습니다.");
          throw new Error(response.statusText);
        }
        setSelectDelIds([]);
        alert("성공적으로 별점이 삭제되었습니다.");
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleComDelete = async (id: number) => {
    if (id === 0) {
      return alert("삭제할 비교상품을 두번 클릭 해 선택해주세요");
    }

    if (confirm(`선택한 비교 상품을 지우시겠습니까?`)) {
      try {
        const response = await fetch(`${Constants.back_url}/rating/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_comp: false,
          }),
        });

        if (!response.ok) {
          alert("비교 상품 삭제 중 오류가 발생했습니다.");
          throw new Error(response.statusText);
        }

        alert("비교 상품 삭제가 성공적으로 완료되었습니다.");
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div>
      <div>
        {is_com ? (
          <div>
            <ul className={styles.card}>
              {ratingItem.map((rating) => (
                <li key={rating.id}>
                  <RatingItem ratingItem={rating} setComDel={handleComDelete} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <div className={styles.actionGroup}>
              <button className={`${styles.btn} ${styles.btnSave}`}>
                비교 상품 추가
              </button>
              <button
                onClick={handleDelete}
                className={`${styles.btn} ${styles.btnCancel}`}
                disabled={selectDelIds.length === 0}
              >
                <Trash2 className={styles.trash} />
              </button>
            </div>
            <ul className={styles.card}>
              {ratingItem.map((rating) => (
                <li key={rating.id}>
                  <RatingItem
                    ratingItem={rating}
                    isSelected={selectDelIds.includes(rating.id)}
                    onSelect={handleDelSelect}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
