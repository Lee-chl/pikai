import { Constants } from "@/common/constants";
import { PayItemType } from "@/types/payType";
import Image from "next/image";

interface PayItemProps {
  items: PayItemType[];
}

export default function PayItem({ items }: PayItemProps) {
  const imageUrl = `${Constants.image_url}/`;
  const totalPrice = items.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0,
  );
  return (
    <div>
      {items.map((item) => (
        <div key={item.detail_color_id}>
          <Image
            src={`${imageUrl}${item.image}`}
            alt={item.name}
            width={100}
            height={100}
          />
          <br />
          <label htmlFor="productName">제품명</label>
          <p>
            {item.name} [{item.colorName}]
          </p>
          <label htmlFor="quantity">구매 수량</label>
          <p>{item.quantity}</p>
          <label htmlFor="price">구매가</label>
          <p>{(item.sale_price * item.quantity).toLocaleString()}원</p>
        </div>
      ))}
      <h3>총 결제 금액</h3>
      <p>{totalPrice.toLocaleString()}원</p>
    </div>
  );
}
