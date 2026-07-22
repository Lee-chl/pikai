"use client";

import { useState } from "react";
import styles from "./passwordForm.module.css";
import { Constants } from "@/common/constants";

export default function PasswordForm({ id }: { id: number }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (!currentPassword.trim()) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    if (!newPassword.trim()) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }
    if (!confirmPassword.trim()) {
      alert("새 비밀번호 확인을 입력해주세요.");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      alert("새로운 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (currentPassword.trim() === newPassword.trim()) {
      alert("현재 비밀번호와 다른 비밀번호를 입력해주세요.");
      return;
    }

    const response = await fetch(`${Constants.back_url}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword.trim(),
        password: newPassword.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.message)) {
        alert(result.message[0]);
      } else {
        alert(result.message);
      }
      return;
    }

    alert("비밀번호가 변경되었습니다.");
    window.location.reload();
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
