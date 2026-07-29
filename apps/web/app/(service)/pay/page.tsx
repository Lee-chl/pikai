import { Constants } from "@/common/constants";
import type { Metadata } from "next";
import styles from "./page.module.css";
import PayContainer from "@/components/pay/PayContainer";
import { PayProps } from "@/types/payType";

export const metadata: Metadata = {
  title: "결제",
  description: "회원의 상품 결제 페이지입니다.",
};

export default async function Page({ searchParams }: PayProps) {
  const params = await searchParams;

  const response = await fetch(`${Constants.back_url}/pay/page`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isCartOrder: params.isCartOrder === "true",
      selectedOnly: params.selectedOnly === "true",
      buyItems: params.buyItems ? JSON.parse(params.buyItems) : undefined,
    }),
  });
  const data = await response.json();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>주문/결제</h2>
      <PayContainer data={data} params={params} />
    </div>
  );
}
