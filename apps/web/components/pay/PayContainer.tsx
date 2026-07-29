"use client";

import { useState } from "react";
import DeliveryInfo from "@/components/pay/DeliveryInfo";
import PayItem from "@/components/pay/PayItem";
import { DeliveryData, PayContainerProps } from "@/types/payType";
import { Constants } from "@/common/constants";
import styles from "./PayContainer.module.css";

export default function PayContainer({ data, params }: PayContainerProps) {
  const [delivery, setDelivery] = useState<DeliveryData>({
    recipient: data.recipient,
    phone_number: data.phone_number,
    postal_code: data.postal_code,
    delivery_info: data.delivery_info,
    delivery_inst: "",
  });

  const [payment, setPayment] = useState("계좌이체");

  const handlePay = async () => {
    if (!delivery.recipient.trim()) {
      alert("받는 분을 입력해주세요.");
      return;
    }

    if (!delivery.phone_number.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }

    if (!delivery.postal_code.trim()) {
      alert("주소를 선택해주세요.");
      return;
    }

    if (!delivery.delivery_info.trim()) {
      alert("배송지를 입력해주세요.");
      return;
    }

    const response = await fetch(`${Constants.back_url}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment: "계좌이체",
        ...delivery,
        items: data.items,
        isCartOrder: params.isCartOrder === "true",
      }),
    });

    if (!response.ok) {
      alert("결제에 실패했습니다.");
      return;
    }
  };

  return (
    <div className={styles.container}>
      <DeliveryInfo
        recipient={data.recipient}
        phone_number={data.phone_number}
        postal_code={data.postal_code}
        delivery_info={data.delivery_info}
        onChange={setDelivery}
      />

      <PayItem items={data.items} />

      <div className={styles.paymentBox}>
        <h3 className={styles.title}>결제 수단</h3>

        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="payment"
            value="계좌이체"
            checked={payment === "계좌이체"}
            onChange={(e) => setPayment(e.target.value)}
          />
          계좌이체 (국민은행 123456-78-901234 피카이)
        </label>

        <div className={styles.notice}>
          <div className={styles.noticeTitle}>[계좌이체 유의사항]</div>
          <p>• 계좌이체로 결제 완료 시 본인 계좌에서 즉시 이체 처리됩니다.</p>
          <p>• 은행별 시스템 점검 시간에는 이체가 제한될 수 있습니다.</p>
        </div>

        <button className={styles.payButton} onClick={handlePay}>
          결제하기
        </button>
      </div>
    </div>
  );
}
