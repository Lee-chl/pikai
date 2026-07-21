"use client";
import { OrderListType } from "@/types/OrderType";
import { useRouter, useSearchParams } from "next/navigation";
import OrderListItem from "./OrderList-item";
import styles from "./OrderList.module.css";
import { Constants } from "@/common/constants";

interface OrderProps {
  orderList: OrderListType;
  totalQuantity: number;
  totalPage: number;
  totalPrice: number;
  currentPageNum: number;
  isLast: boolean;
}

export default function OrderList({
  orderList,
  totalPage,
  totalPrice,
  currentPageNum,
  totalQuantity,
  isLast,
}: OrderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNum));

    router.push(`?${params.toString()}`);
  };

  const handleNavigateToDetail = () => {
    router.push(`/order/${orderList.id.toString()}`);
  };

  const imageUrl = `${Constants.image_url}/${orderList.orderItem[0]?.detailColor.products.color_main_image}`;

  const range: (number | string)[] = [];

  if (totalPage && currentPageNum) {
    // 페이지가 5개 이하일 경우 그냥 다 보여주기
    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) {
        range.push(i);
      }
    } else {
      range.push(1);

      let start = currentPageNum - 1;
      let end = currentPageNum + 1;

      if (start <= 2) {
        start = 2;
        end = 4;
      }

      if (end >= totalPage - 1) {
        start = totalPage - 3;
        end = totalPage - 1;
      }

      if (start > 2) {
        range.push("...");
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (end < totalPage - 1) {
        range.push("...");
      }

      range.push(totalPage);
    }
  }

  return (
    <div>
      <div>
        <h4>주문 번호: {orderList.id}</h4>
        <h4>날짜: {orderList.order_date}</h4>
        <div>
          <button onClick={handleNavigateToDetail}>상세</button>
          <div>
            <Image
              src={imageUrl}
              width={200}
              height={200}
              alt={`${orderItem.detailColor.products.color_main_image} - ${orderItem.detailColor.color_name}`}
              loading="eager"
            />
          </div>
          <div>
            <span> 주문 상품 명</span>
            <span>수량</span>
            <span>가격</span>
            <span>상태</span>
          </div>
          <div>
            <span>
              {orderItem.detailColor.products.name}
              <br />
              {orderItem.detailColor.color_name}
            </span>
            <span>{totalQuantity}</span>
            <span>{totalPrice}</span>
            <span>{order_status}</span>
          </div>
        </div>
        <hr className={styles.line} />
      </div>
      {isLast ? (
        <div className={styles.pagination}>
          {range.map((page, index) => {
            // '...' 문자인 경우 버튼이 아닌 그냥 일반 글자로 띄우기
            if (page === "...") {
              return <span key={`ellipsis-${index}`}>...</span>;
            }
            // 숫자 페이지 버튼인 경우
            return (
              <button
                key={`page-${index}`}
                onClick={() => handlePageChange(Number(page))}
                /* 현재 페이지와 번호가 일치하면 active 클래스를 줘서 색을 다르게 만듭니다 */
                className={`${styles.pageButton} ${currentPageNum === page ? styles.active : ""}`}
              >
                {page}
              </button>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
