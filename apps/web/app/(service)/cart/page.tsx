"use client";
import { useEffect, useState } from "react";
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
        console.log(data); // 장바구니 데이터 확인

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
    <main className="p-8">
      {/* 페이지 제목 */}
      <h1 className="text-3xl font-bold mb-8">장바구니</h1>

      {/* 배송 정보 */}
      <section className="border p-6 rounded-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">배송 정보</h2>

          {/* 배송지 수정 버튼 (다음 단계에서 기능 연결) */}
          <button className="border px-4 py-1 rounded">수정</button>
        </div>

        <div className="mt-5 space-y-2">
          {/* 현재는 임시 데이터 */}
          <p>받는 분 : -</p>
          <p>연락처 : -</p>
          <p>주소 : -</p>
        </div>

        <p className="text-red-500 mt-5">
          ※ 장바구니 페이지를 벗어나면 배송 정보는 초기화됩니다.
        </p>
      </section>

      {/* 다음 단계에서 상품목록을 추가할 영역 */}
      <section className="mt-10">상품 목록 영역</section>

      {/* 다음 단계에서 주문금액을 추가할 영역 */}
      <section className="mt-10">주문 금액 영역</section>
    </main>
  );
}
