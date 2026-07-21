import { Constants } from "@/common/constants";
import { OrderListType } from "@/types/OrderType";
import styles from "./order.module.css";
import OrderList from "@/components/order/OrderList";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  let totalPage = 1;
  const currentPage = Number(page) || 1;
  let orderList: OrderListType[] = [];

  try {
    const response = await fetch(
      `${Constants.back_url}/order?page=${currentPage}`,
    );
    if (!response.ok) throw new Error(response.statusText);
    const orderJson = await response.json();
    orderList = orderJson?.orders;
    totalPage = orderJson?.totalPage;
  } catch (error) {
    console.error(error);
  }

  if (!orderList) {
    return (
      <div>
        <h3 className={styles.titleMain}>주문/결제 목록</h3>
        <p>주문 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h3 className={styles.titleMain}>주문/결제 목록</h3>
        <hr className={styles.line} />
        <div>
          {orderList.map((orders, index) => (
            <OrderList
              key={orders.id}
              orderList={orders}
              totalPage={totalPage}
              totalPrice={0}
              totalQuantity={0}
              currentPageNum={currentPage}
              isLast={index === orderList.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
