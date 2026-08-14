"use client";

import { useState } from "react";
import styles from "./passwordForm.module.css";
import { Constants } from "@/common/constants";
import { toast } from "sonner";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!currentPassword.trim()) {
      toast.error("현재 비밀번호를 입력해주세요.");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("새 비밀번호를 입력해주세요.");
      return;
    }
    if (!confirmPassword.trim()) {
      toast.error("새 비밀번호 확인을 입력해주세요.");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error("새로운 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (currentPassword.trim() === newPassword.trim()) {
      toast.error("현재 비밀번호와 다른 비밀번호를 입력해주세요.");
      return;
    }
    if (newPassword.trim().length < 6) {
      toast.error("비밀번호는 공백 없이 6자 이상으로 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${Constants.back_url}/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword.trim(),
          password: newPassword.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("비밀번호가 변경되지 않았습니다.");
        return;
      }

      toast.success("비밀번호가 변경되었습니다.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("비밀번호 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>현재 비밀번호</label>
        <input
          type="password"
          className={styles.input}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호를 입력해주세요."
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>변경할 비밀번호</label>
        <input
          type="password"
          className={styles.input}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="변경할 비밀번호를 입력해주세요."
        />
      </div>
      {newPassword.length > 0 && newPassword.length < 6 && (
        <p className={styles.passwordGuide}>
          비밀번호는 6글자 이상 입력해주세요.
        </p>
      )}

      <div className={styles.inputGroup}>
        <label className={styles.label}>변경 비밀번호 확인</label>
        <input
          type="password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="변경할 비밀번호를 다시 입력해주세요."
        />
      </div>

      <button className={styles.saveButton} onClick={handleSave}>
        저장
      </button>
    </div>
  );
}
