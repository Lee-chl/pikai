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
  const query = new URLSearchParams();

  if (params.isCartOrder) {
    query.append("isCartOrder", params.isCartOrder);
  }

  if (params.detailColorId) {
    query.append("detailColorId", params.detailColorId);
  }

  if (params.quantity) {
    query.append("quantity", params.quantity);
  }

  const response = await fetch(`${Constants.back_url}/pay?${query.toString()}`);
  console.log(query.toString());
  const data = await response.json();
  console.log(data);
  console.log(data.items);
  return <PayContainer data={data} params={params} />;
}
