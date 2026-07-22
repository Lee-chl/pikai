"use client";

import styles from "./aiRecommend-popup.module.css";

// ===========================================
// 부모(ProductDetailClient)로부터 받을 데이터 타입
// ===========================================
interface AIRecommendPopupProps {
  open: boolean; // 팝업 열림 여부
  title: string; // AI 추천 제목
  message: string; // AI 추천 내용
  score: number; // AI 추천 점수
  onClose: () => void; // 닫기 버튼 클릭
}

// ===========================================
// AI 추천 팝업
// ===========================================
export default function AIRecommendPopup({
  open,
  title,
  message,
  score,
  onClose,
}: AIRecommendPopupProps) {
  // open이 false면 아무것도 그리지 않는다.
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {/* 제목 */}
        <h2>{title}</h2>

        {/* 점수 */}
        <p className={styles.score}>추천 점수 : {score}점</p>

        {/* 추천 내용 */}
        <p className={styles.message}>{message}</p>

        {/* 확인 버튼 */}
        <button className={styles.button} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
