"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

// 장바구니 페이지
export default function CartPage() {
  // 장바구니 정보
  const [cart, setCart] = useState<any>(null);

  // 로딩 상태
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleItemSelect = (cartItemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId],
    );
  };
  // 전체 상품 선택 또는 전체 해제
  const handleSelectAll = () => {
    const allItemIds = cart?.cartItems?.map((item: any) => item.id) ?? [];

    const isAllSelected =
      allItemIds.length > 0 &&
      allItemIds.every((id: number) => selectedItems.includes(id));

    setSelectedItems(isAllSelected ? [] : allItemIds);
  };
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

        console.log("장바구니 전체 데이터:", data);
        console.log("장바구니 상품:", data.cartItems);

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
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={
              cart?.cartItems?.length > 0 &&
              selectedItems.length === cart.cartItems.length
            }
            onChange={handleSelectAll}
          />
          <span>전체선택</span>
        </label>

        <button type="button" className={styles.toolbarDeleteButton}>
          삭제
        </button>
      </div>

      {/* 판매처 */}
      <div className={styles.mallHeader}>
        <label className={styles.mallLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={
              cart?.cartItems?.length > 0 &&
              selectedItems.length === cart.cartItems.length
            }
            onChange={handleSelectAll}
          />
          <span>PIKAI공식몰</span>
        </label>
      </div>

      {/* 장바구니 상품 목록 */}
      <div className={styles.cartContent}>
        <section className={styles.productList}>
          {cart?.cartItems?.map((item: any) => (
            <div key={item.id} className={styles.productCard}>
              <div className={styles.cartItem}>
                {/* 상품 체크박스 */}
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                />

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
                    상품가격 :{" "}
                    {item.detailColor.products.price.toLocaleString()}원
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

                    <span className={styles.quantityNumber}>
                      {item.quantity}
                    </span>

                    <button type="button" className={styles.quantityButton}>
                      +
                    </button>
                  </div>
                </div>

                {/* 상품 가격 */}
                <div className={styles.discountArea}>
                  <p className={styles.discountPrice}>
                    {item.price.toLocaleString()}원
                  </p>
                </div>
              </div>
              {/* 배송비와 예상 주문금액 */}
              <div className={styles.productPriceInfo}>
                <div className={styles.priceInfoRow}>
                  <span>배송비</span>
                  <strong>무료</strong>
                </div>

                <div className={styles.priceInfoRow}>
                  <span>예상 주문금액</span>
                  <strong>
                    {(item.price * item.quantity).toLocaleString("ko-KR")}원
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 주문 금액 영역 */}
        <section className={styles.orderSummary}>
          <div className={styles.summaryRow}>
            <span>주문 예상 금액</span>
            <strong>0원</strong>
          </div>

          <div className={styles.summaryRow}>
            <span>총 선택 상품 금액</span>
            <strong>0원</strong>
          </div>

          <div className={styles.summaryRow}>
            <span>배송비</span>
            <strong>무료</strong>
          </div>

          <div className={styles.summaryTotal}>
            <span>총 주문 예상 금액</span>
            <strong>0원</strong>
          </div>

          <button type="button" className={styles.orderButton}>
            주문하기
          </button>
        </section>
      </div>
    </main>
  );
}
