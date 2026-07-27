import { Constants } from "@/common/constants";
import React from "react";
import AddressForm from "../../../../../../../components/mypage/addressForm";
import styles from "./page.module.css";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const response = await fetch(`${Constants.back_url}/user/${id}`);
  const user = await response.json();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>주소 변경</h2>

      <div className={styles.currentBox}>
        <h3 className={styles.subTitle}>현재 주소</h3>

        <div className={styles.info}>
          <div className={styles.row}>
            <span className={styles.label}>우편번호</span>
            <span>{user.postal_code}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>주소</span>
            <span>{user.address}</span>
          </div>
        </div>
      </div>

      <AddressForm
        id={id}
        postal_code={user.postal_code}
        address={user.address}
      />
    </div>
  );
}
