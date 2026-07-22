"use client";

import { OrderItem } from "@/types/OrderType";
import { OrderStatus } from "@repo/common";

interface OrderItemListProps {
  orderItem: OrderItem;
  orderStatus: OrderStatus;
  orderId: number;
}
export default function OrderItemList({
  orderItem,
  orderStatus,
  orderId,
}: OrderItemListProps) {
  return (
    <div>
      <div>
        <h4>상품명</h4>
        <h4>구매가</h4>
        <h4>수량</h4>
        <h4>진행현황</h4>
      </div>
      <div>
        <span>{orderItem.detailColor.products.color_main_image}</span>
        <span>{orderItem.detailColor.products.name}</span>
        <span>{}</span>
      </div>
    </div>
  );
}
