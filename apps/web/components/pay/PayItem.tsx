import { Constants } from "@/common/constants";
import { PayItemType } from "@/types/payType";
import Image from "next/image";
import styles from "./PayItem.module.css";

interface PayItemProps {
  items: PayItemType[];
}

export default function PayItem({ items }: PayItemProps) {
  const imageUrl = `${Constants.image_url}/`;

  if (!items || items.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>주문 상품</h2>
        <p className={styles.empty}>주문할 상품이 없습니다.</p>
      </div>
    );
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0,
  );
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>주문 상품</h2>

      {items.map((item) => (
        <div className={styles.card} key={item.detail_color_id}>
          <Image
            src={`${imageUrl}${item.image}`}
            alt={item.name}
            width={110}
            height={110}
            className={styles.image}
          />

          <div className={styles.productName}>
            <h3>{item.name}</h3>
            <p>[{item.colorName}]</p>
          </div>

          <div className={styles.info}>
            <div className={styles.row}>
              <span>수량</span>
              <span>{item.quantity}개</span>
            </div>

            <div className={styles.row}>
              <span>구매가</span>
              <span>
                {(item.sale_price * item.quantity).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.totalBox}>
        <span>총 결제 금액</span>
        <strong>{totalPrice.toLocaleString()}원</strong>
      </div>
    </div>
  );
}
