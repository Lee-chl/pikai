"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Cart } from "@/types/cartType";

// 장바구니 페이지
export default function CartPage() {
  const router = useRouter();
  // 장바구니 정보
  const [cart, setCart] = useState<Cart | null>(null);

  // 로딩 상태
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  // 장바구니 상품 목록
  const cartItems = cart?.cartItems ?? [];

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

  // 장바구니 상품 수량 변경
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/cart/items/${cartItemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("수량 변경 실패");
      }

      // 변경된 장바구니 다시 조회
      const cartResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/cart/user/1`,
      );

      const cartData = await cartResponse.json();

      setCart(cartData);
    } catch (error) {
      console.error(error);
    }
  };

  // 장바구니 상품 삭제
  const deleteCartItem = async (cartItemId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/cart/items/${cartItemId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("장바구니 상품 삭제 실패");
      }

      // 삭제 후 장바구니 다시 조회
      const cartResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/cart/user/1`,
      );

      const cartData = await cartResponse.json();

      setCart(cartData);

      // 삭제된 상품은 선택 목록에서도 제거
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    } catch (error) {
      console.error(error);
    }
  };

  // 선택한 장바구니 상품 삭제
  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) {
      alert("삭제할 상품을 선택해 주세요.");
      return;
    }

    for (const cartItemId of selectedItems) {
      await deleteCartItem(cartItemId);
    }
  };

  const updateSelectedItems = async () => {
    try {
      // 1. 모든 상품 선택 해제
      await Promise.all(
        cartItems.map((item) =>
          fetch(
            `${process.env.NEXT_PUBLIC_BACK_URL}/cart/items/${item.id}/select`,
            {
              method: "PATCH",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                is_selected: false,
              }),
            },
          ),
        ),
      );

      // 2. 선택된 상품만 true
      await Promise.all(
        selectedItems.map((cartItemId) =>
          fetch(
            `${process.env.NEXT_PUBLIC_BACK_URL}/cart/items/${cartItemId}/select`,
            {
              method: "PATCH",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                is_selected: true,
              }),
            },
          ),
        ),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleOrder = async () => {
    try {
      // 선택 상태 DB 저장
      await updateSelectedItems();

      // searchParams 생성
      const params = new URLSearchParams();
      params.set("isCartOrder", "true");
      params.set("selectedOnly", "true");

      // 결제 페이지 이동
      router.push(`/pay?${params.toString()}`);
    } catch (error) {
      console.error(error);
      alert("주문하기 중 오류가 발생했습니다.");
    }
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

  // 선택된 상품의 총 금액
  const selectedTotalPrice =
    cart?.cartItems
      ?.filter((item: any) => selectedItems.includes(item.id))
      .reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0,
      ) ?? 0;

  // 장바구니가 비어있는지 확인
  const isCartEmpty = !cart?.cartItems || cart.cartItems.length === 0;

  return (
    <main className={styles.container}>
      {/* 로딩 메시지 */}
      {loading && <p>장바구니를 불러오는 중입니다.</p>}

      {/* 에러 메시지 */}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {/* 빈 장바구니 안내 */}
      {!loading && !error && isCartEmpty && (
        <p className={styles.emptyMessage}>장바구니에 담긴 상품이 없습니다.</p>
      )}
      {!isCartEmpty && (
        <>
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

            <button
              type="button"
              className={styles.toolbarDeleteButton}
              onClick={deleteSelectedItems}
            >
              삭제
            </button>
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
                        <button
                          type="button"
                          className={styles.quantityButton}
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                        >
                          -
                        </button>

                        <span className={styles.quantityNumber}>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className={styles.quantityButton}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
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
                <strong>{selectedTotalPrice.toLocaleString("ko-KR")}원</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>총 선택 상품 금액</span>
                <strong>{selectedTotalPrice.toLocaleString("ko-KR")}원</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>배송비</span>
                <strong>무료</strong>
              </div>

              <div className={styles.summaryTotal}>
                <span>총 주문 예상 금액</span>
                <strong>{selectedTotalPrice.toLocaleString("ko-KR")}원</strong>
              </div>

              <button
                type="button"
                className={styles.orderButton}
                onClick={handleOrder}
              >
                주문하기
              </button>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
