import { Constants } from "@/common/constants";
import { formatDateSimple } from "@/common/date";
import { OrderListType } from "@/types/OrderType";
import { OrderStatusKor } from "@repo/common";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let orderList: OrderListType | null = null;
  try {
    const { id } = await params;
    const response = await fetch(`${Constants.back_url}/order/${id}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const order = await response.json();
    if (order && order.id) {
      orderList = order;
    }
  } catch (error) {
    console.error(`orderItem 가져오는 중 에러 내용: `, error);
  }

  if (!orderList) {
    return (
      <div>
        <h3> 주문 상품 상세를 가져올 수 없습니다. 다시 시도해주세요.</h3>
      </div>
    );
  }

  // total Price  계산
  const totalPrice = orderList.orderItem.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div>
      <div>
        <div>
          <h3>주문 상세</h3>
          <h4>주문 번호: {orderList.id}</h4>
          <h4>구매 날짜: {formatDateSimple(orderList.order_date)}</h4>
        </div>
        <hr />
        <div>
          <h3>주소</h3>
          <div>
            <p>받는 분 : {orderList.recipient}</p>
            <p>전화번호: {orderList.phone_number}</p>
            <p>
              주소 :[{orderList.postal_code}] {orderList.delivery_info}
            </p>
            <p>배송메시지: {orderList.delivery_inst}</p>
          </div>
        </div>
        <hr />
        <div>
          <h3>주문 상품</h3>
          {orderList.order_status === "AWAITING" || "PAYCOMPLETED" ? (
            <button>주문 취소</button>
          ) : orderList.order_status === "REFUND" || "RETURNS" || "EXCHANGE" ? (
            <span>
              OrderStatusKor[orderList.order_status as OrderStatusKor] ??
              orderList.order_status
            </span>
          ) : (
            <div>
              <button>교환</button> <button>반품</button>
            </div>
          )}
        </div>
        <div>{/* item 컴포넌트로 돌리기 */}</div>
        <hr />
        <div>
          <h3>결제 정보</h3>
          <div>
            <h4>{orderList.payment} 계좌이체로 진행</h4>
            <h4>총 {totalPrice.toLocaleString("ko-KR")}원</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
