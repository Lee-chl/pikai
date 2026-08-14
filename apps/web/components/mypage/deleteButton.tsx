"use client";

import { Constants } from "@/common/constants";
import styles from "./deleteButton.module.css";
import { UserInfoType } from "@/types/userType";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteButton({ id }: UserInfoType) {
  const handleDelete = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (token) {
      try {
        const response = await fetch(`${Constants.back_url}/user`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_active: false,
          }),
        });

        if (!response.ok) {
          toast.error("회원 탈퇴가 실패했습니다.");
          return;
        }

        toast.success("회원 탈퇴가 완료되었습니다.");
        document.cookie =
          "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/pikai";
      } catch (err) {
        console.error(err);
        toast.error("회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const confirmDelete = () => {
    setShowConfirm(true);
  };

  return (
    <div>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={confirmDelete}
      >
        회원 탈퇴
      </button>

      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmToast}>
            <p className={styles.confirmTitle}>정말 회원 탈퇴하시겠습니까?</p>

            <div className={styles.confirmText}>
              회원 탈퇴 후 계정을 사용할 수 없으며,
              <br />한 달간 재가입이 불가능합니다.
            </div>

            <div className={styles.confirmButtons}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowConfirm(false)}
              >
                취소
              </button>

              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => {
                  setShowConfirm(false);
                  handleDelete();
                }}
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
