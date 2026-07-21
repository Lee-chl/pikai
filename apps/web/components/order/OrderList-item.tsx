"use client";
import { Constants } from "@/common/constants";
import { OrderItem } from "@/types/OrderType";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { OrderStatus } from "@repo/common";
interface OrderProps {
  orderItem: OrderItem;
  totalQuantity: number;
  orderId: number;
  totalPrice: number;
  order_status: OrderStatus;
}
export default function OrderListItem({
  orderItem,
  totalPrice,
  totalQuantity,
  order_status,
}: OrderProps) {
  const router = useRouter();
  return (
    <div>
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
    </div>
  );
}
