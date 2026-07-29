"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.css";

// 장바구니 페이지
export default function CartPage() {
  // 장바구니 정보
  const [cart, setCart] = useState<any>(null);

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 에러 메시지
  const [error, setError] = useState("");

  // 장바구니 조회
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        // 현재는 테스트용 회원 ID 1
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/cart/user/1`,
        );

        if (!response.ok) {
          throw new Error("장바구니를 불러오지 못했습니다.");
        }

        const data = await response.json();

        console.log(data);
        console.log(data.cartItems);

        setCart(data);
      } catch (error) {
        console.error(error);
        setError("장바구니 조회 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  return (
    <main className={styles.container}>
      {/* 로딩 메시지 */}
      {loading && <p>장바구니를 불러오는 중입니다.</p>}

      {/* 에러 메시지 */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* 전체선택과 삭제 버튼 */}
      <div className={styles.cartToolbar}>
        <label className={styles.selectAllLabel}>
          <input type="checkbox" className={styles.checkbox} />
          <span>전체선택</span>
        </label>

        <button type="button" className={styles.toolbarDeleteButton}>
          삭제
        </button>
      </div>

      {/* 판매처 */}
      <div className={styles.mallHeader}>
        <label className={styles.mallLabel}>
          <input type="checkbox" className={styles.checkbox} />
          <span>PIKAI공식몰</span>
        </label>
      </div>

      {/* 장바구니 상품 목록 */}
      <section className={styles.productList}>
        {cart?.cartItems?.map((item: any) => (
          <div key={item.id} className={styles.productCard}>
            <div className={styles.cartItem}>
              {/* 상품 체크박스 */}
              <input type="checkbox" className={styles.checkbox} />

              {/* 상품 이미지 */}
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.detailColor.products.color_main_image}`}
                alt={item.detailColor.products.name}
                className={styles.productImage}
              />

              {/* 상품 정보 */}
              <div className={styles.productInfo}>
                {/* 상품명 */}
                <h3 className={styles.productName}>
                  {item.detailColor.products.name}
                </h3>

                {/* 원래 상품 가격 */}
                <p className={styles.originalPrice}>
                  상품가격 : {item.detailColor.products.price.toLocaleString()}
                  원
                </p>
              </div>
            </div>

            {/* 수량과 할인 적용가 */}
            <div className={styles.productBottom}>
              {/* 옵션 색상과 수량 */}
              <div>
                {/* 옵션 색상명 */}
                <p className={styles.colorName}>
                  {item.detailColor.color_name}
                </p>

                {/* 수량 */}
                <div className={styles.quantityControl}>
                  <button type="button" className={styles.quantityButton}>
                    -
                  </button>

                  <span className={styles.quantityNumber}>{item.quantity}</span>

                  <button type="button" className={styles.quantityButton}>
                    +
                  </button>
                </div>
              </div>

              {/* 할인 적용 가격 */}
              <div className={styles.discountArea}>
                <p className={styles.discountLabel}>할인 적용가</p>

                <p className={styles.discountPrice}>
                  {item.price.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 주문금액 영역 */}
      <section className={styles.orderSummary}>주문 금액 영역</section>
    </main>
  );
}
