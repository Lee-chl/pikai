"use client";

import { Constants } from "@/common/constants";
import styles from "./deleteButton.module.css";

export default function DeleteButton({ id }: { id: number }) {
  const handleDelete = async () => {
    const userCancel = window.confirm(
      "정말 회원을 탈퇴하시겠습니까?\n(회원은 탈퇴 후 계정을 사용할 수 없으며 한 달 간 재가입이 불가능합니다.)",
    );

    if (!userCancel) return;

    const response = await fetch(`${Constants.back_url}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_active: false,
      }),
    });

    if (!response.ok) {
      alert("회원 탈퇴가 실패했습니다.");
      return;
    }

    alert("회원 탈퇴가 완료되었습니다.");
    window.location.href = "/pikai";
  };

  return (
    <button
      type="button"
      className={styles.deleteButton}
      onClick={handleDelete}
    >
      회원 탈퇴
    </button>
  );
}
